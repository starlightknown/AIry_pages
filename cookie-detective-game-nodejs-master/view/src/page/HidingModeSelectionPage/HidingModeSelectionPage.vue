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

<style src="./HidingModeSelectionPage.scss" module lang="scss"></style>
<script src="./HidingModeSelectionPage.js"></script>

<template>
  <div :class="[$style.hidingModeSelectionPage, 'abs-fill']">
    <LevelBackground
      :id="currentLevel.id"
      :background="$assets.get(currentLevel.background)"
      @isReady="handleComponentIsReady"
    />

    <LottieAnimation
      :id="lottieAnimationId.characterQuestionLeft1"
      ref="characterAnimation"
      :class="[$style.characterAnimation]"
      @isReady="handleComponentIsReady"
    />

    <SpeechBubble
      ref="speechBubble"
      :class="[$style.speechBubble]"
      :description="title"
      @isReady="handleComponentIsReady"
    />

    <div :class="[$style.ctaHolder]">
      <PrimaryButton
        ref="autoButton"
        :class="[$style.button]"
        :label="$t('chooseHidingType.autoHide')"
        :type="ButtonType.ACTION"
        @click="handleAutoHideCookie"
        @isReady="handleComponentIsReady"
      />

      <PrimaryButton
        ref="manualButton"
        :class="[$style.button]"
        :label="$t('chooseHidingType.manualHide')"
        :type="ButtonType.ACTION"
        @click="handleManualHideCookie"
        @isReady="handleComponentIsReady"
      />
    </div>
  </div>
</template>
