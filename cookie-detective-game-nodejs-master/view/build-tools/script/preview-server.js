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

const config = require('../config/config');
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.env.development.NODE_ENV);
const path = require('path');
const express = require('express');
const opn = require('opn');
const https = require('https');
const http = require('http');
const compression = require('compression');
const webpackConfig = require('../config/webpack/webpack.conf.prod');
const pem = require('pem');


// default port where dev server listens for incoming traffic
const port = 4040;

const server = express();
const root = path.join(__dirname, '../../dist');

// handle fallback for HTML5 history API
server.use(require('connect-history-api-fallback')());
server.use(compression());

server.use(webpackConfig.output.publicPath, express.static(root));
server.use('/static', express.static(path.join(root, './static')));

server.get('*', function(req, res) {
  res.sendFile(path.join(root, './index.html'));
});

const uri = (config.devServer.useHttps ? 'https' : 'http') + '://localhost:' + port;

console.log('> Listening at ' + uri + '\n');

const onServerRunning = function(err) {
  if (err) {
    console.log(err);
    return;
  }

  opn(uri);
};

if (config.devServer.useHttps) {
  pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
    if (err) {
      throw err
    }
    https.createServer({ key: keys.serviceKey, cert: keys.certificate }, server).listen(port, onServerRunning);
  });
} else {
  http.createServer(server).listen(port, onServerRunning);
}
