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
  AbstractPageTransitionComponent,
  TransitionEvent,
} from 'vue-transition-component';
import {DisposableEventListener} from 'seng-disposable-event-listener';
import {DisposableManager} from 'seng-disposable-manager';
import HidingModeSelectionPageTransitionController
  from './HidingModeSelectionPageTransitionController';
import PrimaryButton from '../../component/button/PrimaryButton/PrimaryButton';
import SpeechBubble from '../../component/asset/SpeechBubble/SpeechBubble';
import LottieAnimation
  from '../../component/asset/LottieAnimation/LottieAnimation';
import LevelBackground
  from '../../component/general/level/LevelBackground/LevelBackground';
import {lottieAnimationId} from '../../data/type/LottieAnimationId';
import {gameSessionMixin} from '../../mixins/gameSessionMixin';
import {sceneDataMixin} from '../../mixins/sceneDataMixin';
import {sleep} from '../../util/sleep';
import {preloaderMixin} from '../../mixins/preloaderMixin';

export default {
  name: 'HidingModeSelectionPage',
  components: {
    PrimaryButton,
    SpeechBubble,
    LottieAnimation,
    LevelBackground,
  },
  extends: AbstractPageTransitionComponent,
  mixins: [
    gameSessionMixin,
    sceneDataMixin('hidingModeSelection'),
    preloaderMixin,
  ],
  data() {
    return {
      lottieAnimationId,
    };
  },
  created() {
    this.disposableManager = new DisposableManager();
    this.voices = {
      intro: this.$tFormatted('voice.hiding_method_1'),
      fallback: this.$tFormatted('voice.hiding_method_1_fallback'),
    };
    this.assets = {
      background: this.currentLevel.background,
    };
  },
  mounted() {
    this.$showFloor(false);
  },
  beforeDestroy() {
    if (this.disposableManager) {
      this.disposableManager.dispose();
    }
  },
  computed: {
    title() {
      return this.$t(`chooseHidingType.${this.currentLevel.id}.title`);
    },
  },
  methods: {
    // After transitions are ready
    async handleTransitionInComplete() {
      await sleep(800);
      this.$sprinkles.hide();
      this.transitionController.showCookie();
      this.speakAndListen();
    },

    async speakAndListen() {
      await this.$say(this.voices.fallback);

      if (this.expectedScene !== this.scene) return;

      this.$listen();

      this.transitionController.showButtons();
    },

    handleTextQueryError() {
      return this.transitionController.showButtons();
    },

    handleVoiceNoMatch() {
      return this.speakAndListen();
    },

    handleAutoHideCookie() {
      this.transitionController.hideButtons();

      if (this.$isBrowser) {
        this.onAutoHideCookie();
      } else {
        this.safeSend('hide yourself');
      }
    },

    handleManualHideCookie() {
      this.transitionController.hideButtons();

      if (this.$isBrowser) {
        this.onManualHideCookie();
      } else {
        this.safeSend('somebody else');
      }
    },

    onAutoHideCookie() {
      this.selectHidingMode('auto');
      this.setSceneInBrowser('game');
    },

    onManualHideCookie() {
      this.selectHidingMode('manual');
      this.setSceneInBrowser('game');
    },

    handleComponentIsReady() {},
    handleAllComponentsReady() {
      this.transitionController =
        new HidingModeSelectionPageTransitionController(this);

      this.disposableManager.add(
          new DisposableEventListener(
              this.transitionController,
              TransitionEvent.types.TRANSITION_IN_COMPLETE,
              this.handleTransitionInComplete.bind(this),
          ),
      );
      this.isReady();
    },
  },
};
