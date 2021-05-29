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

const values = {};

export const setValue = (key, value) => {
  values[key] = value;
};

export const getValue = (key) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!(key in values)) {
      throw new ReferenceError(
          `[Injector] Injectable "${key}" has never been configured`,
      );
    }
  }

  return values[key];
};
