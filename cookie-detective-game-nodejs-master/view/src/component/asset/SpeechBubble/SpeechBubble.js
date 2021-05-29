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
import SpeechBubbleTransitionController
  from './SpeechBubbleTransitionController';
import Size from '../../../data/enum/Size';
import Direction from '../../../data/enum/Direction';
import nullableVueType from '../../../util/nullableVueType';

// @vue/component
export default {
  name: 'SpeechBubble',
  extends: AbstractTransitionComponent,
  props: {
    direction: VueTypes.oneOf([Direction.LEFT, Direction.RIGHT]).def(
        Direction.LEFT,
    ),
    size: VueTypes.oneOf([Size.SMALL, Size.MEDIUM, Size.LARGE]).def(
        Size.MEDIUM,
    ),
    description: nullableVueType(VueTypes.string).isRequired,
  },
  computed: {
    bubbleSize() {
      return `is-${Size[this.size].toLowerCase()}`;
    },
    bubbleDirection() {
      return `is-${Direction[this.direction].toLowerCase()}`;
    },
  },
  mounted() {
    // this.$nextTick(() => this.$say(this.description));
  },
  methods: {
    handleAllComponentsReady() {
      this.transitionController = new SpeechBubbleTransitionController(this);
      this.isReady();
    },
  },
};
