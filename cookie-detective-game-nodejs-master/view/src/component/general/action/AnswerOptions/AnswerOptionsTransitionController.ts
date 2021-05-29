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

import {TimelineMax, Linear} from 'gsap';
import TransitionDirection from 'transition-controller/lib/enum/TransitionDirection';
import {
  AbstractTransitionController,
  IAbstractTransitionComponent,
} from 'vue-transition-component';

export default class AnswerOptionsTransitionController extends AbstractTransitionController {
  private hideButtonTimeline!: TimelineMax;
  private showButtonTimeline!: TimelineMax;

  getButtons(parent = this.parentController) {
    return (parent.$refs.answerButtons || []) as IAbstractTransitionComponent[];
  }

  /**
   * @public
   * @method hideButtons
   */
  public async hideButtons(): Promise<void> {
    return new Promise((resolve: Function) => {
      if (this.hideButtonTimeline) {
        this.hideButtonTimeline.kill();
      }

      this.hideButtonTimeline = new TimelineMax({
        onComplete: resolve,
      });
      this.getButtons().forEach((component, index: number) => {
        if (component.transitionController.isHidden) return;

        this.hideButtonTimeline.add(
          this.getTimeline(component, TransitionDirection.OUT),
          index * 0.1,
        );
      });
    });
  }

  /**
   * @public
   * @method showButton
   */
  public async showButtons(): Promise<void> {
    return new Promise((resolve: Function) => {
      if (this.showButtonTimeline) {
        this.showButtonTimeline.kill();
      }
      this.showButtonTimeline = new TimelineMax({
        onComplete: resolve,
      });
      this.getButtons().forEach((component, index: number) => {
        if (!component.transitionController.isHidden) return;

        this.showButtonTimeline.add(
          this.getTimeline(component, TransitionDirection.IN),
          index * 0.2,
        );
      });
    });
  }

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
      {pointerEvents: 'none'},
      {pointerEvents: 'all', ease: Linear.easeNone},
    );
    let buttonsDuration: number = 0;

    this.getButtons(parent).forEach((component, index: number) => {
      if (!component.transitionController.isHidden) return;

      timeline.add(
        this.getTimeline(component, TransitionDirection.IN),
        index * 0.2,
      );
      buttonsDuration += component.transitionController.transitionInTimeline.duration();
    });

    const refreshButton = <IAbstractTransitionComponent>(
      parent.$refs.refreshButton
    );
    if (refreshButton) {
      timeline.add(
        this.getTimeline(refreshButton, TransitionDirection.IN),
        timeline.duration() -
          refreshButton.transitionController.transitionInTimeline.duration(),
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
    const buttons = this.getButtons(parent);
    buttons.forEach((component, index: number) => {
      if (component.transitionController.isHidden) return;

      timeline.add(
        this.getTimeline(component, TransitionDirection.OUT),
        index * 0.1,
      );
    });

    const refreshButton = <IAbstractTransitionComponent>(
      parent.$refs.refreshButton
    );
    if (refreshButton) {
      timeline.add(
        this.getTimeline(refreshButton, TransitionDirection.OUT),
        timeline.duration(),
      );
    }
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

  /**
   * @public
   * @method dispose
   */
  public dispose(): void {
    if (this.hideButtonTimeline) {
      this.hideButtonTimeline.kill();
    }
    if (this.showButtonTimeline) {
      this.showButtonTimeline.kill();
    }
    super.dispose();
  }
}
