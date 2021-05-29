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

/**
 * Creates a webserver listening on the specified port
 * @param {number} port The port number
 * @param {function(req: Object, res: Object): void} listener The handler for
 * incoming requests
 * @param {Object} ssl The SSL configuration object
 */
module.exports = ({port = 80, ssl}, listener) => {
  const protocol = ssl ? 'https' : 'http';
  const server = require(protocol).createServer(ssl || {}, listener);

  // eslint-disable-next-line no-console
  server.listen(port, () => console.log(`Server listening on ${protocol}://localhost:${port}`));
};
