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
import DeviceNotSupportedPageTransitionController
  from './DeviceNotSupportedPageTransitionController';
import FullScreenQuestion
  from '../../component/general/question/FullScreenQuestion/FullScreenQuestion';
import translate from '../../lib/translate';
import Direction from '../../data/enum/Direction';
import {lottieAnimationId} from '../../data/type/LottieAnimationId';
import {preloaderMixin} from '../../mixins/preloaderMixin';

export default {
  name: 'DeviceNotSupportedPage',
  components: {
    FullScreenQuestion,
  },
  extends: AbstractPageTransitionComponent,
  mixins: [preloaderMixin],
  data() {
    return {
      question: {
        id: 'animalSelection',
        question: translate('deviceNotSupported'),
        options: [],
        maxAnswers: 0,
        direction: Direction.LEFT,
        characterAnimation: lottieAnimationId.characterQuestionLeft1,
      },
    };
  },
  methods: {
    handleComponentIsReady() {},

    handleAllComponentsReady() {
      this.transitionController =
        new DeviceNotSupportedPageTransitionController(this);

      this.isReady();
    },
  },
};
