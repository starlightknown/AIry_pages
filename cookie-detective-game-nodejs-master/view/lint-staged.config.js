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

const config = require('./build-tools/config/config');

const defaultSettings = ['git add'];

const jsLintCommand = 'eslint --ext .js,.vue --cache';
const tsLintCommand = 'tslint -p tsconfig.json';
const scssLintCommand = 'stylelint --cache';

const jsSettings = config.lintStaged.eslintEnabled
  ? [...defaultSettings, jsLintCommand]
  : [...defaultSettings];

const vueSettings = config.lintStaged.eslintEnabled ? [jsLintCommand] : [];

const tsSettings = config.lintStaged.tslintEnabled
  ? [...defaultSettings, tsLintCommand]
  : [...defaultSettings];

const scssSettings = config.lintStaged.stylelintEnabled
  ? [...defaultSettings, scssLintCommand]
  : [...defaultSettings];

module.exports = {
  'src/**/*.js': jsSettings,
  'src/**/*.vue': vueSettings,
  'src/**/*.ts': tsSettings,
  'src/**/*.scss': scssSettings,
};
