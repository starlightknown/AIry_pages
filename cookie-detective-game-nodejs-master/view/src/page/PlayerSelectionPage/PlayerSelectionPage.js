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
import PlayerSelectionPageTransitionController
  from './PlayerSelectionPageTransitionController';
import PrimaryButton from '../../component/button/PrimaryButton/PrimaryButton';
import FullScreenQuestion
  from '../../component/general/question/FullScreenQuestion/FullScreenQuestion';
import Direction from '../../data/enum/Direction';
import {lottieAnimationId} from '../../data/type/LottieAnimationId';
import {sceneDataMixin} from '../../mixins/sceneDataMixin';
import {preloaderMixin} from '../../mixins/preloaderMixin';

export default {
  name: 'PlayerSelectionPage',
  components: {
    PrimaryButton,
    FullScreenQuestion,
  },
  mixins: [sceneDataMixin('playerSelection'), preloaderMixin],
  extends: AbstractPageTransitionComponent,
  data() {
    return {
      question: {},
    };
  },
  created() {
    this.disposableManager = new DisposableManager();

    const players = this.players.slice(1, 3);
    this.question = {
      id: 'playerSelection',
      question: this.$t('revisit.question.whoAreYou'),
      options: [
        ...players.map((player) => {
          const username = `${player.color} ${player.animal}`;
          return {
            id: player.id,
            label: username,
          };
        }),
        {
          id: false,
          label: this.$t('global.unknownPlayer'),
        },
      ],
      maxAnswers: 3,
      direction: Direction.RIGHT,
      characterAnimation: lottieAnimationId.characterQuestionLeft1,
    };

    const voiceArgs = {
      userName1: this.question.options[0].label,
      userName2: players.length > 1 && this.question.options[1].label,
    };

    this.voices = {
      intro: this.$tFormatted('voice.intro_revisit_player_check', voiceArgs),
      fallback: this.$tFormatted(
          'voice.intro_revisit_player_check_fallback',
          voiceArgs,
      ),
    };
  },
  beforeDestroy() {
    if (this.disposableManager) {
      this.disposableManager.dispose();
    }
  },
  methods: {
    handleVoiceNoMatch() {
      return this.speakAndListen(this.voices.fallback);
    },

    onAnswerSelect(data) {
      if (!this.$isBrowser) return this.$send(data.label);

      if (data.answerId) {
        const player = this.getPlayerById(data.answerId);
        this.selectPlayer(player);
        this.setSceneInBrowser('levelSelection');
      } else {
        this.setSceneInBrowser('tutorial');
      }
    },

    async handleTransitionInStart() {
      this.$showFloor(false);

      this.$sprinkles.show();

      this.speakAndListen(this.voices.intro);
    },

    async speakAndListen(voicePhrase) {
      await this.$say(voicePhrase);

      if (this.expectedScene !== this.scene) return;

      this.$listen();
      this.$refs.questions.transitionController.showButtons();
    },

    handleComponentIsReady() {},
    handleAllComponentsReady() {
      this.transitionController = new PlayerSelectionPageTransitionController(
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
