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

<style src="./PlayerSelectionPage.scss" module lang="scss"></style>
<script src="./PlayerSelectionPage.js"></script>

<template>
  <div :class="[$style.playerSelectionPage]">
    <FullScreenQuestion
      :id="question.id"
      ref="questions"
      :options="question.options"
      :question="question.question"
      :direction="question.direction"
      :character-animation="question.characterAnimation"
      :class="[$style.fullscreenQuestion]"
      :max-answers="question.maxAnswers"
      @onSelect="onAnswerSelect"
      @isReady="handleComponentIsReady"
    />
  </div>
</template>
