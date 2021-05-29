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

import {AbstractPageTransitionComponent} from 'vue-transition-component';
import GameExitPageTransitionController
  from './GameExitPageTransitionController';
import Direction from '../../data/enum/Direction';
import {lottieAnimationId} from '../../data/type/LottieAnimationId';
import FullScreenQuestion
  from '../../component/general/question/FullScreenQuestion/FullScreenQuestion';

// @vue/component
export default {
  name: 'GameExitPage',
  components: {
    FullScreenQuestion,
  },
  extends: AbstractPageTransitionComponent,
  data() {
    return {
      question: {
        id: 'gameExit',
        question: this.$t('gameExit.message'),
        options: [],
        maxAnswers: 0,
        direction: Direction.RIGHT,
        characterAnimation: lottieAnimationId.characterQuestionLeft1,
      },
    };
  },
  async mounted() {
    await this.$say(this.$tFormatted('voice.game_exit'));
  },
  methods: {
    handleComponentIsReady() {},
    handleAllComponentsReady() {
      this.transitionController = new GameExitPageTransitionController(this);
      this.isReady();
    },
  },
};
