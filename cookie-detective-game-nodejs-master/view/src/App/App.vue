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

<style src="./App.scss" module lang="scss"></style>
<script src="./App.js"></script>

<template>
  <div :class="[$style.app, $style[$platform]]">
    <div
      v-if="isDev"
      :class="[$style.version]"
    >
      {{ version }}
    </div>

    <Loader
      ref="loader"
      :manual="true"
      :class="$style.loader"
      @isReady="handleLoaderReady"
    />

    <div
      v-if="!$isBrowser"
      :class="[$style.topBar]"
    />

    <SplashView
      ref="splashView"
      :class="[$style.splashView]"
      :progress="applicationLoadProgress"
      @isReady="handleSplashViewReady"
      @animationCompleted="handleSplashScreenAnimationCompleted"
    />

    <SprinklesBackground
      v-if="applicationLoaded"
      ref="sprinklesBackground"
      :class="[$style.backgroundConfetti]"
      @isReady="handleSprinklesReady"
    />

    <div
      ref="floor"
      :class="[$style.floor]"
    />

    <transition @leave="onLeave">
      <router-view
        v-if="applicationLoaded"
        :class="[$style.page]"
        @isReady="handlePageIsReady"
      />
    </transition>
  </div>
</template>
