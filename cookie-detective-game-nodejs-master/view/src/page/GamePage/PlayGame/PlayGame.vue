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

<style src="./PlayGame.scss" module lang="scss"></style>
<script src="./PlayGame.js"></script>


<template>
  <div :class="[$style.playGame, 'abs-fill']">
    <QuestionCountdown
      ref="questionCountDown"
      :class="[$style.questionCountdown]"
      :has-radius="false"
      :count="level.maxQuestions - questionsAskedCount"
      @isReady="handleComponentIsReady"
    />

    <Timer
      ref="timer"
      :class="[$style.timer]"
      :has-radius="true"
      :size="Size.LARGE"
      :seconds="elapsedSeconds"
      @isReady="handleComponentIsReady"
    />

    <AnswerOptions
      id="attributes_options"
      ref="answerOptions"
      :options="formattedAttributes"
      :class="[$style.answerOptions]"
      :max-answers="2"
      @onSelect="onAttributeSelected"
      @isReady="handleComponentIsReady"
    />
  </div>
</template>

