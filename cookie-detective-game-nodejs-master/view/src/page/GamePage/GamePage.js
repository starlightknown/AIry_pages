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

import {
  AbstractPageTransitionComponent,
  TransitionEvent,
} from 'vue-transition-component';
import {sample, uniq} from 'lodash';
import {DisposableEventListener} from 'seng-disposable-event-listener';
import {DisposableManager} from 'seng-disposable-manager';
import GamePageTransitionController from './GamePageTransitionController';
import GameInfo from './GameInfo/GameInfo';
import PlayGame from './PlayGame/PlayGame';
import {cookieHidingTypeId} from '../../data/type/CookieHidingTypeId';
import LevelBackground
  from '../../component/general/level/LevelBackground';
import ManualHidingHotspots
  from '../../component/general/level/ManualHidingHotspots';
import HidingSpotContainer
  from '../../component/general/level/HidingSpotContainer';
import {sceneDataMixin} from '../../mixins/sceneDataMixin';
import {gameSessionMixin} from '../../mixins/gameSessionMixin';
import {preloaderMixin} from '../../mixins/preloaderMixin';
import {sleep} from '../../util/sleep';

/**
 * This page is where much of the game logic is handled
 *
 * In each level there are different hiding spots, each of
 * them can have different attributes
 *
 * The user can ask a question about an hiding spot directly,
 * or about an attribute.
 *
 * This page will then understand if the question is related
 * to an hiding spot or attribute, and reacts consequently until
 * the user win or loses
 * the page is related to the "game" scene in the action console
 */

