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
import {DisposableManager} from 'seng-disposable-manager';
import {DisposableEventListener} from 'seng-disposable-event-listener';
import GameResultPageTransitionController
  from './GameResultPageTransitionController';
import LottieAnimation
  from '../../component/asset/LottieAnimation/LottieAnimation';
import GameResultCard
  from '../../component/general/content/GameResultCard/GameResultCard';
import LevelUnlockedView
  from '../../component/general/content/LevelUnlockedView/LevelUnlockedView';
import PrimaryButton from '../../component/button/PrimaryButton/PrimaryButton';
import DiscoLights from '../../component/asset/DiscoLights/DiscoLights';
import SpriteSequence
  from '../../component/general/image/SpriteSequence/SpriteSequence';
import AudioPlayer from '../../component/asset/AudioPlayer/AudioPlayer';
import {spriteSequences, audio} from '../../data/assets';
import {sleep} from '../../util/sleep';
import {sceneDataMixin} from '../../mixins/sceneDataMixin';
import {gameSessionMixin} from '../../mixins/gameSessionMixin';
import {preloaderMixin} from '../../mixins/preloaderMixin';

export default {
  name: 'GameResultPage',
  components: {
    LevelUnlockedView,
    GameResultCard,
    LottieAnimation,
    PrimaryButton,
    DiscoLights,
    SpriteSequence,
    AudioPlayer,
  },
  extends: AbstractPageTransitionComponent,
  mixins: [sceneDataMixin('gameEnd'), gameSessionMixin, preloaderMixin],
  data() {
    return {
      spriteSequences,
    };
  },
  computed: {
    gameResult() {
      return this.lastGameResult;
    },
    user() {
      return this.getPlayerById(this.gameResult.playerId);
    },
    level() {
      return this.gameResult.getLevel();
    },
    unlockedLevel() {
      if (this.gameResult.isGameOver()) return null;

      const results = this.getGameResultsForPlayer(this.user).filter(
          (res) => !res.isGameOver() && res.level === this.level.ordinal,
      );

      // it's not the first time playing and winning this level
      if (results.length > 1) return null;

      return this.$levelModel
          .getArrayOfItems()
          .find((lev) => lev.levelRequiredId === this.level.id);
    },
    isHighScore() {
      return (
        this.gameResult.timestamp ===
        this.getHighscoreResultPerLevel(this.level).timestamp
      );
    },
  },
  created() {
    this.disposableManager = new DisposableManager();

    this.voices = {
      level_unlocked_intro: this.$tFormatted('voice.level_unlocked_intro'),
      level_unlocked_intro_fallback: this.$tFormatted(
          'voice.level_unlocked_intro_fallback',
      ),
      level_unlocked_proceed: this.$tFormatted('voice.level_unlocked_proceed'),
      win: this.createWinVoice(),
      lose: this.$tFormatted('voice.game_lose_intro'),
      try_again: this.$tFormatted('voice.game_lose_try_again'),
      try_again_fallback: this.$tFormatted(
          'voice.game_lose_try_again_fallback',
      ),
      what_to_do: this.$tFormatted('voice.game_end_what_to_do'),
      what_to_do_fallback: this.$tFormatted(
          'voice.game_end_what_to_do_fallback',
      ),
      fallback: this.$tFormatted('voice.general_fallback_response'),
    };
  },
  beforeDestroy() {
    if (this.disposableManager) {
      this.disposableManager.dispose();
    }
  },
  methods: {
    handleVoiceInput(input) {
      const inputMap = {
        'yes': 'handleYesAnswer',
        'try again': 'tryAgain',
        'next level': 'nextLevel',
      };

      const handlerName = inputMap[input];

      if (!handlerName) return this.handleVoiceNoMatch();

      sleep(200).then(() => {
        this[handlerName]();
      });
    },

    async handleVoiceNoMatch() {
      await this.$say(this.voiceFallback || this.voices.fallback);
      this.$listen();
    },

    handleYesAnswer() {
      if (this.unlockedLevel) {
        this.nextLevel();
        return;
      }

      this.tryAgain();
    },

    handleTextQueryError() {
      this.showButtons();
    },

    tryAgain() {
      this.selectLevel(this.level);
      this.safeSend('continueToHidingModeSelection');
      this.setSceneInBrowser('hidingModeSelection');
    },

    async nextLevel() {
      if (!this.unlockedLevel) {
        this.handleStartMenuClick();
        return;
      }

      await this.$say(this.voices.level_unlocked_proceed);
      this.selectLevel(this.unlockedLevel);

      this.safeSend('continueToHidingModeSelection');
      this.setSceneInBrowser('hidingModeSelection');
    },

    async handleRetryClick() {
      await this.hideButtons();

      if (this.$isBrowser) return this.tryAgain();

      this.safeSend('try again');
    },

    async handleNextLevelClick() {
      await this.hideButtons();

      if (this.$isBrowser) return this.nextLevel();

      this.safeSend('next level');
    },

    async handleStartMenuClick() {
      await this.hideButtons();

      this.safeSend('level select');
      this.setSceneInBrowser('levelSelection');
    },

    async handleTransitionInStart() {
      this.$showFloor(true);
      this.$sprinkles.show();

      if (!this.gameResult.isGameOver()) {
        await this.startWinFlow();
      } else {
        await this.startLossFlow();
      }

      this.$listen();
    },

    async startWinFlow() {
      this.$refs.audioPlayer.setSrc(audio.WIN.source);

      await sleep(1000);

      this.$refs.audioPlayer.play();
      await this.transitionController.playDanceTimeline();

      await Promise.all([
        this.$say(this.voices.win),
        this.transitionController.playHighScoreTimeline(),
      ]);

      if (this.unlockedLevel) {
        this.voiceFallback = this.voices.level_unlocked_intro_fallback;

        await sleep(2000);
        this.transitionController.showUnlockedLevel();
        await this.$say(this.voices.level_unlocked_intro);
        this.transitionController.showButtons();
      } else {
        this.voiceFallback = this.voices.what_to_do_fallback;

        await this.$say(this.voices.what_to_do);
        this.transitionController.showButtons();
      }
    },

    async startLossFlow() {
      this.$refs.audioPlayer.setSrc(audio.LOSS.source);

      await sleep(1000);

      this.voiceFallback = this.voices.try_again_fallback;

      this.$refs.audioPlayer.play();
      await this.transitionController.playDanceTimeline();
      await Promise.all([
        this.$say(this.voices.lose),
        this.transitionController.playHighScoreTimeline(),
      ]);

      await this.$say(this.voices.try_again);
      await this.transitionController.showButtons();
    },

    handleTransitionOutStart() {},

    async handleAllComponentsReady() {
      this.transitionController = new GameResultPageTransitionController(this);

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

    handleComponentIsReady() {},

    hideButtons() {
      return Promise.all([
        this.$refs.ctaButtonLeft.transitionOut(),
        this.$refs.ctaButtonRight.transitionOut(),
      ]);
    },

    showButtons() {
      return Promise.all([
        this.$refs.ctaButtonLeft.transitionIn(),
        this.$refs.ctaButtonRight.transitionIn(),
      ]);
    },

    createWinVoice() {
      const args = {
        userName: `${this.user.color} ${this.user.animal}`,
        score: this.gameResult.score,
        questionsLeft: this.gameResult.questionsLeft,
        seconds: this.gameResult.secondsUsed,
        minutes: 0,
      };

      let voiceTranslationKey = 'voice.win_score_calculation_seconds';

      if (this.gameResult.secondsUsed >= 120) {
        args.seconds = this.gameResult.secondsUsed % 60;
        args.minutes = Math.round(this.gameResult.secondsUsed / 60);
        voiceTranslationKey = 'voice.win_score_calculation_minutes';
      }

      return this.$tFormatted(voiceTranslationKey, args);
    },
  },
};
