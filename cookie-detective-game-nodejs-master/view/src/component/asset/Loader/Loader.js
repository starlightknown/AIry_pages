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
import LoaderTransitionController from './LoaderTransitionController';

// @vue/component
export default {
  name: 'Loader',
  extends: AbstractTransitionComponent,
  props: {
    progress: VueTypes.number.def(0),
    manual: VueTypes.bool.def(false),
  },
  data() {
    return {
      manualProgress: 0,
    };
  },
  computed: {
    diameter() {
      return this.$refs.loader ? this.$refs.loader.clientWidth : 0;
    },
    radius() {
      return this.diameter / 2;
    },
    currentProgress() {
      return this.manual ? this.manualProgress : this.progress;
    },
  },
  methods: {
    handleAllComponentsReady() {
      this.transitionController = new LoaderTransitionController(this);
      this.isReady();
    },
    setProgressStyles() {
      if (!this.$refs.loader) return {};

      const normalizedRadius = this.setRadius();
      const circumference = normalizedRadius * 2 * Math.PI;
      const percent = this.currentProgress || 0;

      return {
        strokeDasharray: circumference,
        strokeDashoffset: circumference - (percent / 100) * circumference,
      };
    },
    setRadius() {
      return this.$refs.loader ? this.radius - this.setStrokeWidth() / 2 : 0;
    },
    setStrokeWidth() {
      return this.$refs.loader ? 11 * (this.diameter / 93) : 0;
    },
    setCenter() {
      return this.$refs.loader ? this.radius : 0;
    },

    setProgress(value) {
      this.manualProgress = value;
    },

    show() {
      return this.transitionIn();
    },

    hide() {
      return this.transitionOut();
    },
  },
};
