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

<style src="./GameInfo.scss" module lang="scss"></style>
<script src="./GameInfo.js"></script>

<template>
  <div :class="[$style.gameInfo, 'abs-fill']">
    <div
      ref="mask"
      :class="[$style.mask, 'abs-fill']"
    />

    <div :class="[$style.infoContainer, 'site-frame']">
      <GameInfoItem
        v-for="(item, index) in gameInfoItems"
        ref="gameInfoItems"
        :key="index"
        :type="item.id"
        :max-questions="maxQuestions"
        :description="item.description"
        :class="[$style.infoItem]"
        @isReady="handleComponentIsReady"
      />
    </div>
  </div>
</template>
