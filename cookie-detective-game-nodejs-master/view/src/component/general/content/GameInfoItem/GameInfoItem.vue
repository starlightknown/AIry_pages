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

<style src="./GameInfoItem.scss" module lang="scss"></style>
<script src="./GameInfoItem.js"></script>

<template>
  <div :class="[$style.gameInfoItem, 'abs-fill']">
    <p
      :class="[$style.description, 'heading-03']"
      v-html="description"
    />

    <div :class="[$style.visual]">
      <Timer
        v-if="type === GameInfoId.TIME"
        ref="visualItem"
        :class="[$style.visualItem, 'abs-center']"
        :size="Size.LARGE"
        :seconds="89"
        @isReady="handleComponentIsReady"
      />

      <QuestionCountdown
        v-if="type === GameInfoId.AMOUNT_OF_QUESTIONS"
        ref="visualItem"
        :count="maxQuestions"
        :class="[$style.visualItem, 'abs-center']"
        @isReady="handleComponentIsReady"
      />

      <div
        v-if="type === GameInfoId.CHOICE"
        ref="visualItem"
        :class="[$style.visualItem, $style.choiceVisual, 'abs-center']"
        @isReady="handleComponentIsReady"
      />
    </div>
  </div>
</template>
