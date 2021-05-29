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

import {TimelineMax, Power2} from 'gsap';
import {
  AbstractTransitionController,
  IAbstractTransitionComponent,
  TransitionDirection,
} from 'vue-transition-component';

export default class LevelSelectionPageTransitionController extends AbstractTransitionController {
  private outroTimeline!: TimelineMax;

  /**
   * Use this method to setup your transition in timeline
   *
   * @protected
   * @method setupTransitionInTimeline
   * @param {TimelineMax} timeline The transition in timeline
   * @param {IAbstractTransitionComponent} parent The reference to the parent controller
   * @param {string} id The transition id that was provided when constructing the controller
   */
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: IAbstractTransitionComponent,
    id: string,
  ): void {
    timeline.fromTo(parent.$el, 0.1, {autoAlpha: 0}, {autoAlpha: 1});
    timeline.add(this.getTimeline('title', TransitionDirection.IN));

    (<Array<IAbstractTransitionComponent>>parent.$refs.cards).forEach(
      (component, index: number) => {
        timeline.add(
          this.getTimeline(component, TransitionDirection.IN),
          index * 0.6 + 0.4,
        );
      },
    );
  }

  public moveCardToCenter(index: number = 0): Promise<void> {
    const cards = <Array<IAbstractTransitionComponent>>(
      this.parentController.$refs.cards
    );
    const currentCard = <HTMLElement>cards[index].$el;
    const cardWidth = currentCard.offsetWidth;
    const spaceBetweenCard =
      (<HTMLElement>cards[1].$el).offsetLeft -
      ((<HTMLElement>cards[0].$el).offsetLeft + cardWidth);
    const cardOffset = (spaceBetweenCard / cardWidth) * 100;
    let xOffset: number = 0;

    if (index === 0) {
      xOffset = 100 + cardOffset;
    }
    if (index === 2) {
      xOffset = -100 - cardOffset;
    }

    return new Promise((resolve: Function) => {
      this.outroTimeline = new TimelineMax({
        onComplete: resolve,
      });

      this.outroTimeline.add(
        this.getTimeline('title', TransitionDirection.OUT),
        0,
      );
      this.outroTimeline.set(
        currentCard,
        {zIndex: 1, pointerEvents: 'none'},
        0,
      );
      this.outroTimeline.fromTo(
        currentCard,
        1,
        {scale: 1, xPercent: 0, yPercent: 0},
        {
          scale: 1.2,
          xPercent: xOffset,
          yPercent: -5,
          z: 100,
          zIndex: 5,
          ease: Power2.easeInOut,
        },
        0,
      );
    });
  }

  /**
   * Use this method to setup your transition out timeline
   *
   * @protected
   * @method setupTransitionOutTimeline
   * @param {TimelineMax} timeline The transition in timeline
   * @param {IAbstractTransitionComponent} parent The reference to the parent controller
   * @param {string} id The transition id that was provided when constructing the controller
   */
  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: IAbstractTransitionComponent,
    id: string,
  ): void {
    timeline.to(parent.$el, 0.6, {pointerEvents: 'none', autoAlpha: 0});
  }

  /**
   * Use this method to setup your looping timeline
   *
   * @protected
   * @method setupLoopingAnimationTimeline
   * @param {TimelineMax} timeline The transition in timeline
   * @param {IAbstractTransitionComponent} parent The reference to the parent controller
   * @param {string} id The transition id that was provided when constructing the controller
   */
  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: IAbstractTransitionComponent,
    id: string,
  ): void {}

  /**
   * @public
   * @method dispose
   */
  public dispose(): void {
    if (this.outroTimeline) {
      this.outroTimeline.kill();
    }
    super.dispose();
  }
}
