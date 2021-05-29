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

/**
 * Intent handlers for the "levelSelection" scene
 */
module.exports = {
  // the frontend will check if the level is unlocked, and if yes,
  // will trigger the intent continueToHidingModeSelection using a textQuery

  chooseLevelOne() {
    return 1;
  },
  chooseLevelTwo() {
    return 2;
  },
  chooseLevelThree() {
    return 3;
  },

  // transition to hidingModeSelection
  // look at the levelSelection.yaml scene
  continueToHidingModeSelection() {},
};
