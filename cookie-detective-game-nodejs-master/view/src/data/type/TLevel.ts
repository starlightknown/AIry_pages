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

import {LottieAnimationId} from './LottieAnimationId';
import {ThemeId} from './ThemeId';

export type TLevel = {
  id: string;
  ordinal: number;
  hidingSpotIds: Array<string>;
  textQuery: string;
  levelRequiredId: string | null;
  showOutlines: boolean;
  maxQuestions: number;
  background: string;
  previewImage: string;
  themeId: ThemeId;
  lottieAnimation: {
    winScene: LottieAnimationId;
    loseScene: LottieAnimationId;
  };
};
