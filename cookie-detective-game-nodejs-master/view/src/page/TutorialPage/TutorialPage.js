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

import {TweenLite} from 'gsap';
import {
  AbstractPageTransitionComponent,
  TransitionEvent,
} from 'vue-transition-component';
import {DisposableEventListener} from 'seng-disposable-event-listener';
import {DisposableManager} from 'seng-disposable-manager';
import TutorialPageTransitionController
  from './TutorialPageTransitionController';
import PrimaryButton from '../../component/button/PrimaryButton/PrimaryButton';
import SecondaryButton
  from '../../component/button/SecondaryButton/SecondaryButton';
import PrimaryTextReveal
  from '../../component/type/PrimaryTextReveal/PrimaryTextReveal';
import SpeechBubble from '../../component/asset/SpeechBubble/SpeechBubble';
import AnswerOptions
  from '../../component/general/action/AnswerOptions/AnswerOptions';
import QuestionCountdown
  from '../../component/asset/QuestionCountdown/QuestionCountdown';
import {sceneDataMixin} from '../../mixins/sceneDataMixin';
import {sleep} from '../../util/sleep';
import {preloaderMixin} from '../../mixins/preloaderMixin';

// @vue/component
export default {
  name: 'TutorialPage',
  components: {
    PrimaryButton,
    SecondaryButton,
    PrimaryTextReveal,
    SpeechBubble,
    AnswerOptions,
    QuestionCountdown,
  },
  extends: AbstractPageTransitionComponent,
  mixins: [sceneDataMixin('tutorial'), preloaderMixin],
  data() {
    return {
      instructionText: null,
      options: [
        {
          id: 'yellow',
          label: 'are you somewhere yellow',
        },
      ],
    };
  },
  created() {
    this.disposableManager = new DisposableManager();

    this.voices = {
      intro_1: this.$tFormatted('voice.intro_01'),
      intro_2: this.$tFormatted('voice.intro_02'),
      intro_3: this.$tFormatted('voice.intro_03'),
      intro_3_fallback: this.$tFormatted('voice.intro_03_fallback'),
      intro_yellow: this.$tFormatted('voice.intro_yellow'),
      intro_yellow_fallback: this.$tFormatted('voice.intro_yellow_fallback'),
      intro_hidingspot_jar: this.$tFormatted('voice.intro_hidingspot.jar'),
      intro_hidingspot_cupboard: this.$tFormatted(
          'voice.intro_hidingspot.cupboard',
      ),
      intro_hidingspot_bowls: this.$tFormatted('voice.intro_hidingspot.bowls'),
      fallback: this.$tFormatted('voice.general_fallback_response'),
    };
  },
  beforeDestroy() {
    if (this.disposableManager) {
      this.disposableManager.dispose();
    }
  },
  methods: {
    handleVoiceInput(input) {
      if (this.expectedInputs && !this.expectedInputs.has(input)) {
        this.handleVoiceNoMatch();
        return;
      }

      this.handleAnswerSelect({answerId: input});
    },

    async handleVoiceNoMatch() {
      await this.$say(this.voiceFallback || this.voices.fallback);
      this.$listen();
    },

    handleTransitionInStart() {
      this.$showFloor(true);
      this.$sprinkles.hide();

      TweenLite.delayedCall(0.7, () => {
        this.showWelcomeText();
      });
    },

    async showWelcomeText() {
      this.instructionText = this.$t(`introduction.welcomeText`);

      await Promise.all([
        this.$say(this.voices.intro_1),
        this.$refs.question.transitionIn(),
      ]);

      this.showQuestionInstructionText();
    },

    handleTextQueryError() {
      return this.$refs.answerOptions.transitionController.showButtons();
    },

    async showQuestionInstructionText() {
      this.$refs.questionCountDown.transitionIn();

      await Promise.all([
        this.$say(this.voices.intro_2),
        this.hideAndShowNewBubble(
            this.$t(`introduction.questionInstructionText`),
        ),
      ]);

      await sleep(500);

      this.showColorQuestion();
    },

    hideAndShowNewBubble(text) {
      return this.$refs.question.transitionOut().then(() => {
        this.instructionText = text;
        return this.$refs.question.transitionIn();
      });
    },

    async showColorQuestion() {
      await Promise.all([
        this.$say(this.voices.intro_3),
        this.hideAndShowNewBubble(this.$t(`introduction.colorQuestion`)),
      ]);

      this.voiceFallback = this.voices.intro_3_fallback;
      this.$refs.answerOptions.transitionIn();
      this.expectedInputs = new Set(['yellow']);

      this.$listen();
    },

    async showHidingSpotQuestion() {
      await Promise.all([
        this.$say(this.voices.intro_yellow),
        this.$refs.question.transitionOut(),
        this.$refs.answerOptions.transitionOut(),
      ]);

      this.instructionText = this.$t(`introduction.hidingSpotQuestion`);
      this.$refs.question.transitionIn();

      this.expectedInputs = new Set(['jar', 'bowls', 'cupboard']);

      this.options = [
        {
          id: 'jar',
          label: 'in the jar',
        },
        {
          id: 'bowls',
          label: 'behind the bowls',
        },
        {
          id: 'cupboard',
          label: 'in the cupboard',
        },
      ];

      this.voiceFallback = this.voices.intro_yellow_fallback;
      this.$refs.answerOptions.transitionIn();
      this.$listen();
    },

    async handleAnswerClick({answerId, label}) {
      await this.$refs.answerOptions.transitionController.hideButtons();

      if (this.$isBrowser) return this.handleAnswerSelect({answerId});

      return this.safeSend(label);
    },

    handleAnswerSelect({answerId}) {
      const actions = {
        yellow: this.showHidingSpotQuestion,
        bowls: () => this.handleWrongHidingSpot('bowls'),
        cupboard: () => this.handleWrongHidingSpot('cupboard'),
        jar: this.handleRightHidingSpot,
      };
      const action = actions[answerId];

      if (!action) return this.handleVoiceNoMatch();

      return action();
    },

    async handleWrongHidingSpot(spot) {
      await this.$say(this.voices[`intro_hidingspot_${spot}`]);
      this.options = this.options.filter((option) => option.id !== spot);
      this.$listen();
    },

    async handleRightHidingSpot() {
      await this.$say(this.voices.intro_hidingspot_jar);
      this.safeSend('finishtutorial');
      this.setSceneInBrowser('colorSelection');
    },

    handleAllComponentsReady() {
      this.transitionController = new TutorialPageTransitionController(this);
      this.disposableManager.add(
          new DisposableEventListener(
              this.transitionController,
              TransitionEvent.types.TRANSITION_IN_START,
              this.handleTransitionInStart.bind(this),
          ),
      );

      this.isReady();
    },

    handleComponentIsReady() {},
  },
};
