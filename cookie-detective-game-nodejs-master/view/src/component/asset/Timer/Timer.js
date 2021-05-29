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
import TimerTransitionController from './TimerTransitionController';
import Size from '../../../data/enum/Size';

// @vue/component
export default {
  name: 'Timer',
  props: {
    hasRadius: VueTypes.bool.def(true),
    seconds: VueTypes.number.isRequired.def(0),
    size: VueTypes.oneOf([Size.SMALL, Size.MEDIUM, Size.LARGE]).def(
        Size.MEDIUM,
    ),
  },
  extends: AbstractTransitionComponent,
  computed: {
    time() {
      const minutes = Math.floor(Math.min(60, this.seconds / 60));
      const seconds = Math.floor(this.seconds % 60);
      return `${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    buttonSize() {
      return `is-${Size[this.size].toLowerCase()}`;
    },
  },
  methods: {
    handleAllComponentsReady() {
      this.transitionController = new TimerTransitionController(this);
      this.isReady();
    },
  },
};
