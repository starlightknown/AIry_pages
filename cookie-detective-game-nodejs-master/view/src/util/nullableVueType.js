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

import {validateType} from 'vue-types/es/utils';

/**
 * Transforms the given typeChecker from
 * `vue-types` to allow for a `null` value.
 * Note: to make the vue-type required, add the
 * `.isRequired` to the `typeChecker`
 * passed to this util.
 *
 * @example {
 *   options: nullableVueType(VueTypes.arrayOf(VueTypes.string).isRequired),
 *   value: nullableVueType(VueTypes.string),
 * }
 *
 * @param {any} typeChecker The typeChecker from the `vue-types` package
 * @return {any} a typeChecker that allows the `null` value
 */
const nullableVueType = (typeChecker) => ({
  validator: (value) => {
    if (value === null) {
      return true;
    }

    if (typeof value === 'undefined') {
      return !typeChecker.required;
    }

    return validateType(typeChecker, value);
  },
});

export default nullableVueType;
