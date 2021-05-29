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

import {strEnum} from './type.util';

export const lottieAnimationId = strEnum([
  'insideOven',

  'level1WinScene',
  'level1LoseScene',

  'level2WinScene',
  'level2LoseScene',

  'level3LoseScene',
  'level3WinScene',

  'characterQuestionLeft1',
  // 'characterQuestionLeft2',
  // 'characterQuestionRight1',
  // 'characterQuestionRight2',
]);
export type LottieAnimationId = keyof typeof lottieAnimationId;
