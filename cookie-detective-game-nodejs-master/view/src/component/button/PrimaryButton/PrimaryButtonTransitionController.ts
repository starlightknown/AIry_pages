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
import {TimelineMax, Power2, Elastic, TweenLite} from 'gsap';

export default class PrimaryButtonTransitionController extends AbstractTransitionController {
  /**
   * @public
   * @method onClick
   */
  public onClick(): Promise<void> {
    return new Promise((resolve: Function) => {
      TweenLite.to(this.parentController.$el, 0.2, {
        scale: 0.8,
        ease: Power2.easeIn,
      });
      TweenLite.delayedCall(0.2, () => {
        TweenLite.to(this.parentController.$el, 0.4, {
          scale: 1,
          ease: Elastic.easeOut.config(0.75, 0.5),
          onComplete: resolve,
        });
      });
    });
  }

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
    timeline.set(parent.$el, {clearProps: 'transform'}, 0);

    timeline.fromTo(
      parent.$refs.background,
      0.8,
      {scale: 0},
      {scale: 1, ease: Power2.easeInOut},
      0,
    );

    if (parent.$refs.circleColor) {
      timeline.fromTo(
        parent.$refs.circleColor,
        0.8,
        {scale: 0},
        {scale: 1, ease: Power2.easeInOut},
        0,
      );
    }
    timeline.addLabel('afterCircle', '-=0.2');
    // timeline.add(bounceEffect(<HTMLElement>parent.$refs.label), 'afterCircle');
    timeline.fromTo(
      parent.$refs.label,
      0.6,
      {scale: 0},
      {scale: 1, ease: Elastic.easeOut.config(0.5, 1)},
      'afterCircle',
    );

    timeline.set(parent.$el, {pointerEvents: 'auto'}, 0.5);
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
    timeline.set(parent.$el, {pointerEvents: 'none'}, 0);
    timeline.to(parent.$el, 0.5, {scale: 0, ease: Power2.easeInOut});
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
}
