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
import axios from 'axios';
import {sample, template} from 'lodash';
import DeviceStateTracker from 'seng-device-state-tracker';
import {DisposableManager} from 'seng-disposable-manager';
import VueExposePlugin from '../util/VueExposePlugin';
import {URLNames, PropertyNames, VariableNames} from '../data/enum/configNames';
import {RouteNames} from '../router/routes';
import {createPath} from '../util/routeUtils';
import Params from '../data/enum/Params';
import {getValue} from '../util/injector';
import {
  CONFIG_MANAGER,
  GATEWAY,
  LOTTIE_ANIMATION_MODEL,
} from '../data/Injectables';
import {mediaQueries, deviceState} from '../data/mediaQueries.json';
import waitForStyleSheetsLoaded from '../util/waitForStyleSheetsLoaded';
import assetManager from '../lib/assetManager';
import ButtonType from '../component/button/data/enum/ButtonType';
import LinkType from '../component/button/data/enum/LinkType';
import Size from '../data/enum/Size';
import DisposableType from '../data/enum/type/DisposableType';
import translate from '../lib/translate';
import canvas from '../lib/canvas';
import getPlatform, {PLATFORMS} from '../util/getPlatform';
import DataModel from '../data/model/DataModel';
import Levels from '../data/levels.json';
import HidingSpots from '../data/hidingSpots.json';
import Attributes from '../data/attributes.json';
import {TLevel} from '../data/type/TLevel';
import {TAttribute} from '../data/type/TAttribute';
import {THidingSpot} from '../data/type/THidingSpot';
import Animals from '../data/animals.json';
import Colors from '../data/colors.json';
import {TAnimal} from '../data/type/TAnimal';
import {TColor} from '../data/type/TColor';
import Voice from '../lib/Voice';

const initPlugins = () => {
  const configManager = getValue(CONFIG_MANAGER);

  const cleanMediaQueries = Object.keys(mediaQueries).reduce((result, key) => {
    result[key] = mediaQueries[key].replace(/'/g, '');
    return result;
  }, {});

  const cookie = new Voice({
    language: 'en-US',
    voice: 'en-US-Wavenet-D',
    speakingRate: 1.15,
    pitch: 8,
    apiKey: configManager.getVariable(VariableNames.TTS_API_KEY)[
      process.env.NODE_ENV
    ],
    baseUrl: configManager.getVariable(VariableNames.TTS_URL)[
      process.env.NODE_ENV
    ],
  });

  const wrapIntoSSMLSpeakTag = (text) => `<speak>${text}</speak>`;

  // expose objects to the Vue prototype for easy access in your vue templates and components
  Vue.use(VueExposePlugin, {
    URLNames,
    PropertyNames,
    VariableNames,
    RouteNames,
    Params,
    ButtonType,
    LinkType,
    Size,
    createPath,
    $config: configManager,
    $gateway: getValue(GATEWAY),
    $http: axios,
    $versionRoot: configManager.getVariable(
      VariableNames.VERSIONED_STATIC_ROOT,
    ),
    $staticRoot: configManager.getVariable(VariableNames.STATIC_ROOT),
    $lottieAnimationModel: getValue(LOTTIE_ANIMATION_MODEL),
    $levelModel: new DataModel<TLevel>(Levels as Array<TLevel>), // if the Type contains enums, you need to cast the values coming from the json
    $hidingSpotModel: new DataModel<THidingSpot>(
      HidingSpots as Array<THidingSpot>,
    ),
    $attributeModel: new DataModel<TAttribute>(Attributes as Array<TAttribute>),
    $animalModel: new DataModel<TAnimal>(Animals),
    $colorModel: new DataModel<TColor>(Colors),
    $t: translate,
    $tFormatted: (key, templateOptions = {}) => {
      const value = translate(key);
      // Get a rand value if the key points to an array
      const randValue = value instanceof Array ? sample(value) : value;
      return template(randValue)(templateOptions);
    },
    $preloadVoice: (phrases, callback) =>
      cookie.preload(phrases.map(wrapIntoSSMLSpeakTag), callback),
    $releaseVoices: () => cookie.release(),
    $shutUp: () => cookie.shutUp(),
    $say: (text) => cookie.say(wrapIntoSSMLSpeakTag(text)),
    $listen: (callback) => canvas.openMic(callback),
    $send: (text) => canvas.sendText(text),
    $platform: getPlatform(),
    $isBrowser: getPlatform() === PLATFORMS.BROWSER,
    $deviceStateTracker: new DeviceStateTracker({
      deviceState,
      mediaQueries: cleanMediaQueries,
      showStateIndicator: false, // process.env.NODE_ENV !== 'production',
    }),
    DeviceState: deviceState,
  });

  // set up assetManager
  Vue.use(assetManager, {
    root: configManager.getVariable(VariableNames.VERSIONED_STATIC_ROOT),
  });
};

export default async function startUp() {
  // Initialise plugins
  initPlugins();

  DisposableManager.register(DisposableType.TIMEOUT, clearTimeout);

  if (process.env.NODE_ENV === 'production') return;

  await waitForStyleSheetsLoaded(document);
}