export default {
  name: 'GamePage',
  components: {
    GameInfo,
    PlayGame,
    LevelBackground,
    ManualHidingHotspots,
    HidingSpotContainer,
  },
  mixins: [sceneDataMixin('game'), gameSessionMixin, preloaderMixin],
  extends: AbstractPageTransitionComponent,
  data() {
    return {
      hidingSpotId: null,
      guessedHidingSpots: {},
      guessedAttributes: {},
      questionsAskedCount: 0,
      intervalId: null,
      elapsedSeconds: 0,
      gameFinished: false,
    };
  },
  computed: {
    user() {
      return this.currentPlayer || {};
    },
    userName() {
      return `${this.user.color} ${this.user.animal}`;
    },
    level() {
      return this.currentLevel;
    },
    hidingSpot() {
      return this.$hidingSpotModel.getItemById(this.hidingSpotId);
    },
    canPlayGame() {
      return !!this.level && !!this.user && !!this.hidingSpot;
    },
    hidingSpots() {
      return this.$hidingSpotModel.getItemsByIds(this.level.hidingSpotIds);
    },
    availableHidingSpots() {
      return this.hidingSpots
          .filter((spot) => !this.guessedHidingSpots[spot.id])
          .filter((spot) => {
            return Object.keys(this.guessedAttributes).every((id) => {
              const {correct} = this.guessedAttributes[id];
              const hasAttribute = spot.attributeIds.indexOf(id) > -1;
              if (correct && !hasAttribute) return false;
              if (!correct && hasAttribute) return false;
              return true;
            });
          });
    },
    attributes() {
      const attributeIds = this.hidingSpots.reduce((ids, hidingSpot) => {
        return ids.concat(hidingSpot.attributeIds);
      }, []);
      const uniqIds = uniq(attributeIds);
      return this.$attributeModel.getItemsByIds(uniqIds);
    },
    availableAttributes() {
      if (this.gameFinished) return [];

      const attributeIds = this.availableHidingSpots.reduce(
          (ids, hidingSpot) => {
            return ids.concat(hidingSpot.attributeIds);
          },
          [],
      );

      const uniqIds = uniq(attributeIds);
      return this.$attributeModel
          .getItemsByIds(uniqIds)
          .filter(
              (attr) =>
                !this.guessedAttributes[attr.id] &&
            !this.guessedAttributeTypes[attr.typeId],
          );
    },
    guessedAttributeTypes() {
      const types = {};
      Object.keys(this.guessedAttributes).forEach((id) => {
        if (!this.guessedAttributes[id].correct) return;
        types[this.$attributeModel.getItemById(id).typeId] = true;
      });
      return types;
    },
    formattedAttributes() {
      return this.availableAttributes.map((attribute) => ({
        id: attribute.id,
        label: attribute.textQuery,
      }));
    },
  },
  created() {
    this.playGameIsReadyPromise = new Promise((resolve) => {
      this.playGameIsReadyResolver = resolve;
    });
    this.disposableManager = new DisposableManager();

    const args = {
      userName: this.currentPlayerUserName,
      kitchen: this.$t(`level.${this.currentLevel.id}.name`),
    };

    this.voices = {
      intro_1: this.$tFormatted('voice.gameloop_intro_1', args),
      hiding_method_manual_1: this.$tFormatted(
          'voice.hiding_method_manual_1',
          args,
      ),
      hiding_method_manual_2: this.$tFormatted(
          'voice.hiding_method_manual_2',
          args,
      ),
      hiding_method_self: this.$tFormatted('voice.hiding_method_self', args),
      hiding_spot_true: this.$tFormatted(
          'voice.gameloop_hidingspot_true',
          args,
      ),
    };

    this.assets = {
      background: this.level.background,
    };
  },
  beforeDestroy() {
    this.stopTimer();
    this.clearNextActionTimeout();

    if (this.disposableManager) {
      this.disposableManager.dispose();
    }
  },
  methods: {
    async speakAndListen() {
      await this.$say(this.voices.intro_1);
      this.$listen();
    },

    async handleVoiceInput(input) {
      input = input.split(' ');
      const type = input.shift();
      const data = input.join(' ');

      if (type === 'attribute') {
        const attribute = this.attributes.find((attr) => attr.id === data);

        if (!attribute) return this.handleVoiceNoMatch();

        await this.onAttributeSelected(attribute);
        await this.$nextTick();
        if (!this.gameFinished) this.$listen();
        return;
      }

      if (type === 'hidingSpot') {
        const hidingSpot = this.hidingSpots.find((spot) => spot.id === data);

        if (!hidingSpot) return this.handleVoiceNoMatch();

        await this.onHidingSpotSelected(hidingSpot);
        await this.$nextTick();
        if (!this.gameFinished) this.$listen();
        return;
      }

      return this.handleVoiceNoMatch();
    },

    handleTextQueryError() {
      return this.$refs.playGame.showButtons();
    },

    async handleVoiceNoMatch() {
      await this.$say(
          this.$tFormatted('voice.gameloop_exceptions', {
            question: sample(
                this.availableHidingSpots.concat(this.availableAttributes),
            ).textQuery,
          }),
      );
      this.$listen();
    },

    handleCloseGameInfo() {
      this.$refs.gameInfo.transitionOut();

      this.playGameIsReadyPromise.then(() => {
        Promise.all([
          this.$refs.hidingSpots.transitionIn(),
          this.$refs.playGame.transitionIn(),
          this.speakAndListen(),
        ]).then(() => {
          this.startTimer();
        });
      });
    },

    onManualHidingHotspotSelected(data) {
      this.hidingSpotId = data.id;
      this.$refs.manualHidingHotspots.transitionOut().then(() => {
        this.$refs.gameInfo.transitionIn();
      });
    },

    clearNextActionTimeout() {
      if (this.nextActionTimeout) {
        clearTimeout(this.nextActionTimeout);
        this.nextActionTimeout = null;
      }
    },

    nextActionTimeout(time, callback) {
      this.clearNextActionTimeout();
      this.nextActionTimeout = setTimeout(() => {
        callback();
      }, time);
    },

    handlePlayGameIsReady() {
      this.playGameIsReadyResolver();
    },

    async handleTransitionInStart() {
      if (this.currentHidingMode === cookieHidingTypeId.manual) {
        await this.$say(this.voices.hiding_method_manual_1);
        await this.$refs.manualHidingHotspots.transitionIn();
        await this.$say(this.voices.hiding_method_manual_2);
      } else {
        await this.$say(this.voices.hiding_method_self);
        this.hidingSpotId = sample(this.hidingSpots).id;

        // eslint-disable-next-line
        console.debug('spot:', this.hidingSpotId);

        this.transitionController.enableLights(false).then(() => {
          this.nextActionTimeout(2000, () => {
            this.transitionController.enableLights(true);
            this.$refs.gameInfo.transitionIn();
          });
        });
      }
    },

    handleAllComponentsReady() {
      this.transitionController = new GamePageTransitionController(this);
      this.disposableManager.add(
          new DisposableEventListener(
              this.transitionController,
              TransitionEvent.types.TRANSITION_IN_START,
              this.handleTransitionInStart.bind(this),
          ),
      );
      this.isReady();
    },

    async handleAttributeSelected(attributeId) {
      await this.$refs.playGame.hideButtons();

      const attribute = this.$attributeModel.getItemById(attributeId);
      if (this.$isBrowser) {
        this.onAttributeSelected(attribute);
      } else {
        this.safeSend(attribute.textQuery);
      }
    },

    handleHidingSpotSelected(hidingSpotId) {
      const hidingSpot = this.$hidingSpotModel.getItemById(hidingSpotId);
      if (this.$isBrowser) {
        this.onHidingSpotSelected(hidingSpot);
      } else {
        this.safeSend(hidingSpot.textQuery);
      }
    },

    async onAttributeSelected(attribute) {
      const hasAttribute = !!this.hidingSpot.attributeIds.find(
          (id) => id === attribute.id,
      );

      this.$set(this.guessedAttributes, attribute.id, {
        correct: hasAttribute,
      });

      this.questionsAskedCount += 1;

      if (this.checkGameOver()) return;

      if (hasAttribute) {
        await this.$say(
            this.$tFormatted(
                `voice.gameloop_characteristic_true.${attribute.typeId}`,
                {
                  arg: attribute.id,
                },
            ),
        );
      } else {
        await this.$say(
            this.$tFormatted(
                `voice.gameloop_characteristic_false.${attribute.typeId}`,
                {
                  arg: attribute.id,
                },
            ),
        );
      }
    },

    async onHidingSpotSelected(hidingSpot) {
      const isRightSpot = hidingSpot.id === this.hidingSpot.id;
      this.$set(this.guessedHidingSpots, hidingSpot.id, {
        correct: isRightSpot,
      });

      this.questionsAskedCount += 1;

      if (isRightSpot) {
        return this.finishGame({gameOver: false});
      }

      if (this.checkGameOver()) return;

      await this.$say(
          this.$tFormatted(`voice.gameloop_hidingspot_false.${hidingSpot.id}`),
      );
    },

    checkGameOver() {
      const isGameOver = this.questionsAskedCount >= this.level.maxQuestions;

      if (isGameOver) this.finishGame({gameOver: true});

      return isGameOver;
    },

    async finishGame({gameOver}) {
      this.gameFinished = true;
      this.stopTimer();

      if (!gameOver) {
        await this.$say(this.voices.hiding_spot_true);
      } else {
        await this.$say(
            this.$tFormatted(`voice.game_over.${this.hidingSpot.id}`),
        );
      }

      this.$sprinkles.show();

      await sleep(200);

      this.saveGameResult({
        player: this.user,
        level: this.level,
        secondsUsed: this.elapsedSeconds,
        questionsUsed: this.questionsAskedCount,
        gameOver,
      });

      this.setSceneInBrowser('gameEnd');
    },

    startTimer() {
      this.intervalId = setInterval(() => {
        this.elapsedSeconds += 1;
      }, 1000);
    },

    stopTimer() {
      clearInterval(this.intervalId);
      this.intervalId = null;
    },

    handleComponentIsReady() {},
  },
};
