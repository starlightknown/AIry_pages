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

const uniqid = require('uniqid');

/**
 * Intent handlers for the "animalSelection" scene
 */
module.exports = {
  chooseAnimal(conv, params) {
    return `${params.animal}`;
  },

  // sendTextQuery('createplayer $color $animal');
  createPlayer(conv, params) {
    const homeData = conv.home.params;
    const player = {
      id: uniqid(),
      color: params.color,
      animal: params.animal,
      lastPlayed: Date.now(),
    };

    homeData.players = conv.home.params.players || [];
    homeData.players.push(player);

    conv.session.params.currentPlayer = player;
    conv.session.params.isNewPlayer = true;
  },
};
