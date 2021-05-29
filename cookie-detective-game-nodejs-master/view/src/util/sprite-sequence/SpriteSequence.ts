/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import EventDispatcher from 'seng-event/lib/EventDispatcher';
import {Linear, TweenLite, TweenMax} from 'gsap';
import DisposableManager from 'seng-disposable-manager/lib/DisposableManager';
import fitRect from 'fit-rect';
import {LoadImageTask} from 'task-loader';
import {formatImage} from '../../util/task-loader/formatAssetUtils';
import Direction from '../../data/enum/Direction';
import ISpriteSequenceOptions from './data/interface/ISpriteSequenceOptions';
import DisposableType from '../../data/enum/type/DisposableType';

/**
 * Create sprites with: https://css.spritegen.com/ (padding 4px)
 */
export default class SpriteSequence extends EventDispatcher {
  private canvas!: HTMLCanvasElement | null;
  private ctx!: CanvasRenderingContext2D;
  private loadImageTask!: LoadImageTask;
  private stopped: boolean = false;
  private image!: HTMLImageElement;

  private size: {width: number; height: number} = {width: 0, height: 0};
  private tween!: TweenMax | null;
  protected direction: Direction = Direction.FORWARD;
  protected frame: number = 0;
  protected loadImagePromise!: Promise<any> | null;
  protected disposableManager: DisposableManager;

  protected options: ISpriteSequenceOptions = {
    gutter: {
      x: 0,
      y: 0,
    },
    startCount: 0,
    frameCount: 0,
    loop: false,
    element: null,
    source: null,
    fps: 24,
    loopTimeout: 0,
    objectFit: 'contain',
    columns: 0,
    size: {
      width: 0,
      height: 0,
    },
  };

  constructor(options: ISpriteSequenceOptions, private assetPath: string) {
    super();

    this.options = Object.assign(this.options, options);
    this.disposableManager = new DisposableManager();
  }

  /**
   * @public
   * @method setup
   */
  public setup(canvas?: HTMLCanvasElement): void {
    this.canvas =
      canvas ||
      <HTMLCanvasElement>(
        (<HTMLElement>this.options.element).querySelector('canvas')
      );

    // Not appended to DOM, but used as shadow canvas.
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
    }

    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    this.frame =
      this.direction === Direction.FORWARD
        ? this.options.startCount
        : this.options.frameCount;

