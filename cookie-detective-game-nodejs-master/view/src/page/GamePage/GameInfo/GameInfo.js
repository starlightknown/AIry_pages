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

import VueTypes from 'vue-types';
import {DisposableManager} from 'seng-disposable-manager';
import {DisposableEventListener} from 'seng-disposable-event-listener';
import {
  AbstractTransitionComponent,
  TransitionEvent,
} from 'vue-transition-component';
import GameInfoTransitionController from './GameInfoTransitionController';
import {getGameInfoItems} from './config';
import GameInfoItem
  from '../../../component/general/content/GameInfoItem/GameInfoItem';

// @vue/component
export default {
  name: 'GameInfo',
  components: {
    GameInfoItem,
  },
  extends: AbstractTransitionComponent,
  props: {
    maxQuestions: VueTypes.number.isRequired,
    autoCloseTime: VueTypes.number.def(2),
  },
  data() {
    return {
      gameInfoItems: getGameInfoItems({
        maxQuestions: this.maxQuestions,
      }),
    };
  },
  created() {
    this.disposableManager = new DisposableManager();
  },
  beforeDestroy() {
    this.clearCloseTimeout();

    if (this.disposableManager) {
      this.disposableManager.dispose();
    }

    this.$shutUp();
  },
  methods: {
    async handleTransitionInComplete() {
      await this.speak();
      this.startTimeout();
    },
    speak() {
      if (this.isClosed) return;
      return this.$say(this.$tFormatted('voice.gameloop_explanation'));
    },
    startTimeout() {
      if (this.isClosed) return;
      this.closeTimeout = setTimeout(() => {
        this.$emit('close');
      }, this.autoCloseTime * 1000);
    },
    clearCloseTimeout() {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
      }
    },
    handleTransitionOutStart() {
      this.clearCloseTimeout();
    },
    handleAllComponentsReady() {
      this.transitionController = new GameInfoTransitionController(this);
      this.disposableManager.add(
          new DisposableEventListener(
              this.transitionController,
              TransitionEvent.types.TRANSITION_IN_COMPLETE,
              this.handleTransitionInComplete.bind(this),
          ),
      );
      this.disposableManager.add(
          new DisposableEventListener(
              this.transitionController,
              TransitionEvent.types.TRANSITION_OUT_START,
              this.handleTransitionOutStart.bind(this),
          ),
      );
      this.isReady();
    },
    onStartClick() {
      this.isClosed = true;
      this.clearCloseTimeout();
      this.$emit('close');
    },
    handleComponentIsReady() {},
  },
};
