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

import EventDispatcher from 'seng-event';
import {Linear, TweenLite} from 'gsap';
import {DisposableManager} from 'seng-disposable-manager';
import fitRect from 'fit-rect';
import LoadImageTask from 'task-loader/lib/task/LoadImageTask';
import Direction from '../../data/enum/Direction';
import IImageSequenceOptions from './data/interface/IImageSequenceOptions';
import DisposableType from '../../data/enum/type/DisposableType';

export default class ImageSequence extends EventDispatcher {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  private tween!: TweenLite | null;
  private stopped: boolean = false;
  protected direction: Direction = Direction.FORWARD;
  private loadImageTask!: LoadImageTask;
  private size: {width: number; height: number} = {width: 0, height: 0};
  protected frame: number = 0;
  protected loadImagesPromise!: Promise<any> | null;
  protected disposableManager: DisposableManager;

  private sources: Array<string> = [];
  protected options: IImageSequenceOptions = {
    startCount: 0,
    frameCount: 0,
    padCount: 0,
    loop: false,
    source: null,
    element: null,
    fps: 24,
    loopTimeout: 0,
    objectFit: 'contain',
  };

  /**
   * @description collection of the images used in the image sequence
   * @type {{}}
   */
  private images: Array<{asset: HTMLImageElement; index: number}> = [];

  constructor(options: IImageSequenceOptions) {
    super();

    this.options = Object.assign(this.options, options);
    this.disposableManager = new DisposableManager();
  }

  /**
   * @public
   * @method setup
   */
  public setup(): void {
    this.canvas = <HTMLCanvasElement>(
      (<HTMLElement>this.options.element).querySelector('canvas')
    );
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    this.frame =
      this.direction === Direction.FORWARD
        ? this.options.startCount
        : this.options.frameCount;

    this.prepareSources();
  }

  /**
   * @description: in case you want to switch from sequence.
   * @param {IImageSequenceOptions} options
   */
  protected init(options: IImageSequenceOptions): Promise<void> {
    this.stop();

    if (this.loadImageTask) {
      this.loadImageTask.dispose();
    }
    this.loadImagesPromise = null;

    this.options = Object.assign(this.options, options);
    this.prepareSources();

    this.frame =
      this.direction === Direction.FORWARD ? 0 : this.options.frameCount;
    return this.load();
  }

  /**
   * @public
   * @method load
   */
  public load(): Promise<void> {
    this.loadImages();
    this.handleResize();

    return (<Promise<any>>this.loadImagesPromise).then(() => this.drawFrame());
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
      this.tween = TweenLite.to(
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
            if (this.options.loop && this.tween) {
              this.frame =
                this.direction === Direction.FORWARD
                  ? this.options.startCount
                  : this.options.frameCount;
              this.tween = null;
              // Restart the animation

              if (this.options.loopTimeout) {
                this.disposableManager.add(
                  setTimeout(() => {
                    this.play(direction, speed);
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
      TweenLite.killTweensOf(this.tween);
      this.tween.kill();
      this.tween = null;
    }
  }

  /**
   * @private
   * @method prepareSources
   */
  protected prepareSources(): void {
    this.sources = [];
    if (this.options.source) {
      for (
        let i = this.options.startCount;
        i <= this.options.frameCount;
        i += 1
      ) {
        this.sources.push(
          `${this.options.source.replace(
            '{frame}',
            (<any>i.toString()).padStart(this.options.padCount, '0'),
          )}`,
        );
      }
    }
  }

  /**
   * @private
   * @method loadImages
   */
  protected loadImages(): Promise<void> {
    // Load the image
    this.loadImageTask = new LoadImageTask({
      assets: this.sources,
      onAssetLoaded: (result) => {
        this.images[result.index] = result;
      },
    });

    if (!this.loadImagesPromise) {
      this.loadImagesPromise = this.loadImageTask.load().then(() => {
        // this.loadImageTask.dispose();
      });
    }

    return this.loadImagesPromise;
  }

  protected getImageByFrame(
    frame: number = this.frame,
  ): {asset: HTMLImageElement; index: number} {
    return this.images[frame];
  }

  /**
   * @protected
   * @method drawFrame
   */
  protected drawFrame(frame: number = this.frame): void {
    const image = this.getImageByFrame(frame);

    if (image) {
      const rect = fitRect(
        [0, 0, image.asset.naturalWidth, image.asset.naturalHeight],
        [0, 0, this.size.width, this.size.height],
        this.options.objectFit,
      );

      this.ctx.clearRect(0, 0, this.size.width, this.size.height);
      this.ctx.drawImage(image.asset, rect[0], rect[1], rect[2], rect[3]);
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

    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;

    if (this.getImageByFrame(this.frame)) {
      this.drawFrame();
    }
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

    super.dispose();
  }
}
