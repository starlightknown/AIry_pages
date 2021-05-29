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

export default {
  startCount: VueTypes.number.isRequired,
  frameCount: VueTypes.number.isRequired,
  source: VueTypes.string.isRequired,
  mapping: VueTypes.object,
  gutter: VueTypes.shape({
    x: VueTypes.number.isRequired,
    y: VueTypes.number.isRequired,
  }).isRequired,
  columns: VueTypes.number.isRequired,
  size: VueTypes.shape({
    width: VueTypes.number.isRequired,
    height: VueTypes.number.isRequired,
  }).isRequired,
  fps: VueTypes.number,
  loop: VueTypes.bool.def(false),
  loopTimeout: VueTypes.number.def(0),
  objectFit: VueTypes.string.def('contain'),
};
