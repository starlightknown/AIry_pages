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

export const spriteSequences = {};

export const videos = {
  sprinkles: 'video/sprinkles.mp4',
};

export const images = {};
export const confettiColors = ['blue', 'orange', 'white', 'pink'];
export const confettiBlurLevels = [0, 1, 2];

confettiColors.forEach((color) => {
  confettiBlurLevels.forEach((blurLevel) => {
    images[
      `confetti${color}blur${blurLevel}`
    ] = `image/confetti/confetti-${color}-blur-${blurLevel}.png`;
  });
});

export const audio = {
  WIN: {
    source: '{$versionRoot}audio/music_win.mp3',
    loop: false,
  },
  LOSS: {
    source: '{$versionRoot}audio/music_loss.mp3',
    loop: false,
  },
  INTRO: {
    source: '{$versionRoot}audio/intro.mp3',
    loop: false,
  },
};
