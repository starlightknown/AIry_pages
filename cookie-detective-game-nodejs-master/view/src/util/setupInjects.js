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

import ConfigManager from 'seng-config';
import * as axios from 'axios';
import {
  CONFIG_MANAGER,
  GATEWAY,
  LOTTIE_ANIMATION_MODEL,
} from '../data/Injectables';
import config from '../config/config';
import {URLNames} from '../data/enum/configNames';

import {setValue} from './injector';
import {responseFormatter, errorFormatter} from './gatewayFormatter';
import LottieAnimationModel from '../data/model/LottieAnimationModel';
import {lottieAnimations} from '../data/lottieAnimations';

const setupInjects = () => {
  const configManager = new ConfigManager();
  configManager.init(config.config, config.environment);

  const gateway = axios.create({
    baseURL: configManager.getURL(URLNames.API),
    headers: {
      Accept: 'application/json',
    },
    responseType: 'json',
  });

  gateway.interceptors.response.use(
      (response) => responseFormatter(response),
      (error) => {
        throw errorFormatter(error);
      },
  );

  setValue(CONFIG_MANAGER, configManager);
  setValue(GATEWAY, gateway);
  setValue(LOTTIE_ANIMATION_MODEL, new LottieAnimationModel(lottieAnimations));
};

export default setupInjects;
