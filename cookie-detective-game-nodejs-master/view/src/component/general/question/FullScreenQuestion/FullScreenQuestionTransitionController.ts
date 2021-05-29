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

import {Linear, TimelineMax} from 'gsap';
import {
  AbstractTransitionController,
  IAbstractTransitionComponent,
  TransitionDirection,
} from 'vue-transition-component';
import TimelineType from 'transition-controller/lib/enum/TimelineType';

export default class FullScreenQuestionTransitionController extends AbstractTransitionController {
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
      0.1,
      {pointerEvents: 'none', autoAlpha: 0},
      {pointerEvents: 'all', ease: Linear.easeNone, autoAlpha: 1},
    );
    timeline.add(this.getTimeline('question', TransitionDirection.IN), 0);
    timeline.add(
      this.getTimeline('characterAnimation', TransitionDirection.IN),
      0,
    );
  }

  get areButtonsHidden() {
    return this.getComponent('answerOptions').transitionController.isHidden;
  }

  async showButtons() {
    return this.getComponent('answerOptions').transitionIn(true);
  }

  hideButtons() {
    this.getComponent('answerOptions').transitionOut(true);
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
    timeline.add(this.getTimeline('question', TransitionDirection.OUT), 0);

    if (!this.getComponent('answerOptions').transitionController.isHidden) {
      timeline.add(
        this.getTimeline('answerOptions', TransitionDirection.OUT),
        0,
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
