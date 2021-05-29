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

<style src="./HidingSpot.scss" module lang="scss"></style>
<script src="./HidingSpot.js"></script>

<template>
  <button
    ref="button"
    :class="[
      $style.hidingSpot,
      $style[id],
      'button',
      !showWhiteOutline && $style.glowHidden,
    ]"
    :title="title || label || ''"
    :aria-label="title || ''"
    :type="type === ButtonType.SUBMIT ? 'submit' : 'button'"
    @click="handleClick"
  >
    <span ref="glow" :class="[$style.glow, 'abs-fill']" />
    <span ref="pinkGlow" :class="[$style.pinkGlow, 'abs-fill']" />
    <!--{{ id }}-->
  </button>
</template>
