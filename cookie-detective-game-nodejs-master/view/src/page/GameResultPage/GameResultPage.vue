<!--
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
-->

<style src="./GameResultPage.scss" module lang="scss"></style>
<script src="./GameResultPage.js"></script>

<template>
  <div :class="[$style.gameResultPage]">
    <DiscoLights
      ref="discoLights"
      :class="[$style.discoLights]"
      @isReady="handleComponentIsReady"
    />

    <div
      ref="content"
      :class="[
        $style.contentFrame,
        'site-frame',
        {
          [$style.isGameOver]: gameResult.isGameOver(),
        },
      ]"
    >
      <LottieAnimation
        :id="
          gameResult.isGameOver()
            ? level.lottieAnimation.loseScene
            : level.lottieAnimation.winScene
        "
        ref="lottieAnimation"
        :class="[$style.lottieAnimation]"
        @isReady="handleComponentIsReady"
      >
        <div :class="$style.cookieShadow" />
      </LottieAnimation>

      <div :class="[$style.contentInfo]">
        <div :class="[$style.infoWrapper, 'abs-fill']">
          <GameResultCard
            ref="gameResultCard"
            :game-result="{
              level: level.id,
              score: gameResult.score,
              questionsLeft: gameResult.questionsLeft,
              secondsUsed: gameResult.secondsUsed,
            }"
            :theme-id="level.themeId"
            :class="[$style.resultCard]"
            @isReady="handleComponentIsReady"
          />
        </div>

        <div :class="[$style.infoWrapper, 'abs-fill']">
          <LevelUnlockedView
            v-if="unlockedLevel"
            ref="levelUnlockedView"
            :title="$t('gameResult.unlocked.title')"
            :name="$t(`level.${unlockedLevel.id}.name`)"
            :theme-id="unlockedLevel.themeId"
            :caption="$t(`level.${unlockedLevel.id}.shortName`)"
            :image="`${$versionRoot}${unlockedLevel.previewImage}`"
            :class="[$style.card]"
            @click.native="handleNextLevelClick"
            @isReady="handleComponentIsReady"
          />
        </div>
      </div>
    </div>

    <div :class="[$style.ctaHolder]">
      <PrimaryButton
        v-if="!unlockedLevel"
        ref="ctaButtonLeft"
        :class="[$style.button]"
        :label="$t('global.retry')"
        :type="ButtonType.ACTION"
        @click="handleRetryClick"
        @isReady="handleComponentIsReady"
      />
      <PrimaryButton
        v-if="unlockedLevel"
        ref="ctaButtonLeft"
        :class="[$style.button]"
        :label="$t('global.nextLevel')"
        :type="ButtonType.ACTION"
        @click="handleNextLevelClick"
        @isReady="handleComponentIsReady"
      />

      <PrimaryButton
        ref="ctaButtonRight"
        :class="[$style.button]"
        :label="$t('global.selectLevel')"
        :type="ButtonType.ACTION"
        @click="handleStartMenuClick"
        @isReady="handleComponentIsReady"
      />
    </div>

    <AudioPlayer ref="audioPlayer" />
  </div>
</template>
