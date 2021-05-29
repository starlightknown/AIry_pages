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

<style src="./GameResultCard.scss" module lang="scss"></style>
<script src="./GameResultCard.js"></script>

<template>
  <div :class="[$style.gameResultCard]">
    <SecondaryButton
      ref="button"
      :class="[$style.button]"
      :label="$t(`level.${gameResult.level}.shortName`)"
      :type="ButtonType.ACTION"
      :theme-id="themeId"
    />

    <PrimaryTextReveal
      ref="title"
      :text="`${gameResult.score} ${$t(`global.points`)}`"
      tag="h1"
      :class="[$style.score, 'heading-01']"
    />

    <h2
      ref="levelName"
      :class="[$style.levelName, 'heading-03']"
      v-html="$t(`level.${gameResult.level}.name`)"
    />

    <div :class="[$style.gameStats]">
      <QuestionCountdown
        ref="countDown"
        :count="gameResult.questionsLeft"
        :class="[$style.statItem]"
      />
      <Timer
        ref="timer"
        :class="[$style.statItem]"
        :size="Size.LARGE"
        :seconds="gameResult.secondsUsed"
      />
    </div>
  </div>
</template>
