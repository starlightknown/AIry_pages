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
  AbstractTransitionComponent,
  TransitionEvent,
} from 'vue-transition-component';
import VueTypes from 'vue-types';
import {DisposableEventListener} from 'seng-disposable-event-listener';
import {DisposableManager} from 'seng-disposable-manager';
import ChooseHidingTypeTransitionController
  from './ChooseHidingTypeTransitionController';
import PrimaryButton
  from '../../../component/button/PrimaryButton/PrimaryButton';
import SpeechBubble from '../../../component/asset/SpeechBubble/SpeechBubble';
import {cookieHidingTypeId} from '../../../data/type/CookieHidingTypeId';
import LottieAnimation
  from '../../../component/asset/LottieAnimation/LottieAnimation';
import {lottieAnimationId} from '../../../data/type/LottieAnimationId';
import {PLATFORMS} from '../../../util/getPlatform';

export default {
  name: 'ChooseHidingType',
  components: {
    PrimaryButton,
    SpeechBubble,
    LottieAnimation,
  },
  extends: AbstractTransitionComponent,
  props: {
    title: VueTypes.string.isRequired,
  },
  data() {
    return {
      lottieAnimationId,
    };
  },
  created() {
    this.disposableManager = new DisposableManager();
  },
  beforeDestroy() {
    if (this.disposableManager) {
      this.disposableManager.dispose();
    }
  },
  methods: {
    // After transitions are ready
    async handleTransitionInStart() {
      await this.$say(this.$tFormatted('voice.hiding_method_1'));
      this.listenForVoiceInput();
    },

    listenForVoiceInput() {
      this.$listen((input, noMatch) => {
        console.debug('voice input: ', input, noMatch);
        if (noMatch || !input) return this.handleVoiceNoMatch();
        // these are dummy checks, understand what's the real input
        if (input === 'auto') return this.onAutoHideCookie();
        if (input === 'manual') return this.onManualHideCookie();
        return this.handleVoiceNoMatch();
      });
    },

    async handleVoiceNoMatch() {
      // do something
      await this.$say(this.$tFormatted('voice.hiding_method_1'));
      this.listenForVoiceInput();
    },

    handleAutoHideCookie() {
      if (this.$platform === PLATFORMS.BROWSER) {
        this.onAutoHideCookie();
      } else {
        this.$send('hide yourself');
      }
    },

    handleManualHideCookie() {
      if (this.$platform === PLATFORMS.BROWSER) {
        this.onManualHideCookie();
      } else {
        this.$send('somebody else');
      }
    },

    async onAutoHideCookie() {
      await this.$say(this.$tFormatted('voice.hiding_method_self'));
      this.$emit('hidingTypeSelected', cookieHidingTypeId.auto);
    },
    async onManualHideCookie() {
      await this.$say(this.$tFormatted('voice.hiding_method_manual_1'));
      this.$emit('hidingTypeSelected', cookieHidingTypeId.manual);
    },
    handleComponentIsReady() {},
    handleAllComponentsReady() {
      this.transitionController = new ChooseHidingTypeTransitionController(
          this,
      );
      this.disposableManager.add(
          new DisposableEventListener(
              this.transitionController,
              TransitionEvent.types.TRANSITION_IN_START,
              this.handleTransitionInStart.bind(this),
          ),
      );
      this.isReady();
    },
  },
};
