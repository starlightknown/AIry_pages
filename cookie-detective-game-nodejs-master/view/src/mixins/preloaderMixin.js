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

import {mean} from 'lodash';

/**
 * Preloader mixin for pages that use vue-transition-component
 */

let firstLoad = true;

export const preloaderMixin = {
  created() {
    this.hijackTransitionIn().then(async (release) => {
      console.debug('[Preloader] preloading assets');

      this.$loader.setProgress(0);

      if (!firstLoad) {
        await this.$loader.show();
      }

      firstLoad = false;

      const {voices = {}, assets = {}} = this;

      const voicesToPreload = Object.values(voices).filter((voice) => !!voice);
      const assetsToPreload = Object.values(assets).filter((asset) => !!asset);

      const progress = {
        voice: voicesToPreload.length && 0,
        assets: assetsToPreload.length && 0,
      };

      const updateLoaderProgress = () => {
        const progresses = Object.values(progress).filter(
            (value) => typeof value === 'number',
        );
        const totalProgress = Math.round(mean(progresses) * 100);
        this.$loader.setProgress(totalProgress);
      };

      const setProgress = (key) => (x) => {
        progress[key] = x;
        updateLoaderProgress();
      };

      updateLoaderProgress();

      await Promise.all([
        this.$preloadVoice(voicesToPreload, setProgress('voice')),
        this.$assets.load(assetsToPreload, setProgress('assets')),
      ]);

      if (typeof this.onPreloadFinish === 'function') {
        await this.onPreloadFinish();
      }

      this.$loader.setProgress(100);
      await this.$loader.hide();

      return release();
    });
  },
  beforeDestroy() {
    this.$releaseVoices();
  },
};
