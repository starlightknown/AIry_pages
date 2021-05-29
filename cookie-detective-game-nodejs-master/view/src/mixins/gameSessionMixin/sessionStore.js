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

import Vue from 'vue';

/**
 * internal store that manages the Game Session variables,
 * not required after a game restart
 * @param {boolean} localStorageEnabled: save the session to local storage,
 * useful for debugging. to avoid the need to re-play the game
 * to re-create a session
 * @return {{currentLevel: (null|any)}}
 */
export default function createSessionStore({localStorageEnabled}) {
  /**
   * Get the current selected level by the user
   * @return {null|any}
   */
  function getCurrentLevel() {
    if (!localStorageEnabled) return null;
    return JSON.parse(localStorage.getItem('CD:sessionData:currentLevel'));
  }

  /**
   * Save the current selected level, if local storage is enabled
   * @param {object} store
   */
  function saveToLocalStorage(store) {
    if (!localStorageEnabled) return;
    localStorage.setItem(
        'CD:sessionData:currentLevel',
        JSON.stringify(store.currentLevel),
    );
  }

  const sessionStore = Vue.observable({
    currentLevel: getCurrentLevel(),
  });

  // eslint-disable-next-line
  const watcher = new Vue({
    computed: {
      session: () => sessionStore,
    },
    watch: {
      'session.currentLevel': () => saveToLocalStorage(sessionStore),
    },
  });

  return sessionStore;
}
