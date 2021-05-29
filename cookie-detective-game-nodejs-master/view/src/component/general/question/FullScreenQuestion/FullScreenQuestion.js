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

import {AbstractTransitionComponent} from 'vue-transition-component';
import VueTypes from 'vue-types';
import FullScreenQuestionTransitionController
  from './FullScreenQuestionTransitionController';
import AnswerOptions from '../../action/AnswerOptions/AnswerOptions';
import SpeechBubble from '../../../asset/SpeechBubble/SpeechBubble';
import Direction from '../../../../data/enum/Direction';
import {lottieAnimationId} from '../../../../data/type/LottieAnimationId';
import LottieAnimation from '../../../asset/LottieAnimation/LottieAnimation';

// @vue/component
export default {
  name: 'FullScreenQuestion',
  components: {
    AnswerOptions,
    SpeechBubble,
    LottieAnimation,
  },
  extends: AbstractTransitionComponent,
  props: {
    id: VueTypes.any.isRequired,
    options: VueTypes.arrayOf(
        VueTypes.shape({
          icon: VueTypes.string,
          hexColor: VueTypes.string,
          id: VueTypes.any.isRequired,
          label: VueTypes.string.isRequired,
        }),
    ),
    maxAnswers: VueTypes.number.def(3),
    question: VueTypes.string,
    direction: VueTypes.oneOf([Direction.LEFT, Direction.RIGHT]).def(
        Direction.LEFT,
    ),
    characterAnimation: VueTypes.oneOf(Object.values(lottieAnimationId)),
  },
  data() {
    return {
      Direction,
      lottieAnimationId,
    };
  },
  computed: {
    isDirection() {
      return `is-${Direction[this.direction].toLowerCase()}`;
    },
  },
  methods: {
    onSelect(data) {
      this.$emit('onSelect', data);
    },
    handleAllComponentsReady() {
      this.transitionController = new FullScreenQuestionTransitionController(
          this,
      );
      this.isReady();
    },
    handleComponentIsReady() {},
  },
};
