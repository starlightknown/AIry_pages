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

import createSessionStore from './sessionStore';
import {isBrowser} from '../../util/getPlatform';

const Session = createSessionStore({
  localStorageEnabled: isBrowser(),
});

export const gameSessionMixin = {
  computed: {
    levels() {
      return this.$levelModel.getArrayOfItems();
    },

    currentLevel() {
      const ordinalOrId = Session.currentLevel;

      const level = this.levels.find(
          (lvl) => lvl.ordinal === ordinalOrId || lvl.id === ordinalOrId,
      );

      if (!level) {
        console.warn(`No level found with sessionData.level: ${ordinalOrId}`);
      }

      return level;
    },
  },

  methods: {
    selectLevel({ordinal}) {
      Session.currentLevel = ordinal;
    },
  },
};
