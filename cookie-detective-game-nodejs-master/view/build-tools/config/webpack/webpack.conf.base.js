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

const helpers = require('./webpack.helpers');
const config = require('../config');

const { DEVELOPMENT, PRODUCTION } = config.buildTypes;

// note: we pass a default buildType here so this file can be loaded directly from .eslintrc.js
module.exports = (buildType = DEVELOPMENT) => {
  const generator = helpers.compose(
    [
      require('./webpack.partial.conf.devServer'),
      require('./webpack.partial.conf.entry'),
      require('./webpack.partial.conf.module'),
      require('./webpack.partial.conf.node'),
      require('./webpack.partial.conf.optimization'),
      require('./webpack.partial.conf.output'),
      require('./webpack.partial.conf.plugins'),
      require('./webpack.partial.conf.resolve'),
    ].map(module => module({
      isDevelopment: buildType === DEVELOPMENT,
      buildType,
      config,
    }))
  );

  return generator({
    // single configuration properties go here
    // object go into a separate file (e.g. webpack.partial.conf.entry.js)
    mode: buildType === PRODUCTION ? 'production' : 'development',
    devtool: buildType === DEVELOPMENT ? 'cheap-module-eval-source-map' : false,
  });
};
