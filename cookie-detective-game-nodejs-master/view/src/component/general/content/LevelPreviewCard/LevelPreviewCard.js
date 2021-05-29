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
import {AbstractTransitionComponent} from 'vue-transition-component';
import LevelPreviewCardTransitionController
  from './LevelPreviewCardTransitionController';
import {themeId} from '../../../../data/type/ThemeId';
import SecondaryButton from '../../../button/SecondaryButton/SecondaryButton';
import LeaderboardItem from '../../../asset/LeaderboardItem/LeaderboardItem';

// @vue/component
export default {
  name: 'LevelPreviewCard',
  components: {
    SecondaryButton,
    LeaderboardItem,
  },
  extends: AbstractTransitionComponent,
  props: {
    image: VueTypes.string.isRequired,
    name: VueTypes.string.isRequired,
    isLocked: VueTypes.bool.def(true),
    caption: VueTypes.string.isRequired,
    themeId: VueTypes.oneOf(Object.values(themeId)).isRequired,
    user: VueTypes.any,
    highScore: VueTypes.number,
  },
  methods: {
    triggerLockedLevelAnimation() {
      this.transitionController.triggerLockedLevelAnimation();
    },
    handleAllComponentsReady() {
      this.transitionController = new LevelPreviewCardTransitionController(
          this,
      );
      this.isReady();
    },
    handleComponentIsReady() {},
  },
};
