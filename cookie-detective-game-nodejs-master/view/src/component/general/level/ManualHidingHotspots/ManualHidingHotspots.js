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
import ManualHidingHotspotsTransitionController
  from './ManualHidingHotspotsTransitionController';
import HotspotButton from '../../../button/HotspotButton/HotspotButton';

// @vue/component
export default {
  name: 'ManualHidingHotspots',
  components: {
    HotspotButton,
  },
  extends: AbstractTransitionComponent,
  props: {
    hotspots: VueTypes.arrayOf(
        VueTypes.shape({
          id: VueTypes.string.isRequired,
          position: VueTypes.shape({
            x: VueTypes.number.isRequired,
            y: VueTypes.number.isRequired,
            z: VueTypes.number.isRequired,
          }),
        }),
    ),
  },
  methods: {
    handleAllComponentsReady() {
      this.transitionController = new ManualHidingHotspotsTransitionController(
          this,
      );
      this.isReady();
    },
    handleComponentIsReady() {},
  },
};
