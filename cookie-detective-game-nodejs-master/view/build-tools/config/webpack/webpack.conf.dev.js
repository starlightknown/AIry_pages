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

const detectPort = require('detect-port');
const opn = require('opn');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const localtunnel = require('localtunnel');
// const serveo = require('../../script/serveo');
const config = require('../config');
// const subdomain = require('../../../package.json').name;
// const nodeCleanup = require('node-cleanup');

const { DEVELOPMENT } = config.buildTypes;

module.exports = detectPort(config.devServer.port).then(port => {
  const devWebpackConfig = require('./webpack.conf.base')(DEVELOPMENT);

  process.env.PORT = port;
  devWebpackConfig.devServer.port = port;

  if (config.devServer.autoOpenBrowser) {
    opn(`${config.devServer.useHttps ? 'https' : 'http'}://localhost:${port}`).catch(() => {});
  }

  // localtunnel(port, { subdomain }, (error, tunnel) => {
  //   if (error) return console.error(error);
  //   console.log(`Tunnel open: ${tunnel.url} -> http://localhost:${port}`);
  //   nodeCleanup(() => tunnel.close());
  // });

  // serveo(port, { subdomain }).then(url => {
  //  console.log(`Tunnel open: ${url} -> http://localhost:${port}`);
  // });

  // note: we inject this plugin here because we need access to the port
  devWebpackConfig.plugins.push(
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          `Your application is running here: ${
            config.devServer.useHttps ? 'https' : 'http'
          }://localhost:${port}`,
        ],
      },
    }),
  );

  return devWebpackConfig;
});
