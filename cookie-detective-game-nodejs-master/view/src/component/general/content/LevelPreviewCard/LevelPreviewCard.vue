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

<style src="./LevelPreviewCard.scss" module lang="scss"></style>
<script src="./LevelPreviewCard.js"></script>

<template>
  <button
    :class="[$style.levelPreviewCard, 'button', {
      [$style.isLocked]: isLocked,
      [$style.hasLeaderboard]: user
    }]"
  >
    <div :class="[$style.content]">
      <SecondaryButton
        ref="button"
        :class="[$style.button]"
        :label="caption"
        :type="ButtonType.ACTION"
        :theme-id="themeId"
        @click="$emit('click')"
        @isReady="handleComponentIsReady"
      />

      <div
        ref="placeholder"
        :class="[$style.placeholder]"
      >
        <div
          :class="[$style.image, 'abs-fill']"
          :style="{
            backgroundImage: `url(${image})`
          }"
        />

        <Icon
          v-if="isLocked"
          ref="lock"
          name="lock"
          :class="[$style.lockIcon, 'abs-center']"
        />
      </div>

      <h3
        ref="name"
        :class="[$style.name, 'heading-03']"
        v-html="isLocked ? $t('global.locked') : name"
      />
    </div>

    <LeaderboardItem
      v-if="user"
      ref="leaderboardItem"
      :high-score="highScore"
      :theme-id="themeId"
      :user="user"
      @isReady="handleComponentIsReady"
    />
  </button>
</template>
