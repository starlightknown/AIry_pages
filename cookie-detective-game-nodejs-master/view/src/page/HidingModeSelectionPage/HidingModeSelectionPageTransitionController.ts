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
  TransitionDirection,
} from 'vue-transition-component';
import {TimelineMax, Linear} from 'gsap';

export default class HidingModeSelectionPageTransitionController extends AbstractTransitionController {
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
    timeline.fromTo(
      parent.$el,
      0.1,
      {pointerEvents: 'none'},
      {pointerEvents: 'all', ease: Linear.easeNone},
    );
    timeline.fromTo(
      parent.$el,
      1.16,
      {autoAlpha: 0},
      {autoAlpha: 1, ease: Linear.easeNone},
    );
  }

  showCookie() {
    const timeline = new TimelineMax();
    timeline.add(this.getTimeline('speechBubble', TransitionDirection.IN), 0);
    timeline.add(
      this.getTimeline('characterAnimation', TransitionDirection.IN),
      0,
    );
  }

  showButtons() {
    const timeline = new TimelineMax();
    timeline.add(this.getTimeline('autoButton', TransitionDirection.IN), 0.8);
    timeline.add(this.getTimeline('manualButton', TransitionDirection.IN), 1);
  }

  hideButtons() {
    const timeline = new TimelineMax();
    timeline.add(this.getTimeline('autoButton', TransitionDirection.OUT), 0);
    timeline.add(
      this.getTimeline('manualButton', TransitionDirection.OUT),
      0.2,
    );
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
    timeline.add(this.getTimeline('speechBubble', TransitionDirection.OUT), 0);

    if (!this.getComponent('autoButton').transitionController.isHidden) {
      timeline.add(this.getTimeline('autoButton', TransitionDirection.OUT), 0);
    }

    if (!this.getComponent('manualButton').transitionController.isHidden) {
      timeline.add(
        this.getTimeline('manualButton', TransitionDirection.OUT),
        0.1,
      );
    }

    timeline.add(
      this.getTimeline('characterAnimation', TransitionDirection.OUT),
      0,
    );
    timeline.to(parent.$el, 0.1, {
      pointerEvents: 'none',
      ease: Linear.easeNone,
    });
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
