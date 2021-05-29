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

module.exports = ({ config }) => webpackConfig => ({
  ...webpackConfig,
  devServer: {
    clientLogLevel: 'info',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: process.env.HOST || '0.0.0.0',
    port: config.devServer.port,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    disableHostCheck: true,
    open: false,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: config.devServer.proxyTable,
    quiet: true,
    https: config.devServer.useHttps,
  },
});
