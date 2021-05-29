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

const {Storage} = require('@google-cloud/storage');
const config = require('../../config/storage.json');

const projectId = config.project_id;
const storage = new Storage({
  projectId,
  credentials: config,
});
const UPLOAD_OPTIONS = {gzip: true};

/**
 * Facilitates read and write operations to a Google Cloud Storage bucket
 */
module.exports = {
  /**
   * Write data to a file in the bucket
   * @param {string} name The name of the file
   * @param {string} data The data to write
   * @return {Promise<void|Error>}
   */
  store(name, data) {
    return new Promise((resolve, reject) => {
      storage
          .bucket(projectId)
          .file(name)
          .createWriteStream(UPLOAD_OPTIONS)
          .on('error', reject)
          .on('finish', resolve)
          .end(Buffer.from(data));
    });
  },

  /**
   * Read data from a file in the bucket
   * @param {string} name The name of the file
   * @return {Promise<Buffer>}
   */
  get(name) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      storage
          .bucket(projectId)
          .file(name)
          .createReadStream()
          .on('data', (chunk) => chunks.push(chunk))
          .on('error', reject)
          .on('end', () => resolve(Buffer.concat(chunks)));
    });
  },
};
