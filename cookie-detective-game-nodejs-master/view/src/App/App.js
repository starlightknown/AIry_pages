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

import Vue from 'vue';
import {DeviceStateEvent} from 'seng-device-state-tracker';
import {
  FlowManager,
  AbstractRegistrableComponent,
} from 'vue-transition-component';
import {mapMutations, mapState} from 'vuex';
import {AppMutations} from '../store/module/app';
import BackgroundConfetti
  from '../component/asset/BackgroundConfetti/BackgroundConfetti';
import SprinklesBackground
  from '../component/SprinklesBackground/SprinklesBackground';
import Loader from '../component/asset/Loader/Loader';
import {version} from '../../package.json';
import scenes from '../data/scenes.json';
import {images, videos} from '../data/assets';
import {lottieAnimations} from '../data/lottieAnimations';
import SplashView from '../component/general/content/SplashView/SplashView';
import AppTransitionController from './AppTransitionController';
import {RouteNames} from '../router/routes';
import {sceneDataMixin} from '../mixins/sceneDataMixin';
import copy from '../data/locale/en-gb.json';

export default {
  name: 'App',
  components: {
    Loader,
    BackgroundConfetti,
    SplashView,
    SprinklesBackground,
  },
  mixins: [sceneDataMixin()],
  extends: AbstractRegistrableComponent,
  data() {
    return {
      topLayerConfettiAmount: Math.round(window.innerWidth / 80),
      applicationLoaded: false,
      applicationLoadProgress: 0,
    };
  },
  computed: {
    ...mapState({
      deviceState: (state) => state.app.deviceState,
      webhookVersion: (state) => state.app.webhookVersion,
      scene: (state) => state.app.scene,
      isMobile: (state) => state.app.isMobile,
    }),
    version() {
      return `${
        this.$platform
      } / ${
        process.env.NODE_ENV
      } / v${
        version
      } / v${
        this.webhookVersion
      }`;
    },
    userAgent() {
      return navigator.userAgent;
    },
    isDev() {
      return process.env.NODE_ENV !== 'production';
    },
  },
  watch: {
    scene(newScene) {
      this.updateScene(newScene);
    },
  },
  mounted() {
    if (this.$isBrowser && this.$route.name !== RouteNames.MAIN) {
      const scene = Object.keys(scenes).find(
          (key) => scenes[key].route === this.$route.name,
      );
      if (scene) {
        this.setSceneInBrowser(scene);
        return;
      }
    }

    this.updateScene(this.scene);
  },
  created() {
    this.$deviceStateTracker.addEventListener(
        DeviceStateEvent.STATE_UPDATE,
        this.handleDeviceStateUpdate,
    );
    this.setDeviceState(this.$deviceStateTracker.currentState);

    // If the user touches the screen, any existing
    // audio playing should be stopped
    this.shutUpBodyListener = () => this.$shutUp();
    // the capture is important here, otherwise this listener
    // will prevent all the tts triggered by other clicks
    document.body.addEventListener('click', this.shutUpBodyListener, {
      capture: true,
    });

    this.loadApplication();
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.shutUpBodyListener, {
      capture: true,
    });
  },
  methods: {
    async updateScene(scene) {
      if (this.checkIsMobile()) return;

      if (!scenes[scene]) return;

      const {route} = scenes[scene];

      if (!route || this.$route.name === route) return;

      return this.$router.push({name: route});
    },

    ...mapMutations({
      setDeviceState: AppMutations.SET_DEVICE_STATE,
    }),

    checkIsMobile() {
      if (this.isMobile) {
        this.$router.push({name: RouteNames.DEVICE_NOT_SUPPORTED});
      }

      return this.isMobile;
    },

    loadApplication() {
      this.preloadAssets = Object.keys(images).map((key) => images[key]);

      this.preloadAssets = this.preloadAssets.concat(
          Object.keys(videos).map((key) => videos[key]),
      );

      this.$levelModel.getArrayOfItems().forEach((level) => {
        this.preloadAssets.push(level.background);
        this.preloadAssets.push(level.previewImage);
      });

      this.preloadAssets = this.preloadAssets.concat(
          lottieAnimations.map((item) => item.file),
      );

      const getPhrases = (node) => {
        let phrases = [];
        Object.keys(node).forEach((key) => {
          const value = node[key];
          if (typeof value === 'string') return phrases.push(value);
          phrases = phrases.concat(getPhrases(node[key]));
        });
        return phrases;
      };

      const phrases = Array.from(
          new Set(
              getPhrases(copy.voice).filter((phrase) => !phrase.match(/<%=/)),
          ).values(),
      );

      const preload = async () => {
        await this.$assets.load(this.preloadAssets, (progress) => {
          this.applicationLoadProgress = Math.round(progress * 50);
        });

        await this.$preloadVoice(phrases, (progress) => {
          this.applicationLoadProgress = 50 + Math.round(progress * 50);
        });

        this.applicationLoadProgress = 100;
      };

      this.assetLoaderPromise = preload();
    },

    onLeave(element, done) {
      FlowManager.transitionOut.then(() => FlowManager.done()).then(done);
    },

    handleDeviceStateUpdate(event) {
      this.setDeviceState(event.data.state);
    },

    handleSprinklesReady(component) {
      Vue.prototype.$sprinkles = component;
    },

    handleLoaderReady(component) {
      Vue.prototype.$loader = component;
    },

    handleTopLayerConfettiReady(component) {
      Vue.prototype.$topLayerConffeti = component;
    },

    handleApplicationLoaded() {
      this.splashView.transitionOut().then(() => {
        this.applicationLoaded = true;
      });
    },

    handleSplashScreenAnimationCompleted() {
      this.splashScreenAnimationResolver();
    },

    async handleAllComponentsReady() {
      this.splashScreenAnimationCompleted = new Promise((resolve) => {
        this.splashScreenAnimationResolver = resolve;
      });

      this.transitionController = new AppTransitionController(this);
      Vue.prototype.$showFloor = this.transitionController.showFloor.bind(
          this.transitionController,
      );

      await this.assetLoaderPromise;
      await this.splashScreenAnimationCompleted;
      this.handleApplicationLoaded();
    },

    handleSplashViewReady(component) {
      this.splashView = component;
      this.splashView.transitionIn();
    },

    handlePageIsReady() {},
  },
};
