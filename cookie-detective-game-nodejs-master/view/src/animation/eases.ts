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

import {CustomEase} from '../vendor/gsap/CustomEase';

const bounceInOutY = CustomEase.create(
  'bounceInOutY',
  'M0,0,C0.112,0,0.127,1.199,0.248,1.2,0.348,1.2,0.414,0.9,0.5,0.9,0.59,0.9,0.678,1.052,0.758,1.052,0.826,1.052,0.892,1,1,1',
);
const bounceInOutX = CustomEase.create(
  'bounceInOutX',
  'M0,0,C0.08,0,0.22,1.1,0.5,1.1,0.563,1.1,0.668,0.943,0.75,0.943,0.81,0.943,0.924,1,1,1',
);

const eases = {
  bounceInOutY,
  bounceInOutX,
};

export default eases;
