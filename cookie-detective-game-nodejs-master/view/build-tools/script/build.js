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

// https://github.com/shelljs/shelljs
require('shelljs/global');

const ora = require('ora');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack/webpack.conf.prod');
const fs = require('fs-extra');
const chalk = require('chalk');

const spinner = ora('building for production...');
spinner.start();

//empty build folder because webpack-cleanup-plugin doesn't remove folders
fs.emptyDirSync(webpackConfig.output.path);

webpack(webpackConfig, function(err, stats) {
  spinner.stop();
  if (err) throw err;

  if (stats.hasErrors()) {
    throw stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      reasons: false,
    }) + '\n';
  }

  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      reasons: false,
    }) + '\n',
  );

  console.log();
  console.log(
    chalk.blue('You can preview your build by running:'),
    chalk.blue.bold('yarn preview'),
  );
  console.log(
    chalk.blue('You can analyze your build by running:'),
    chalk.blue.bold('yarn analyze'),
  );
  console.log();
});
