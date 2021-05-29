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

import {
  AbstractTransitionController,
  IAbstractTransitionComponent,
} from 'vue-transition-component';
import {TimelineMax} from 'gsap';

export default class LottieAnimationTransitionController extends AbstractTransitionController {
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
    const {meta, lottieAnimation, states} = <any>parent;
    const animation = meta.states[states.inAnimation];
    timeline.add(() => {
      lottieAnimation.loop = animation.loop;
      lottieAnimation.playSegments(animation.frames, true);
    }, 0);

    const frames = animation.frames[1] - animation.frames[0];
    timeline.fromTo(
      parent.$el,
      Math.max(0.1, frames / 24),
      {pointerEvents: 'none'},
      {pointerEvents: 'none'},
      0,
    );

    timeline.eventCallback('onStart', () => {
      (<any>parent).handleTransitionInStart();
    });

    timeline.eventCallback('onComplete', () => {
      (<any>parent).handleTransitionInComplete();
    });
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
    const {meta, lottieAnimation, states} = <any>parent;
    const animation = meta.states[states.outAnimation];

    if (animation) {
      timeline.add(() => {
        lottieAnimation.loop = animation.loop;
        lottieAnimation.playSegments(animation.frames, true);
      }, 0);

      const frames = animation.frames[1] - animation.frames[0];
      timeline.to(
        parent.$el,
        Math.max(0.1, frames / 24),
        {pointerEvents: 'none'},
        0,
      );
    } else {
      timeline.to(parent.$el, 0.5, {autoAlpha: 0});
    }

    timeline.eventCallback('onStart', () => {
      (<any>parent).handleTransitionOutStart();
    });
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
  ): void {
    const {meta, lottieAnimation, states} = <any>parent;
    const animation = meta.states[states.loopAnimation];
    if (animation) {
      timeline.add(() => {
        lottieAnimation.loop = animation.loop;
        lottieAnimation.playSegments(animation.frames, true);
      }, 0);

      const frames = animation.frames[1] - animation.frames[0];
      timeline.to(
        parent.$el,
        Math.max(0.1, frames / 24),
        {pointerEvents: 'none'},
        0,
      );
    }
  }
}
