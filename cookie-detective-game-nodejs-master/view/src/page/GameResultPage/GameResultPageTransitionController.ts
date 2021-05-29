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

import {TimelineMax, Power2, TweenLite, Linear} from 'gsap';
import TransitionDirection from 'transition-controller/lib/enum/TransitionDirection';
import {
  AbstractTransitionController,
  IAbstractTransitionComponent,
} from 'vue-transition-component';

export default class GameResultPageTransitionController extends AbstractTransitionController {
  private highScoreTimeline!: TimelineMax;
  private danceTimeline!: TimelineMax;

  /**
   * @public
   * @method playDanceTimeline
   */
  public playDanceTimeline(): Promise<void> {
    return new Promise((resolve: Function) => {
      this.danceTimeline.eventCallback('onComplete', () => resolve());
      this.danceTimeline.play();
    });
  }

  /**
   * @public
   * @method playHighScoreTimeline
   */
  public playHighScoreTimeline(): Promise<void> {
    return new Promise((resolve: Function) => {
      this.highScoreTimeline.eventCallback('onComplete', () => resolve());
      this.highScoreTimeline.play();
    });
  }

  /**
   * @public
   * @method startDance
   */
  public setupDanceTimeline(): void {
    const {gameResult} = <any>this.parentController;
    const crossPageTransitionWaitTime = 1.16;
    const startCharacter = crossPageTransitionWaitTime;
    const endDisco =
      crossPageTransitionWaitTime + (gameResult.isGameOver() ? 0 : 6);
    this.danceTimeline = new TimelineMax({paused: true});

    if (!gameResult.isGameOver()) {
      // this.danceTimeline.add(this.getTimeline('discoLights', TransitionDirection.IN), 0);
      this.danceTimeline.add(() => {
        (<IAbstractTransitionComponent>(
          this.parentController.$refs.discoLights
        )).transitionOut();
      }, endDisco);

      this.danceTimeline.fromTo(
        (<IAbstractTransitionComponent>(
          this.parentController.$refs.lottieAnimation
        )).$el,
        1,
        {opacity: 0, xPercent: 50},
        {
          opacity: 1,
          xPercent: 0,
          force3D: true,
          ease: Power2.easeInOut,
        },
        0,
      );

      this.danceTimeline.add(
        this.getTimeline('lottieAnimation', TransitionDirection.IN),
        0.1,
      );
    } else {
      this.danceTimeline.fromTo(
        (<IAbstractTransitionComponent>(
          this.parentController.$refs.lottieAnimation
        )).$el,
        2.5,
        {opacity: 0, xPercent: 250},
        {
          opacity: 1,
          xPercent: 0,
          force3D: true,
          ease: Power2.easeOut,
        },
        0,
      );
      this.danceTimeline.add(
        this.getTimeline('lottieAnimation', TransitionDirection.IN),
        1,
      );
    }

    this.danceTimeline.paused(true);
  }

  /**
   * @public
   * @method showHighScore
   */
  public setupHighScoreTimeline(): void {
    const {gameResult} = <any>this.parentController;

    this.highScoreTimeline = new TimelineMax({
      paused: true,
    });

    this.highScoreTimeline.fromTo(
      this.parentController.$refs.content,
      1,
      {xPercent: gameResult.isGameOver() ? 0 : 25},
      {xPercent: 0, ease: Power2.easeInOut},
      0,
    );
    this.highScoreTimeline.add(
      this.getTimeline('gameResultCard', TransitionDirection.IN),
      0.4,
    );
    this.highScoreTimeline.paused(true);
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
    this.setupHighScoreTimeline();
    this.setupDanceTimeline();

    timeline.fromTo(parent.$el, 0.5, {autoAlpha: 0}, {autoAlpha: 1}, 0);
    if (!(<any>this.parentController).gameResult.isGameOver()) {
      timeline.add(this.getTimeline('discoLights', TransitionDirection.IN), 0);
    }
  }

  /**
   * @public
   * @method showButtons
   */
  public showButtons(): void {
    const ctaLeft = this.getComponent('ctaButtonLeft');

    if (ctaLeft && ctaLeft.transitionController.isHidden) {
      (<IAbstractTransitionComponent>(
        this.parentController.$refs.ctaButtonLeft
      )).transitionIn();
    }

    const ctaRight = this.getComponent('ctaButtonRight');

    if (ctaRight && ctaRight.transitionController.isHidden) {
      TweenLite.delayedCall(0.2, () => {
        (<IAbstractTransitionComponent>(
          this.parentController.$refs.ctaButtonRight
        )).transitionIn();
      });
    }
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
    timeline.to(parent.$el, 1.5, {autoAlpha: 0}, 0);

    const ctaLeft = this.getComponent('ctaButtonLeft');

    if (ctaLeft && !ctaLeft.transitionController.isHidden) {
      timeline.add(
        this.getTimeline('ctaButtonLeft', TransitionDirection.OUT),
        0,
      );
    }

    const ctaRight = this.getComponent('ctaButtonRight');

    if (ctaRight && !ctaRight.transitionController.isHidden) {
      timeline.add(
        this.getTimeline('ctaButtonRight', TransitionDirection.OUT),
        0.1,
      );
    }
  }

  /**
   * @public
   * @method showUnlockedLevel
   */
  public showUnlockedLevel(): Promise<void> {
    const resultCard = <IAbstractTransitionComponent>(
      this.parentController.$refs.gameResultCard
    );
    const unlockedCard = <IAbstractTransitionComponent>(
      this.parentController.$refs.levelUnlockedView
    );

    return new Promise((resolve: Function) => {
      resultCard.transitionOut();
      TweenLite.delayedCall(
        resultCard.transitionController.transitionOutTimeline.duration() - 0.6,
        () => {
          unlockedCard.transitionIn().then(() => {
            resolve();
          });
        },
      );
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
