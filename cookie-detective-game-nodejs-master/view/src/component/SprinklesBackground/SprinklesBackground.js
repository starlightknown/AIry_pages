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
import SprinklesBackgroundTransitionController
  from './SprinklesBackgroundTransitionController';

// @vue/component
export default {
  name: 'SprinklesBackground',
  extends: AbstractTransitionComponent,
  data() {
    return {
      isVisible: false,
    };
  },
  methods: {
    show() {
      if (this.isVisible) return;
      this.isVisible = true;

      this.startVideo();
      return this.transitionController.transitionIn();
    },
    async hide() {
      if (!this.isVisible) return;
      this.isVisible = false;

      await this.transitionController.transitionOut();
      this.stopVideo();
    },
    startVideo() {
      this.$refs.video.muted = true;
      this.$refs.video.loop = true;
      this.$refs.video.play();
    },
    stopVideo() {
      this.$refs.video.pause();
    },
    handleAllComponentsReady() {
      this.transitionController = new SprinklesBackgroundTransitionController(
          this,
      );
      this.isReady();
    },
  },
};
