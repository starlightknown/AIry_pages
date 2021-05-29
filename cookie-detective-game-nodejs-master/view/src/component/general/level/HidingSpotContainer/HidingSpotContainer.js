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
import {camelCase} from 'lodash';
import HidingSpotContainerTransitionController
  from './HidingSpotContainerTransitionController';
import HidingSpot from '../../../button/HidingSpot/HidingSpot';

// @vue/component
export default {
  name: 'HidingSpotContainer',
  components: {
    HidingSpot,
  },
  extends: AbstractTransitionComponent,
  props: {
    availableHidingSpots: VueTypes.any,
    hidingSpot: VueTypes.any,
    showOutlines: VueTypes.bool,
  },
  data() {
    return {
      hidingSpots: null,
      camelCase,
    };
  },
  watch: {
    availableHidingSpots(newValues, oldValues) {
      const values = newValues.map((item) => item.id);
      const removedHidingSpots = oldValues.filter(
          (item) => !values.includes(item.id),
      );
      const wrongHotspots = oldValues.filter(
          (item) => item.id !== this.hidingSpot.id,
      );
      const notYetFound = newValues.find(
          (item) => item.id === this.hidingSpot.id,
      );

      if (removedHidingSpots && removedHidingSpots.length > 0) {
        if (notYetFound) {
          removedHidingSpots.forEach((hidingSpot) => {
            this.$refs[hidingSpot.id][0].hide(false).then(() => {
              this.hidingSpots = newValues;
            });
          });
        } else {
          wrongHotspots.forEach((hidingSpot) =>
            this.$refs[hidingSpot.id][0].hide(false),
          );
          this.$refs[this.hidingSpot.id][0].hide(true).then(() => {
            this.hidingSpots = [this.hidingSpot];
          });
        }
      }
    },
  },
  created() {
    this.hidingSpots = this.availableHidingSpots;
  },
  methods: {
    handleHidingSpotClick(hidingSpot) {
      this.$emit('guessHidingSpot', hidingSpot.id);
    },
    handleComponentIsReady() {},
    handleAllComponentsReady() {
      this.transitionController = new HidingSpotContainerTransitionController(
          this,
      );
      this.isReady();
    },
  },
};
