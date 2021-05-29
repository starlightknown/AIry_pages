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

import {DisposableEventListener} from 'seng-disposable-event-listener';
import {DisposableManager} from 'seng-disposable-manager';
import {
  AbstractPageTransitionComponent,
  TransitionEvent,
} from 'vue-transition-component';
import LevelSelectionPageTransitionController
  from './LevelSelectionPageTransitionController';
import LevelPreviewCard
  from '../../component/general/content/LevelPreviewCard';
import BackgroundConfetti
  from '../../component/asset/BackgroundConfetti';
import LeaderboardItem
  from '../../component/asset/LeaderboardItem';
import PrimaryTextReveal
  from '../../component/type/PrimaryTextReveal';
import {PLATFORMS} from '../../util/getPlatform';
import {sceneDataMixin} from '../../mixins/sceneDataMixin';
import {gameSessionMixin} from '../../mixins/gameSessionMixin';
import {preloaderMixin} from '../../mixins/preloaderMixin';

export default {
  name: 'LevelSelectionPage',
  components: {
    LevelPreviewCard,
    BackgroundConfetti,
    LeaderboardItem,
    PrimaryTextReveal,
  },
  mixins: [sceneDataMixin('levelSelection'), gameSessionMixin, preloaderMixin],
  extends: AbstractPageTransitionComponent,
  computed: {
    user() {
      return this.currentPlayer;
    },
    levels() {
      return this.$levelModel.getArrayOfItems();
    },
  },
  created() {
    this.disposableManager = new DisposableManager();

    this.voices = {
      intro: this.$tFormatted('voice.start_intro'),
      follow_me: this.$tFormatted('voice.start_followme'),
      greeting: this.$tFormatted('voice.startmenu_greeting', {
        userName: `${this.currentPlayer.color} ${this.currentPlayer.animal}`,
      }),
      fallback: this.$tFormatted('voice.start_fallback'),
    };

    this.levels.forEach((level) => {
      const name = this.$t(`level.${level.id}.name`);

      this.voices[`locked_level_${level.id}`] = this.$tFormatted(
          'voice.start_locked_level',
          {
            level: name,
          },
      );
    });
  },

  beforeDestroy() {
    if (this.disposableManager) {
      this.disposableManager.dispose();
    }
  },
  methods: {
    handleVoiceInput(input) {
      const levelIndex = this.levels.findIndex(
          (level) => level.ordinal === input,
      );

      if (levelIndex < 0) return this.handleVoiceNoMatch();

      return this.goToLevel(this.levels[levelIndex], levelIndex);
    },
    async handleVoiceNoMatch() {
      await this.$say(this.voices.fallback);
      this.$listen();
    },
    getHighScoreResultByLevel(level) {
      return this.getHighscoreResultPerLevel(level) || {};
    },
    handleLevelClick(level, index) {
      if (this.$platform === PLATFORMS.BROWSER) {
        this.goToLevel(level, index);
      } else {
        this.safeSend(level.textQuery);
      }
    },
    async goToLevel(level, index) {
      const otherCardIndexes = [0, 1, 2].filter((item) => item !== index);

      if (this.isLevelUnlocked(level, this.user)) {
        otherCardIndexes.forEach((int) =>
          this.$refs.cards[int].transitionOut(),
        );

        await Promise.all([
          this.transitionController.moveCardToCenter(index),
          this.$say(this.voices.follow_me),
        ]);

        this.selectLevel(level);
        this.safeSend('continueToHidingModeSelection');
        this.setSceneInBrowser('hidingModeSelection');

        return;
      }

      this.$refs.cards[index].triggerLockedLevelAnimation();

      await this.$say(this.voices[`locked_level_${level.id}`]);

      this.$listen();
    },
    getHighscorePerLevel(level) {
      const highscore = this.getHighscoreResultPerLevel(level);
      return highscore && highscore.score;
    },
    getHighscorePlayerPerLevel(level) {
      const highscore = this.getHighscoreResultPerLevel(level);
      return this.getPlayerById(highscore && highscore.playerId);
    },
    async handleTransitionInStart() {
      this.$showFloor(false);
      this.$sprinkles.show();

      if (!this.isNewPlayer) {
        await this.$say(this.voices.greeting);
      }

      await this.$say(this.voices.intro);
      this.$listen();
    },
    handleTransitionOutStart() {},
    handleComponentIsReady() {},
    handleAllComponentsReady() {
      this.transitionController = new LevelSelectionPageTransitionController(
          this,
      );
      this.disposableManager.add(
          new DisposableEventListener(
              this.transitionController,
              TransitionEvent.types.TRANSITION_IN_START,
              this.handleTransitionInStart.bind(this),
          ),
      );
      this.disposableManager.add(
          new DisposableEventListener(
              this.transitionController,
              TransitionEvent.types.TRANSITION_OUT_START,
              this.handleTransitionOutStart.bind(this),
          ),
      );
      this.isReady();
    },
  },
};
