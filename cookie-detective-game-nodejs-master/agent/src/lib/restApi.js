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

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const boom = require('express-boom');

/**
 * Creates an Express server based on the provided routes
 * @param {Object} routes An object mapping paths to handlers
 * @param {string} root The root path, defaults to '/'
 * @return {Express} The created Express instance
 */
module.exports = ({routes, root = '/'}) => {
  // eslint-disable-next-line new-cap
  const router = express.Router();

  router.use(bodyParser.json());
  router.use(cors());
  router.use(boom());

  Object.keys(routes).forEach((method) =>
    Object.keys(routes[method]).forEach((endpoint) =>
      router[method](`/${endpoint}`, async (req, res) => {
        try {
          const handler = routes[method][endpoint];
          const response = await handler(req, res);
          if (response) res.send(response);
        } catch (error) {
          console.error(error);
          res.boom.internal(error.toString());
        }
      })
    )
  );

  router.use('*', (req, res) => res.boom.notFound());

  const expressApp = express();
  expressApp.use(root, router);

  return expressApp;
};
