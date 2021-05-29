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

import {
  AbstractTransitionComponent,
  TransitionEvent,
} from 'vue-transition-component';
import {TweenLite, Power2} from 'gsap';
import {DisposableEventListener} from 'seng-disposable-event-listener';
import VueTypes from 'vue-types';
import {DisposableManager} from 'seng-disposable-manager';
import SplashViewTransitionController from './SplashViewTransitionController';
import Loader from '../../../asset/Loader/Loader';
import AudioPlayer from '../../../asset/AudioPlayer/AudioPlayer';
import {audio} from '../../../../data/assets';

// @vue/component
export default {
  name: 'SplashView',
  components: {
    AudioPlayer,
    Loader,
  },
  extends: AbstractTransitionComponent,
  props: {
    progress: VueTypes.number.isRequired.def(0),
  },
  data() {
    return {
      fakeProgress: 0,
    };
  },
  computed: {
    visualProgress() {
      return Math.round((this.progress + this.fakeProgress) / 2);
    },
  },
  watch: {
    visualProgress(value) {
      if (value >= 100) {
        this.$emit('animationCompleted');
      }
    },
  },
  created() {
    this.disposableManager = new DisposableManager();
  },
  mounted() {
    this.$refs.audioPlayer.setSrc(audio.INTRO.source);
    this.$refs.audioPlayer.play();
  },
  beforeDestroy() {
    if (this.disposableManager) {
      this.disposableManager.dispose();
    }
  },
  methods: {
    handleTransitionInStart() {
      TweenLite.to(this, 3, {
        fakeProgress: 100,
        ease: Power2.easeIn,
      });
    },
    handleAllComponentsReady() {
      this.transitionController = new SplashViewTransitionController(this);
      this.disposableManager.add(
          new DisposableEventListener(
              this.transitionController,
              TransitionEvent.types.TRANSITION_IN_START,
              this.handleTransitionInStart.bind(this),
          ),
      );
      this.isReady();
    },
  },
};
