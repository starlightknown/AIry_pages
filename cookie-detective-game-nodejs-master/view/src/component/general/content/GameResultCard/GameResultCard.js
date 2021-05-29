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
import GameResultCardTransitionController
  from './GameResultCardTransitionController';
import SecondaryButton from '../../../button/SecondaryButton/SecondaryButton';
import QuestionCountdown
  from '../../../asset/QuestionCountdown/QuestionCountdown';
import Timer from '../../../asset/Timer/Timer';
import {themeId} from '../../../../data/type/ThemeId';
import PrimaryTextReveal
  from '../../../type/PrimaryTextReveal/PrimaryTextReveal';

// @vue/component
export default {
  name: 'GameResultCard',
  components: {
    SecondaryButton,
    QuestionCountdown,
    Timer,
    PrimaryTextReveal,
  },
  extends: AbstractTransitionComponent,
  props: {
    themeId: VueTypes.oneOf(Object.values(themeId)).isRequired,
    gameResult: VueTypes.shape({
      level: VueTypes.any,
      questionsLeft: VueTypes.number,
      secondsUsed: VueTypes.number,
      score: VueTypes.number,
    }),
  },
  methods: {
    handleAllComponentsReady() {
      this.transitionController = new GameResultCardTransitionController(this);
      this.isReady();
    },
  },
};
