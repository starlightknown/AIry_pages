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

export const PLATFORMS = {
  BROWSER: 'browser',
  NEST_HUB: 'nest-hub',
  NEST_HUB_MAX: 'nest-hub-max',
  EMULATOR: 'emulator',
};

/**
 * Return the current platform in which the game is running
 * The possible platforms are defined in the PLATFORMS enum
 * @return {string}
 */
export default function getPlatform() {
  const isNestHub = navigator.userAgent.includes(' CrKey/');

  if (!isNestHub) {
    return (
      (window === window.parent && PLATFORMS.BROWSER) || PLATFORMS.EMULATOR
    );
  }

  const isMax = window.innerWidth === 1280;

  if (isMax) return PLATFORMS.NEST_HUB_MAX;

  return PLATFORMS.NEST_HUB;
}

/**
 * Simple utility to check is the game is running on the browser
 * @return {boolean}
 */
export function isBrowser() {
  return getPlatform() === PLATFORMS.BROWSER;
}
