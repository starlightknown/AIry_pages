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

<style src="./LevelSelectionPage.scss" module lang="scss"></style>
<script src="./LevelSelectionPage.js"></script>

<template>
  <div :class="[$style.levelSelectionPage]">
    <div :class="[$style.contentFrame, 'site-frame']">
      <PrimaryTextReveal
        ref="title"
        :text="$t(`startMenu.${'homeKitchen'}.title`)"
        tag="h2"
        :class="[$style.title, 'heading-02', 'title-stroke']"
        @isReady="handleComponentIsReady"
      />

      <div :class="[$style.cardContainer]">
        <LevelPreviewCard
          v-for="(level, index) in levels"
          ref="cards"
          :key="level.id"
          :name="$t(`level.${level.id}.name`)"
          :theme-id="level.themeId"
          :caption="$t(`level.${level.id}.shortName`)"
          :is-locked="!isLevelUnlocked(level, user)"
          :image="
            `${$assets.get($levelModel.getItemById(level.id).previewImage)}`
          "
          :class="[$style.card]"
          :high-score="getHighscorePerLevel(level)"
          :user="getHighscorePlayerPerLevel(level)"
          @click.native="handleLevelClick(level, index)"
          @isReady="handleComponentIsReady"
        />
      </div>
    </div>
  </div>
</template>
