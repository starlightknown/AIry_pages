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
import {DisposableEventListener} from 'seng-disposable-event-listener';
import {DisposableManager} from 'seng-disposable-manager';
import {TransitionEvent} from 'vue-transition-component';
import AbstractButtonComponent from '../AbstractButtonComponent';
import HidingSpotTransitionController from './HidingSpotTransitionController';

export default {
  name: 'HidingSpot',
  props: {
    id: VueTypes.string.isRequired,
    showWhiteOutline: VueTypes.bool.def(true),
  },
  extends: AbstractButtonComponent,
  created() {
    this.disposableManager = new DisposableManager();
  },
  beforeDestroy() {
    if (this.disposableManager) {
      this.disposableManager.dispose();
    }
  },
  methods: {
    hide(isCorrect) {
      this.stopLoopingAnimation();
      if (isCorrect) {
        return this.transitionController.showCorrectState();
      }

      return this.transitionOut();
    },

    handleTransitionInCompleted() {
      this.startLoopingAnimation();
    },

    handleAllComponentsReady() {
      this.transitionController = new HidingSpotTransitionController(this);

      this.disposableManager.add(
          new DisposableEventListener(
              this.transitionController,
              TransitionEvent.types.TRANSITION_IN_COMPLETE,
              this.handleTransitionInCompleted.bind(this),
          ),
      );

      this.isReady();
    },
  },
};
