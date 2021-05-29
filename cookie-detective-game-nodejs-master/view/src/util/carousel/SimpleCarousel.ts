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
import {TweenLite, Power3} from 'gsap';
import Draggable from 'gsap/Draggable';
import debounce from 'lodash/debounce';
import clamp from 'lodash/clamp';
import ThrowPropsPlugin from '../../vendor/gsap/ThrowPropsPlugin';
import {DisposableEventListener} from 'seng-disposable-event-listener';
import CarouselEvent from './CarouselEvent';

export default class SimpleCarousel extends EventDispatcher {
  private wrapperElement: HTMLElement;
  private dragElement: HTMLElement;
  private carouselItems: Array<HTMLElement>;

  private dragger!: Draggable;

  private resizeListener: DisposableEventListener;

  private activeIndex: number = 0;

  constructor(
    wrapperElement: HTMLElement,
    dragElement: HTMLElement,
    carouselItems: Array<HTMLElement>,
  ) {
    super();
    this.wrapperElement = wrapperElement;
    this.dragElement = dragElement;
    this.carouselItems = carouselItems;

    this.resizeListener = new DisposableEventListener(
      window,
      'resize',
      debounce(this.handleResize.bind(this), 150),
    );

    this.carouselItems.forEach((element, index) => {
      TweenLite.set(element, {xPercent: index * 100});
    });

    this.createDragger();
  }

  public previous(): void {
    this.activeIndex = Math.max(0, this.activeIndex - 1);
    this.goto();
  }

  public next(): void {
    this.activeIndex = Math.min(
      this.carouselItems.length - 1,
      this.activeIndex + 1,
    );
    this.goto();
  }

  public handleResize(): void {
    this.dragger.applyBounds(this.getBounds());
    this.goto(true);
  }

  public setIndex(index: number): void {
    if (index < 0 || index > this.carouselItems.length - 1) return;

    this.activeIndex = index;
  }

  private createDragger(): void {
    ThrowPropsPlugin;
    [this.dragger] = Draggable.create(this.dragElement, {
      type: 'x',
      throwProps: true,
      zIndexBoost: false,
      bounds: this.getBounds(),
      snap: this.getSnap.bind(this),
    });
  }

  private getBounds(): {minX: number; maxX: number} {
    return {
      maxX: 0,
      minX:
        -this.carouselItems[0].offsetWidth * (this.carouselItems.length - 1),
    };
  }

  private getSnap(endValue: number): number {
    const itemWidth = this.carouselItems[0].offsetWidth;
    const newIndex = clamp(
      Math.round(endValue / itemWidth) * -1,
      0,
      this.carouselItems.length - 1,
    );

    if (newIndex !== this.activeIndex) {
      this.dispatchEvent(new CarouselEvent(CarouselEvent.CHANGE, {}));
    }

    this.activeIndex = newIndex;

    return -this.activeIndex * itemWidth;
  }

  public goto(immediate: boolean = false): void {
    const itemWidth = this.carouselItems[0].offsetWidth;
    TweenLite.to(this.dragElement, immediate ? 0 : 0.8, {
      x: -this.activeIndex * itemWidth,
      ease: Power3.easeInOut,
    });
  }
}
