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

import {lottieAnimationId} from '../data/type/LottieAnimationId';
import ILottieAnimation from '../data/interface/ILottieAnimation';

export const lottieAnimations: Array<ILottieAnimation> = [
  {
    id: lottieAnimationId.level1WinScene,
    file: 'body-moving/level-1-win-scene.json',
    states: {
      inAnimation: {
        frames: [0, 24],
        loop: false,
      },
      loopAnimation: {
        frames: [0, 24],
        loop: true,
      },
    },
  },
  {
    id: lottieAnimationId.level1LoseScene,
    file: 'body-moving/level-1-lose-scene.json',
    states: {
      inAnimation: {
        frames: [0, 23],
        loop: true,
      },
      loopAnimation: {
        frames: [24, 95],
        loop: true,
      },
    },
  },
  {
    id: lottieAnimationId.level2WinScene,
    file: 'body-moving/level-2-win-scene.json',
    states: {
      inAnimation: {
        frames: [0, 24],
        loop: false,
      },
      loopAnimation: {
        frames: [0, 24],
        loop: true,
      },
    },
  },
  {
    id: lottieAnimationId.level2LoseScene,
    file: 'body-moving/level-2-lose-scene.json',
    states: {
      inAnimation: {
        frames: [0, 23],
        loop: true,
      },
      loopAnimation: {
        frames: [24, 95],
        loop: true,
      },
    },
  },
  {
    id: lottieAnimationId.level3WinScene,
    file: 'body-moving/level-3-win-scene.json',
    states: {
      inAnimation: {
        frames: [0, 24],
        loop: false,
      },
      loopAnimation: {
        frames: [0, 24],
        loop: true,
      },
    },
  },
  {
    id: lottieAnimationId.level3LoseScene,
    file: 'body-moving/level-3-lose-scene.json',
    states: {
      inAnimation: {
        frames: [0, 23],
        loop: true,
      },
      loopAnimation: {
        frames: [24, 95],
        loop: true,
      },
    },
  },
  {
    id: lottieAnimationId.characterQuestionLeft1,
    file: 'body-moving/character-question-left-1.json',
    states: {
      inAnimation: {
        frames: [0, 23],
        loop: false,
      },
      loopAnimation: {
        frames: [23, 108],
        loop: true,
      },
      outAnimation: {
        frames: [108, 118],
        loop: false,
      },
    },
  },
];
