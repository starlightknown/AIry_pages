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
 * This store is used to replicate what's inside the userData or homeData
 * in the canvas api, when running in the browser
 * @param {boolean} localStorageEnabled
 * @return {any}
 */
export default function createBrowserStore({localStorageEnabled}) {
  /**
   * Get current player
   * @return {null|string}
   */
  function getCurrentPlayer() {
    if (!localStorageEnabled) return null;
    return JSON.parse(localStorage.getItem('CD:sessionData:currentPlayer'));
  }

  /**
   * Get current selected color
   * available only after the ColorSelectionScene
   * @return {null|string}
   */
  function getCurrentColor() {
    if (!localStorageEnabled) return null;
    return JSON.parse(localStorage.getItem('CD:sessionData:currentColor'));
  }

  /**
   * Get the current hiding mode
   * available only after the hidingModeSelectionScene
   * @return {null|'auto'|'manual'}
   */
  function getCurrentHidingMode() {
    if (!localStorageEnabled) return null;
    return JSON.parse(localStorage.getItem('CD:sessionData:currentHidingMode'));
  }

  /**
   * Get all the players registered in the game
   * @return {any[]}
   */
  function getPlayers() {
    if (!localStorageEnabled) return [];
    return JSON.parse(localStorage.getItem('CD:userData:players')) || [];
  }

  /**
   * Get all the game results from all the players
   * @return {any[]}
   */
  function getGameResults() {
    if (!localStorageEnabled) return [];
    return JSON.parse(localStorage.getItem('CD:userData:gameResults')) || [];
  }

  /**
   * Save the store to localstorage
   * @param {Object} store
   */
  function saveToLocalStorage(store) {
    if (!localStorageEnabled) return;
    localStorage.setItem(
        'CD:sessionData:currentPlayer',
        JSON.stringify(store.currentPlayer),
    );
    localStorage.setItem(
        'CD:sessionData:currentColor',
        JSON.stringify(store.currentColor),
    );
    localStorage.setItem(
        'CD:sessionData:currentHidingMode',
        JSON.stringify(store.currentHidingMode),
    );
    localStorage.setItem('CD:userData:players', JSON.stringify(store.players));
    localStorage.setItem(
        'CD:userData:gameResults',
        JSON.stringify(store.gameResults),
    );
  }

  const browserStore = Vue.observable({
    currentPlayer: getCurrentPlayer(),
    currentColor: getCurrentColor(),
    currentHidingMode: getCurrentHidingMode(),
    players: getPlayers(),
    gameResults: getGameResults(),
    isNewPlayer: false,
  });

  // eslint-disable-next-line
  const watcher = new Vue({
    computed: {
      browser: () => browserStore,
    },
    watch: {
      'browser.currentPlayer': () => saveToLocalStorage(browserStore),
      'browser.currentColor': () => saveToLocalStorage(browserStore),
      'browser.currentHidingMode': () => saveToLocalStorage(browserStore),
      'browser.players': () => saveToLocalStorage(browserStore),
      'browser.gameResults': () => saveToLocalStorage(browserStore),
    },
  });

  return browserStore;
}
