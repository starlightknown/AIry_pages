/**
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
 */

import VueTypes from 'vue-types';
import {AbstractTransitionComponent} from 'vue-transition-component';
import {DisposableManager} from 'seng-disposable-manager';
import * as PIXI from 'pixi.js';
import {TweenLite, Linear} from 'gsap';
import BackgroundConfettiTransitionController
  from './BackgroundConfettiTransitionController';
import {confettiBlurLevels, images, confettiColors} from '../../../data/assets';
import assetManager from '../../../lib/assetManager';

// @vue/component
export default {
  name: 'BackgroundConfetti',
  extends: AbstractTransitionComponent,
  props: {
    flakeAmount: VueTypes.number.def(Math.round(window.innerWidth / 60)),
    zRange: VueTypes.arrayOf(VueTypes.number).def([0.2, 1]),
    delayRange: VueTypes.arrayOf(VueTypes.number).def([0, 1]),
    speedRange: VueTypes.arrayOf(VueTypes.number).def([2, 6]),
  },
  created() {
    this.disposableManager = new DisposableManager();
    this.flake = {};
    this.textures = {};
    this.flakeTweens = [];
    this.isPlaying = false;
  },
  beforeDestroy() {
    if (this.disposableManager) {
      this.disposableManager.dispose();
    }
    this.stopConfetti();
  },
  mounted() {
    this.app = new PIXI.Application({
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight,
      transparent: true,
      resolution: 0.25,
      antialias: false,
      forceCanvas: false,
      forceFXAA: true,
      autoStart: false,
      resizeTo: this.$el,
      sharedTicker: false,
    });

    this.app.ticker.maxFPS = 30;

    this.$el.appendChild(this.app.view);

    this.container = new PIXI.Container();
    this.container.x = 0;
    this.container.y = 0;

    this.app.stage.addChild(this.container);

    confettiColors.forEach((color) => {
      confettiBlurLevels.forEach((blurLevel) => {
        this.textures[`${color}_blur_${blurLevel}`] = PIXI.Texture.from(
            assetManager.get(images[`confetti${color}blur${blurLevel}`]),
        );
      });
    });
  },
  methods: {
    startConfetti() {
      if (this.isPlaying) {
        return;
      }

      this.app.start();
      this.flakeTweens = [];
      this.isPlaying = true;
      const random = (source) =>
        source[Math.floor(Math.random() * source.length)];
      const randomNumber = (min, max) => Math.random() * (max - min + 1) + min;

      const start = (index) => {
        if (this.isPlaying) {
          const texture = this.textures[
              `${random(confettiColors)}_blur_${random(confettiBlurLevels)}`
          ];
          const scale = randomNumber(this.zRange[0], this.zRange[1]);

          if (this.flake[index]) {
            this.container.removeChild(this.flake[index]);
          }

          this.flake[index] = new PIXI.Sprite(texture);
          this.flake[index].anchor.set(0.5);
          this.flake[index].x = randomNumber(-50, window.innerWidth + 50);
          this.flake[index].y = randomNumber(
              window.innerHeight * -0.4,
              window.innerHeight * -0.7,
          );

          const ratio = this.flake[index].height / this.flake[index].width;

          this.flake[index].width = 64;
          this.flake[index].height = 64 * ratio;
          this.flake[index].scale.x = scale;
          this.flake[index].scale.y = scale;

          this.container.addChild(this.flake[index]);

          this.flakeTweens[index] = TweenLite.to(
              this.flake[index],
              randomNumber(this.speedRange[0], this.speedRange[1]),
              {
                y:
                window.innerHeight +
                window.innerHeight * 0.2 +
                this.flake[index].height,
                rotation: (Math.PI / 180) * randomNumber(-180, 180),
                delay: randomNumber(this.delayRange[0], this.delayRange[1]),
                onComplete: () => start(index),
                ease: Linear.easeNone,
              },
          );
        }
      };

      for (let i = 0; i < this.flakeAmount; i += 1) {
        start(i);
      }
    },
    stopConfetti() {
      this.flakeTweens.forEach((tween, index) => {
        tween.eventCallback('onComplete', () => {
          tween.kill();
          this.container.removeChild(this.flake[index]);
          if (this.container.children.length === 0) {
            this.app.stop();
          }
        });
      });

      this.isPlaying = false;
    },
    handleAllComponentsReady() {
      this.transitionController = new BackgroundConfettiTransitionController(
          this,
      );
      this.isReady();
    },
  },
};
