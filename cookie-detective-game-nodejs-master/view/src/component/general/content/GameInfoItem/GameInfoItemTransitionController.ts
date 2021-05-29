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

import {TimelineMax, Power2, Linear} from 'gsap';
import TransitionDirection from 'transition-controller/lib/enum/TransitionDirection';
import {
  AbstractTransitionController,
  IAbstractTransitionComponent,
} from 'vue-transition-component';
import {bounceEffect} from '../../../../animation/splittedTextAnimation';

export default class GameInfoItemTransitionController extends AbstractTransitionController {
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
      0,
    );
    timeline.fromTo(
      parent.$el,
      1.2,
      {transform: 'translateZ(-560px)' + ' rotateY(-90deg)'},
      {transform: 'translateZ(0px) rotateY(0deg)', ease: Power2.easeOut},
      0,
    );
    if ((<IAbstractTransitionComponent>parent.$refs.visualItem).$el) {
      timeline.add(
        this.getTimeline('visualItem', TransitionDirection.IN),
        '-=0.4',
      );
    } else {
      timeline.add(bounceEffect(<HTMLElement>parent.$refs.visualItem), '-=0.4');
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
    timeline.to(
      parent.$el,
      1.2,
      {transform: 'translateZ(-560px) rotateY(-90deg)', ease: Power2.easeOut},
      0,
    );
    timeline.to(parent.$el, 0.8, {autoAlpha: 0, ease: Linear.easeNone}, 0);
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
