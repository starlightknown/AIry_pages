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

<style src="./Loader.scss" module lang="scss"></style>
<script src="./Loader.js"></script>

<template>
  <div
    ref="loader"
    :class="$style.loader"
  >
    <svg :class="$style.progressWrapper">
      <defs>
        <linearGradient
          id="gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop
            offset="0%"
            stop-color="#5cf27b"
          />
          <stop
            offset="30%"
            stop-color="#37bf4b"
          />
          <stop
            offset="100%"
            stop-color="#62f078"
          />
        </linearGradient>
      </defs>
      <circle
        :class="$style.progressCircle"
        stroke="url(#gradient)"
        :style="setProgressStyles()"
        :stroke-width="setStrokeWidth()"
        :r="setRadius()"
        :cx="setCenter()"
        :cy="setCenter()"
      />
    </svg>
    <div :class="[$style.innerCircle, 'abs-center']">
      <div
        ref="label"
        :class="[$style.progress, 'heading-03']"
        v-html="currentProgress"
      />
    </div>
  </div>
</template>
