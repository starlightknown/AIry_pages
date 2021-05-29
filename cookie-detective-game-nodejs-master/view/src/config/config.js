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

import {
  EnvironmentNames,
  PropertyNames,
  URLNames,
  VariableNames,
} from '../data/enum/configNames';

const config = {
  environments: {
    [EnvironmentNames.PRODUCTION]: {
      variables: {},
      urls: {},
    },
    [EnvironmentNames.STAGING]: {
      extends: EnvironmentNames.PRODUCTION,
      variables: {},
      urls: {},
    },
    [EnvironmentNames.DEVELOPMENT]: {
      extends: EnvironmentNames.STAGING,
      variables: {},
      urls: {},
    },
    [EnvironmentNames.LOCAL]: {
      extends: EnvironmentNames.DEVELOPMENT,
      variables: {},
      urls: {},
    },
  },
  variables: {
    [VariableNames.LOCALE_ENABLED]: false,
    [VariableNames.LOCALE_ROUTING_ENABLED]: false,
    [VariableNames.VERSIONED_STATIC_ROOT]:
      (window.webpackPublicPath || process.env.PUBLIC_PATH) +
      process.env.VERSIONED_STATIC_ROOT,
    [VariableNames.STATIC_ROOT]:
      (window.webpackPublicPath || process.env.PUBLIC_PATH) +
      process.env.STATIC_ROOT,
    [VariableNames.PUBLIC_PATH]:
      window.webpackPublicPath || process.env.PUBLIC_PATH,
    [VariableNames.TTS_API_KEY]: {
      production: '',
      development: '',
    },
    [VariableNames.TTS_URL]: {
      production: '',
      development: 'https://texttospeech.googleapis.com/v1/text:synthesize',
    },
  },
  urls: {
    [URLNames.API]: `${process.env.PUBLIC_PATH}api/`,
  },
  properties: {
    [PropertyNames.PERSIST_QUERY_PARAMS]: [],
  },
};

let environment = EnvironmentNames.PRODUCTION;
const {host} = document.location;

switch (host.split(':').shift()) {
  case 'localhost': {
    environment = EnvironmentNames.LOCAL;
    break;
  }
  default: {
    environment = EnvironmentNames.PRODUCTION;
    break;
  }
}

export default {
  config,
  environment,
};
