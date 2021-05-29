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

import {shuffle} from 'lodash';
import {
  AbstractPageTransitionComponent,
  TransitionEvent,
} from 'vue-transition-component';
import {DisposableManager} from 'seng-disposable-manager';
import {DisposableEventListener} from 'seng-disposable-event-listener';
import AnimalSelectionPageTransitionController
  from './AnimalSelectionPageTransitionController';
import FullScreenQuestion
  from '../../component/general/question/FullScreenQuestion/FullScreenQuestion';
import translate from '../../lib/translate';
import Direction from '../../data/enum/Direction';
import {lottieAnimationId} from '../../data/type/LottieAnimationId';
import {sceneDataMixin} from '../../mixins/sceneDataMixin';
import {sleep} from '../../util/sleep';
import {preloaderMixin} from '../../mixins/preloaderMixin';

export default {
  name: 'AnimalSelectionPage',
  components: {
    FullScreenQuestion,
  },
  mixins: [sceneDataMixin('animalSelection'), preloaderMixin],
  extends: AbstractPageTransitionComponent,
  data() {
    return {
      question: {
        id: 'animalSelection',
        question: translate('createProfile.question.animal'),
        options: shuffle(this.$animalModel.getArrayOfItems()).map((item) => ({
          id: item.id,
          icon: item.icon,
          hexColor: '',
          label: this.$t(['animals', item.id]),
        })),
        maxAnswers: 3,
        direction: Direction.RIGHT,
        characterAnimation: lottieAnimationId.characterQuestionLeft1,
      },
    };
  },
  created() {
    this.disposableManager = new DisposableManager();
    const {hexColor} = this.$colorModel.getItemById(this.currentColor);
    this.question.options = this.question.options.map((option) => {
      return {...option, hexColor};
    });

    this.voices = {
      intro: this.$tFormatted('voice.name_color_reply', {
        scope: this.currentColor,
        arg1: this.question.options[0].label,
        arg2: this.question.options[1].label,
        arg3: this.question.options[2].label,
      }),
    };
  },
  beforeDestroy() {
    if (this.disposableManager) {
      this.disposableManager.dispose();
    }
  },
  methods: {
    async handleVoiceInput(input) {
      if (!input || input === 'undefined') {
        this.handleVoiceNoMatch();
        return;
      }

      await sleep(200);

      this.createAndSelectPlayer(this.currentColor, input);
    },
    async handleVoiceNoMatch() {
      this.question.options = shuffle(this.question.options);
      await this.$nextTick();
      await this.$say(
          this.$tFormatted('voice.name_animal_exception', {
            arg1: this.question.options[0].label,
            arg2: this.question.options[1].label,
            arg3: this.question.options[2].label,
          }),
      );
      this.$listen();
    },

    handleTextQueryError() {
      return this.$refs.questions.transitionController.showButtons();
    },

    async handleAnswerSelect(data) {
      this.$refs.questions.transitionController.hideButtons();

      if (this.$isBrowser) {
        await this.createAndSelectPlayer(this.currentColor, data.answerId);
        this.setSceneInBrowser('levelSelection');
      } else {
        this.safeSend(data.label.toLocaleLowerCase());
      }
    },
    async createAndSelectPlayer(color, animal) {
      await this.$say(
          this.$tFormatted('voice.name_animal_reply', {
            color,
            animal,
          }),
      );
      const newPlayer = {
        color,
        animal,
      };
      this.createPlayer(newPlayer);
      this.selectPlayer(newPlayer);
    },

    async handleTransitionInStart() {
      this.$showFloor(false);

      await this.$say(this.voices.intro);

      if (this.expectedScene !== this.scene) return;

      this.$listen();
      this.$refs.questions.transitionController.showButtons();
    },
    handleTransitionInComplete() {
      this.$sprinkles.show();
    },
    handleComponentIsReady() {},
    handleAllComponentsReady() {
      this.transitionController = new AnimalSelectionPageTransitionController(
          this,
      );
      this.disposableManager.add(
          new DisposableEventListener(
              this.transitionController,
              TransitionEvent.types.TRANSITION_IN_START,
              this.handleTransitionInStart.bind(this),
          ),
      );
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
