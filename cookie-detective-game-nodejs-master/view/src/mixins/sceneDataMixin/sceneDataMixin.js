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

import * as uuid from 'uuid';
import {mapMutations, mapState} from 'vuex';
import {AppMutations} from '../../store/module/app';
import {isBrowser} from '../../util/getPlatform';
import canvas from '../../lib/canvas';
import createBrowserStore from './browserStore';
import {GameResultModel} from '../../data/model/GameResultModel';

const Config = {
  browser: isBrowser(),
  // Disabling local storage in the device, because it's not supported there
  localStorageEnabled: isBrowser(),
};

const browserStore = createBrowserStore({
  localStorageEnabled: Config.localStorageEnabled,
});

/**
 * This mixin is the main interface between the canvas api and the game
 * It mainly manages the user storage, and allow seamlessly communication
 * with the canvas api, using text queries
 *
 * each method includes a fallback to also work in the browser,
 * during development
 */

export const sceneDataMixin = (expectedScene) => ({
  computed: {
    ...mapState({
      userData: (state) => state.app.userData,
      sessionData: (state) => state.app.sessionData,
      homeData: (state) => state.app.homeData,
      scene: (state) => state.app.scene,
      sceneInput: (state) => state.app.input,
    }),

    players() {
      const players = Config.browser ?
        browserStore.players :
        this.homeData.players;

      if (!players) return [];

      return [...players].sort((a, b) => b.lastPlayed - a.lastPlayed);
    },

    currentPlayer() {
      if (Config.browser) return browserStore.currentPlayer;

      return this.sessionData.currentPlayer;
    },

    currentPlayerUserName() {
      return `${this.currentPlayer.color} ${this.currentPlayer.animal}`;
    },

    isNewPlayer() {
      return Config.browser ?
        browserStore.isNewPlayer :
        this.sessionData.isNewPlayer;
    },

    gameResults() {
      const results = Config.browser ?
        browserStore.gameResults :
        this.homeData.gameResults;

      if (!results) return [];

      return [...results]
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((result) => new GameResultModel(result));
    },

    gameResultsOrderedByScore() {
      return [...this.gameResults].sort((a, b) => b.score - a.score);
    },

    lastGameResult() {
      // the game results are already ordered by timestamp
      return this.gameResults[0];
    },

    currentColor() {
      return Config.browser ?
        browserStore.currentColor :
        this.sessionData.color;
    },

    currentHidingMode() {
      return Config.browser ?
        browserStore.currentHidingMode :
        this.sessionData.hidingMode;
    },

    expectedScene() {
      return expectedScene;
    },
  },

  watch: {
    /**
     * This is an internal watcher, that triggers the handleVoiceInput method,
     * in the vue component in case of matched input,
     * otherwise it triggers the handleVoiceNoMatch method
     * @private
     * @param {string} input
     * @return {*}
     */
    sceneInput({input}) {
      if (!expectedScene) return;

      if (this.scene !== expectedScene) return;

      this.waitingForSceneInput = false;

      const isNoMatch = /^(NO_MATCH_|NO_INPUT)/.test(input);

      const noMatch = isNoMatch || !input || input === 'undefined';

      if (noMatch && typeof this.handleVoiceNoMatch === 'function') {
        return this.handleVoiceNoMatch();
      }

      if (typeof this.handleVoiceInput === 'function') {
        this.handleVoiceInput(input);
      }
    },
  },

  methods: {
    ...mapMutations({
      setScene: AppMutations.SET_SCENE,
    }),

    /**
     * send a textQuery to the canvas api
     * This method has an internal check that prevents to send multiple requests
     * in case the user presses a button that sends a textQuery
     * multiple times in a short amount of time
     * @param {string} text
     * @return {Promise|undefined}
     */
    safeSend(text) {
      if (this.waitingForSceneInput) return;

      this.waitingForSceneInput = true;

      return this.$send(text).catch((err) => {
        if (typeof this.handleTextQueryError === 'function') {
          this.handleTextQueryError(err);
        }

        this.waitingForSceneInput = false;
      });
    },

    /**
     * set a scene manually in the browser,
     * when the canvas api is not available
     * @param {string} scene
     */
    setSceneInBrowser(scene) {
      if (!Config.browser) return;

      this.setScene(scene);
    },

    getPlayerById(id) {
      return this.players.find((player) => player.id === id);
    },

    saveGameResult({level, questionsUsed, secondsUsed, gameOver}) {
      if (!Config.browser) {
        const result = gameOver ? 'loss' : 'win';
        return canvas.sendText(
            `saveGameResult ${
              level.ordinal
            } ${
              questionsUsed
            } ${
              secondsUsed
            } ${
              result
            }`,
        );
      }

      const newResult = {
        id: uuid.v4(),
        questionsUsed,
        secondsUsed,
        level: level.ordinal,
        playerId: this.currentPlayer.id,
        timestamp: Date.now(),
        gameOver,
      };

      browserStore.gameResults = [...browserStore.gameResults, newResult];
    },

    selectPlayer({color, animal}) {
      // in non browser environment, the player selection
      // is handled by the backend
      if (!Config.browser) return;

      const currentPlayerIndex = browserStore.players.findIndex(
          (player) => player.color === color && player.animal === animal,
      );

      if (currentPlayerIndex < 0) {
        throw new Error(
            `Trying to select a non existing player. ${color} ${animal}`,
        );
      }

      const currentPlayer = browserStore.players[currentPlayerIndex];
      browserStore.currentPlayer = currentPlayer;

      currentPlayer.lastPlayed = Date.now();
      this.$set(browserStore.players, currentPlayerIndex, currentPlayer);
    },

    createPlayer({color, animal}) {
      if (!Config.browser) {
        canvas.sendText(`createplayer ${color} ${animal}`);
        return;
      }

      const newPlayer = {
        color,
        animal,
        id: uuid.v4(),
        lastPlayed: Date.now(),
      };
      browserStore.players = [...browserStore.players, newPlayer];
      browserStore.isNewPlayer = true;
    },

    selectColor(color) {
      if (!Config.browser) return;
      browserStore.currentColor = color;
    },

    selectHidingMode(hidingMode) {
      if (!Config.browser) return;
      browserStore.currentHidingMode = hidingMode;
    },

    getGameResultsPerLevel(level) {
      return this.gameResults.filter((result) => {
        return (
          result.level === level.ordinal &&
          !!this.getPlayerById(result.playerId)
        );
      });
    },

    getHighscoreResultPerLevel(level) {
      const winResults = this.getGameResultsPerLevel(level).filter(
          (result) => !result.isGameOver(),
      );
      const sortedResults = [...winResults].sort((a, b) => b.score - a.score);
      return sortedResults[0];
    },

    getGameResultsForPlayer(player) {
      return this.gameResults.filter((result) => result.playerId === player.id);
    },

    isLevelUnlocked(level, player) {
      if (!level.levelRequiredId) return true;
      const results = this.getGameResultsForPlayer(player);
      // here we are checking if the user played and won in the
      // the required level to unlock this level
      return results.some(
          (result) =>
            !result.isGameOver() &&
          result.getLevel().id === level.levelRequiredId,
      );
    },
  },
});
