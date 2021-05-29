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

const path = require('path');

module.exports = ({ config }) => webpackConfig => ({
  ...webpackConfig,
  resolve: {
    extensions: ['.vue', '.js', '.ts', '.scss'],
    alias: {
      modernizr$: path.join(config.projectRoot, '.modernizrrc'),
      TweenLite: path.resolve(config.projectRoot, 'node_modules/gsap/src/uncompressed/TweenLite'),
      asset: path.resolve(config.projectRoot, 'src/asset'),
    },
  },
});
