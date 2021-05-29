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

<style src="./HidingSpotContainer.scss" module lang="scss"></style>
<script src="./HidingSpotContainer.js"></script>

<template>
  <div :class="[$style.hidingSpotContainer, 'abs-fill']">
    <HidingSpot
      v-for="spot in hidingSpots"
      :id="camelCase(spot.id)"
      :ref="spot.id"
      :key="spot.id"
      :class="[$style.hidingSpot, $style[camelCase(spot.id)], 'button']"
      :show-white-outline="showOutlines"
      :type="ButtonType.ACTION"
      @click="handleHidingSpotClick(spot)"
      @isReady="handleComponentIsReady"
    >
      {{ camelCase(spot.id) }}
    </HidingSpot>
  </div>
</template>
