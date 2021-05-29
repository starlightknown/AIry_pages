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

<style src="./LeaderboardItem.scss" module lang="scss"></style>
<script src="./LeaderboardItem.js"></script>

<template>
  <div :class="[$style.leaderboardItem, $style[themeStyle]]">
    <div :class="[$style.content]">
      <div
        ref="avatar"
        :class="[$style.avatar]"
        :style="{
          backgroundColor: $colorModel.getItemById(user.color).hexColor
        }"
      >
        <Icon
          :class="[$style.avatarIcon, 'abs-center']"
          :name="$animalModel.getItemById(user.animal).icon"
        />
      </div>

      <div :class="[$style.info]">
        <div
          ref="subject"
          :class="[$style.subject]"
        >
          <span :class="[$style.icon]" />
          <span>{{ $t('global.highscore') }}</span>
        </div>

        <div
          ref="name"
          :class="[$style.name]"
        >
          {{ user.color }} {{ user.animal }}
        </div>
      </div>
    </div>

    <div
      ref="score"
      :class="[$style.score]"
      v-text="highScore"
    />
  </div>
</template>
