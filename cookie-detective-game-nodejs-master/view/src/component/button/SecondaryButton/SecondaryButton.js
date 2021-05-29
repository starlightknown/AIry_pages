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
import AbstractButtonComponent from '../AbstractButtonComponent';
import SecondaryButtonTransitionController
  from './SecondaryButtonTransitionController';
import {themeId} from '../../../data/type/ThemeId';

export default {
  name: 'SecondaryButton',
  extends: AbstractButtonComponent,
  props: {
    themeId: VueTypes.oneOf(Object.values(themeId)).def(themeId.tertiary),
  },
  computed: {
    themeStyle() {
      return `is-${this.themeId}`;
    },
  },
  methods: {
    handleAllComponentsReady() {
      this.transitionController = new SecondaryButtonTransitionController(this);
      this.isReady();
    },
  },
};
