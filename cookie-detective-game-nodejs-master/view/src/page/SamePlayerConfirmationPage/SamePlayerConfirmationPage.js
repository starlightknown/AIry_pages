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
import SamePlayerConfirmationPageTransitionController
  from './SamePlayerConfirmationPageTransitionController';
import PrimaryButton from '../../component/button/PrimaryButton';
import FullScreenQuestion
  from '../../component/general/question/FullScreenQuestion';
import Direction from '../../data/enum/Direction';
import {lottieAnimationId} from '../../data/type/LottieAnimationId';
import {sceneDataMixin} from '../../mixins/sceneDataMixin';
import {preloaderMixin} from '../../mixins/preloaderMixin';

export default {
  name: 'SamePlayerConfirmationPage',
  components: {
    PrimaryButton,
    FullScreenQuestion,
  },
  mixins: [sceneDataMixin('samePlayerConfirmation'), preloaderMixin],
  extends: AbstractPageTransitionComponent,
  data() {
    return {
      question: {},
    };
  },
  computed: {
    lastActivePlayer() {
      return this.players[0];
    },
  },
  created() {
    this.disposableManager = new DisposableManager();

    const userName = `${
      this.lastActivePlayer.color
    } ${
      this.lastActivePlayer.animal
    }`;

    this.voices = {
      intro: this.$tFormatted('voice.intro_revisit', {userName}),
      fallback: this.$tFormatted('voice.intro_revisit_fallback', {userName}),
    };

    this.question = {
      id: 'samePlayerConfirmation',
      question: this.$tFormatted('revisit.question.isThatStillYou', {userName}),
      options: [
        {
          id: true,
          label: this.$t('global.yes'),
        },
        {
          id: false,
          label: this.$t('global.no'),
        },
      ],
      maxAnswers: 2,
      direction: Direction.LEFT,
      characterAnimation: lottieAnimationId.characterQuestionLeft1,
    };
  },
  beforeDestroy() {
    if (this.disposableManager) {
      this.disposableManager.dispose();
    }
  },
  methods: {
    // Merge similar pages into one?
    handleVoiceNoMatch() {
      return this.speakAndListen(this.voices.fallback);
    },

    handleTextQueryError() {
      return this.$refs.questions.transitionController.showButtons();
    },

    async onAnswerSelect(data) {
      await this.$refs.questions.transitionController.hideButtons();

      if (!this.$isBrowser) {
        this.safeSend(data.label);
      }

      if (data.answerId) {
        this.selectPlayer(this.lastActivePlayer);
        this.setSceneInBrowser('levelSelection');
        return;
      }

      this.setSceneInBrowser(
        this.players.length < 2 ? 'tutorial' : 'playerSelection',
      );
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
      this.transitionController =
        new SamePlayerConfirmationPageTransitionController(this);

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