    // this.prepareSources();
  }

  /**
   * @description: in case you want to switch from sequence.
   * @param {IImageSequenceOptions} options
   */
  protected init(options: ISpriteSequenceOptions): Promise<void> {
    this.stop();

    if (this.loadImageTask) {
      this.loadImageTask.dispose();
    }
    this.loadImagePromise = null;

    this.options = Object.assign(this.options, options);
    // this.prepareSources();

    this.frame =
      this.direction === Direction.FORWARD ? 0 : this.options.frameCount;
    return this.load();
  }

  /**
   * @public
   * @method load
   */
  public load(): Promise<void> {
    this.loadImage();
    this.handleResize();

    return (<Promise<any>>this.loadImagePromise).then(() => this.drawFrame());
  }

  public restart(
    direction: Direction = Direction.FORWARD,
    speed: number = 1,
  ): Promise<void> {
    this.frame =
      this.direction === Direction.FORWARD
        ? this.options.startCount
        : this.options.frameCount;
    this.tween = null;
    return this.play(direction, speed);
  }

  /**
   * @public
   * @method reset
   */
  public reset(direction: Direction = Direction.FORWARD): void {
    this.stop();
    this.frame =
      this.direction === Direction.FORWARD
        ? this.options.startCount
        : this.options.frameCount;
    this.drawFrame(Math.round(this.frame));
  }

  /**
   * @public
   * @method play
   */
  public play(
    direction: Direction = Direction.FORWARD,
    speed: number = 1,
  ): Promise<void> {
    return new Promise((resolve) => {
      this.stop();
      this.direction = direction;
      const frames = Math.abs(
        this.frame -
          (this.direction === Direction.FORWARD
            ? this.options.frameCount
            : this.options.startCount),
      );

      this.stopped = false;
      this.tween = TweenMax.to(
        this,
        (frames / this.options.fps) * (1 / Math.max(0.01, speed)),
        {
          frame:
            direction === Direction.FORWARD
              ? this.options.frameCount
              : this.options.startCount,
          ease: Linear.easeNone,
          onUpdate: () => this.drawFrame(Math.round(this.frame)),
          onComplete: () => {
            // If loop is set, restart the animation
            if (this.options.loop && this.tween && !this.stopped) {
              this.frame =
                this.direction === Direction.FORWARD
                  ? this.options.startCount
                  : this.options.frameCount;
              this.tween = null;
              // Restart the animation
              if (this.options.loopTimeout) {
                this.disposableManager.add(
                  setTimeout(() => {
                    if (!this.stopped) {
                      this.play(direction, speed);
                    }
                  }, this.options.loopTimeout),
                  DisposableType.TIMEOUT,
                );
              } else {
                this.play(direction, speed);
              }
            }
            // Trigger a complete callback for each time the loop is completed
            resolve();
          },
        },
      );
    });
  }

  /**
   * @public
   * @method stop
   */
  public stop(): void {
    this.stopped = true;

    if (this.tween) {
      this.tween.pause();
      TweenLite.killTweensOf(this.tween);
      this.tween.kill();
      this.tween = null;
    }
  }

  /**
   * @private
   * @method loadImage
   */
  protected loadImage(): Promise<void> {
    // Load the image
    this.loadImageTask = new LoadImageTask({
      assets: formatImage(<string>this.options.source, this.assetPath),
      onAssetLoaded: (result) => {
        this.image = result.asset;
      },
    });

    if (!this.loadImagePromise) {
      this.loadImagePromise = this.loadImageTask.load().then(() => {
        // this.loadImageTask.dispose();
      });
    }

    return this.loadImagePromise;
  }

  /**
   * @protected
   * @method drawFrame
   */
  public drawFrame(frame: number = this.frame): void {
    const image = this.image;

    if (image) {
      const rect = fitRect(
        [0, 0, this.options.size.width, this.options.size.height],
        [0, 0, this.size.width, this.size.height],
        this.options.objectFit,
      );

      const mappedFrame = this.options.mapping
        ? this.options.mapping[frame]
        : frame;
      const currentColumn = mappedFrame % this.options.columns;
      const currentRow = Math.floor(mappedFrame / this.options.columns);

      const sx =
        currentColumn * (this.options.size.width + this.options.gutter.x) +
        this.options.gutter.x;
      const sy =
        currentRow * (this.options.size.height + this.options.gutter.y);

      this.ctx.clearRect(0, 0, this.size.width, this.size.height);
      this.ctx.drawImage(
        image,
        sx,
        sy,
        this.options.size.width,
        this.options.size.height,
        rect[0],
        rect[1],
        rect[2],
        rect[3],
      );
    }
  }

  /**
   * @protected
   * @method handleDeviceStateChange
   */
  public handleResize(
    size: {width: number; height: number} = {width: 0, height: 0},
  ): void {
    this.size.width =
      size.width ||
      (<HTMLElement>this.options.element).offsetWidth * window.devicePixelRatio;
    this.size.height =
      size.height ||
      (<HTMLElement>this.options.element).offsetHeight *
        window.devicePixelRatio;

    (<HTMLCanvasElement>this.canvas).width = this.size.width;
    (<HTMLCanvasElement>this.canvas).height = this.size.height;

    if (this.image) {
      this.drawFrame();
    }
  }

  /**
   * @public
   * @method getCanvas
   */
  public getCanvas(): HTMLCanvasElement {
    return <HTMLCanvasElement>this.canvas;
  }

  /**
   * @public
   * @method dispose
   */
  public dispose(): void {
    this.stop();

    if (this.loadImageTask) {
      this.loadImageTask.dispose();
    }

    if (this.disposableManager) {
      this.disposableManager.dispose();
    }

    this.canvas = null;

    super.dispose();
  }
}
