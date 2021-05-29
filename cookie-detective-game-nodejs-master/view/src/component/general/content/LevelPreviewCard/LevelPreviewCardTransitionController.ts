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

import {TimelineMax, Power2, Linear, Elastic} from 'gsap';
import {
  AbstractTransitionController,
  IAbstractTransitionComponent,
  TransitionDirection,
} from 'vue-transition-component';

export default class LevelPreviewCardTransitionController extends AbstractTransitionController {
  /**
   * Use this method to setup your transition in timeline
   *
   * @protected
   * @method setupTransitionInTimeline
   * @param {TimelineLite | TimelineMax} timeline The transition in timeline
   * @param {IAbstractTransitionComponent} parent The reference to the parent controller
   * @param {string} id The transition id that was provided when constructing the controller
   */
  protected setupTransitionInTimeline(
    timeline: TimelineMax,
    parent: IAbstractTransitionComponent,
    id: string,
  ): void {
    timeline.fromTo(
      parent.$el,
      0.3,
      {autoAlpha: 0},
      {autoAlpha: 1, ease: Linear.easeNone},
      0.2,
    );

    timeline.fromTo(
      parent.$el,
      1.2,
      {transform: 'translateZ(-560px)' + ' rotateY(-90deg)'},
      {transform: 'translateZ(0px) rotateY(0deg)', ease: Power2.easeOut},
      0.2,
    );
    // timeline.fromTo(parent.$el, 1.2, { z: -160, rotationY: -90 }, { z: 0, rotationY: 0, ease: Power2.easeOut }, 0.);
    timeline.add(this.getTimeline('button', TransitionDirection.IN), '-=1');
    timeline.addLabel('afterButton', '-=0.4');

    timeline.fromTo(
      parent.$refs.placeholder,
      0.5,
      {autoAlpha: 0},
      {autoAlpha: 1, ease: Linear.easeNone},
      'afterButton-=0.4',
    );
    timeline.fromTo(
      parent.$refs.name,
      0.6,
      {autoAlpha: 0, yPercent: 25},
      {yPercent: 0, autoAlpha: 1, ease: Linear.easeNone},
      'afterButton-=0.4',
    );
    timeline.fromTo(
      parent.$refs.name,
      0.6,
      {yPercent: 25},
      {yPercent: 0, ease: Power2.easeOut},
      'afterButton-=0.4',
    );

    if (parent.$refs.leaderboardItem) {
      timeline.add(
        this.getTimeline('leaderboardItem', TransitionDirection.IN),
        '-=0.4',
      );
    }
  }

  /**
   * Use this method to setup your transition out timeline
   *
   * @protected
   * @method setupTransitionOutTimeline
   * @param {TimelineLite | TimelineMax} timeline The transition in timeline
   * @param {IAbstractTransitionComponent} parent The reference to the parent controller
   * @param {string} id The transition id that was provided when constructing the controller
   */
  protected setupTransitionOutTimeline(
    timeline: TimelineMax,
    parent: IAbstractTransitionComponent,
    id: string,
  ): void {
    timeline.set(parent.$el, {pointerEvents: 'none'}, 0);
    timeline.to(
      parent.$el,
      1.2,
      {transform: 'translateZ(-560px) rotateY(-90deg)', ease: Power2.easeOut},
      0,
    );
    timeline.to(parent.$el, 0.8, {autoAlpha: 0, ease: Linear.easeNone}, 0);
  }

  /**
   * @public
   * @method triggerLockedLevelAnimation
   */
  public triggerLockedLevelAnimation(): void {
    const timeline = new TimelineMax();
    const currentCardElement = <HTMLElement>this.parentController.$el;

    timeline.to(
      currentCardElement,
      0.15,
      {x: -20, ease: Power2.easeInOut},
      0.5,
    );
    timeline.to(currentCardElement, 0.15, {x: 20, ease: Power2.easeInOut});

    timeline.to(currentCardElement, 0.15, {x: -20, ease: Power2.easeInOut});
    timeline.to(currentCardElement, 0.15, {x: 20, ease: Power2.easeInOut});

    timeline.to(currentCardElement, 0.15, {x: -20, ease: Power2.easeInOut});
    timeline.to(currentCardElement, 0.2, {x: 0, ease: Power2.easeInOut});

    const lockIcon = (<IAbstractTransitionComponent>(
      this.parentController.$refs.lock
    )).$el;
    timeline.to(lockIcon, 0.25, {yPercent: -20, ease: Power2.easeInOut}, 0.5);
    timeline.to(lockIcon, 0.25, {yPercent: 0, ease: Power2.easeInOut}, 0.75);
    timeline.to(lockIcon, 0.25, {yPercent: -10, ease: Power2.easeInOut}, 1);
    timeline.to(lockIcon, 0.25, {yPercent: 0, ease: Power2.easeInOut}, 1.25);

    timeline.to(lockIcon, 0.25, {rotation: 30, ease: Power2.easeInOut}, 0.5);
    timeline.to(lockIcon, 0.25, {rotation: 0, ease: Power2.easeInOut}, 0.75);
    timeline.to(lockIcon, 0.25, {rotation: 15, ease: Power2.easeInOut}, 1);
    timeline.to(lockIcon, 0.25, {rotation: 0, ease: Power2.easeInOut}, 1.25);

    timeline.to(lockIcon, 0.25, {rotation: 30, ease: Power2.easeInOut}, 0.5);
    timeline.to(lockIcon, 0.25, {rotation: 0, ease: Power2.easeInOut}, 0.75);
    timeline.to(lockIcon, 0.25, {rotation: 15, ease: Power2.easeInOut}, 1);
    timeline.to(lockIcon, 0.25, {rotation: 0, ease: Power2.easeInOut}, 1.25);

    const button = (<IAbstractTransitionComponent>(
      this.parentController.$refs.button
    )).$el;
    timeline.to(button, 0.25, {scale: 0.9, ease: Power2.easeIn}, 0);
    timeline.to(button, 0.25, {scale: 1.1, ease: Power2.easeIn}, 0.25);
    timeline.to(button, 0.25, {scale: 1, ease: Power2.easeIn}, 0.5);
  }

  /**
   * Use this method to setup your looping timeline
   *
   * @protected
   * @method setupLoopingAnimationTimeline
   * @param {TimelineLite | TimelineMax} timeline The transition in timeline
   * @param {IAbstractTransitionComponent} parent The reference to the parent controller
   * @param {string} id The transition id that was provided when constructing the controller
   */
  protected setupLoopingAnimationTimeline(
    timeline: TimelineMax,
    parent: IAbstractTransitionComponent,
    id: string,
  ): void {}
}
