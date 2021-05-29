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

module.exports = function(api) {
  api.cache(!api.env('production'));

  return {
    sourceType: 'unambiguous',
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'entry',
          exclude: ['transform-typeof-symbol'],
        },
      ],
    ],
    plugins: [
      'lodash',
      '@babel/plugin-transform-runtime',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-syntax-import-meta',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-json-strings',
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true,
        },
      ],
      '@babel/plugin-proposal-function-sent',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-numeric-separator',
      '@babel/plugin-proposal-throw-expressions',
    ],
    comments: true,
  };
};
