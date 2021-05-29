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

<style src="./ManualHidingHotspots.scss" module lang="scss"></style>
<script src="./ManualHidingHotspots.js"></script>

<template>
  <div :class="[$style.manualHidingHotspots, 'abs-fill']">
    <HotspotButton
      v-for="(hotspot, index) in hotspots"
      ref="hotspots"
      :key="index"
      :class="[$style.hotspot]"
      :type="ButtonType.ACTION"
      :style="{
        left: `${hotspot.position.x * 100}%`,
        top: `${hotspot.position.y * 100}%`,
        // transform: `translateZ(${hotspot.position.z}px) translate(-50%, 50%)`
      }"
      @click="$emit('hidingSpotSelected', hotspot)"
      @isReady="handleComponentIsReady"
    />
  </div>
</template>
