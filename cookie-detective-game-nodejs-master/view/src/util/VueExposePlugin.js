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

export default {
  install(Vue, options) {
    Object.keys(options).forEach((key) => {
      if (Vue.prototype[key]) {
        // eslint-disable-next-line no-console
        console.error(
            `Skipping ${key}. ${key} already exists on the Vue prototype`,
        );
      } else {
        Object.defineProperty(Vue.prototype, key, {
          get() {
            return options[key];
          },
        });
      }
    });
  },
};
