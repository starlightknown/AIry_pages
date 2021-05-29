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

<style src="./GamePage.scss" module lang="scss"></style>
<script src="./GamePage.js"></script>

<template>
  <div :class="[$style.gamePage]">
    <LevelBackground
      :id="level.id"
      :background="$assets.get(level.background)"
      @isReady="handleComponentIsReady"
    >
      <HidingSpotContainer
        v-if="canPlayGame"
        ref="hidingSpots"
        :show-outlines="level.showOutlines"
        :available-hiding-spots="availableHidingSpots"
        :hiding-spot="hidingSpot"
        @guessHidingSpot="handleHidingSpotSelected"
        @isReady="handleComponentIsReady"
      />

      <ManualHidingHotspots
        ref="manualHidingHotspots"
        :hotspots="hidingSpots.map((hidingSpot) => {
          return {
            ...hidingSpot.hotspot,
            ...{
              id: hidingSpot.id
            }
          }
        })"
        @hidingSpotSelected="onManualHidingHotspotSelected"
        @isReady="handleComponentIsReady"
      />
    </LevelBackground>

    <GameInfo
      ref="gameInfo"
      :class="[$style.gameInfo]"
      :max-questions="level.maxQuestions"
      @close="handleCloseGameInfo"
      @isReady="handleComponentIsReady"
    />

    <PlayGame
      v-if="canPlayGame"
      ref="playGame"
      :user="user"
      :level="level"
      :formatted-attributes="formattedAttributes"
      :questions-asked-count="questionsAskedCount"
      :elapsed-seconds="elapsedSeconds"
      :class="[$style.playGame]"
      @selectAttribute="handleAttributeSelected"
      @isReady="handlePlayGameIsReady"
    />

    <div
      ref="lights"
      :class="[$style.lights, 'abs-fill']"
    />
  </div>
</template>
