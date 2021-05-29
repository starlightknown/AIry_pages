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

<style src="./PrimaryButton.scss" module lang="scss"></style>
<script src="./PrimaryButton.js"></script>

<template>
  <div
    :class="[$style.primaryButton, {
      [$style.hasCircle]: circleColor,
    }]"
  >
    <a
      v-if="type === ButtonType.LINK"
      ref="button"
      :class="[$style.button, 'button']"
      :href="target"
      :title="title || label || ''"
      :aria-label="title || ''"
      @click="handleClick"
    >

      <div
        ref="background"
        :class="[$style.background]"
      />

      <div
        v-if="circleColor"
        ref="circleColor"
        :style="{
          backgroundColor: circleColor,
        }"
        :class="[$style.circleColor]"
      >

        <Icon
          v-if="icon"
          ref="icon"
          :name="icon"
          :class="[$style.icon, 'abs-center']"
        />
      </div>

      <span
        ref="label"
        :class="$style.label"
        v-html="label"
      />
    </a>
    <button
      v-else
      ref="button"
      :class="[$style.button, 'button']"
      :title="title || label || ''"
      :aria-label="title || ''"
      :type="type === ButtonType.SUBMIT ? 'submit' : 'button'"
      @click="handleClick"
    >
      <div
        ref="background"
        :class="[$style.background]"
      />

      <div
        v-if="circleColor"
        ref="circleColor"
        :style="{
          backgroundColor: circleColor,
        }"
        :class="[$style.circleColor]"
      >
        <Icon
          v-if="icon"
          ref="icon"
          :name="icon"
          :class="[$style.icon, 'abs-center']"
        />
      </div>

      <span
        ref="label"
        :class="$style.label"
        v-html="label"
      />
    </button>
  </div>
</template>


