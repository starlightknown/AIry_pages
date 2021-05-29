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
 * Intent handlers for the "samePlayerConfirmation" scene
 */
module.exports = {
  confirmSamePlayer(conv) {
    const {players = []} = conv.home.params;
    const recentPlayer = [...players]
        .sort((a, b) => b.lastPlayed - a.lastPlayed)[0];

    conv.session.params.currentPlayer = recentPlayer;
    recentPlayer.lastPlayed = Date.now();

    conv.scene.next.name = 'levelSelection';
  },

  notSamePlayer(conv) {
    const {players = []} = conv.home.params;

    if (players.length < 2) {
      conv.scene.next.name = 'tutorial';
      return;
    }
    conv.scene.next.name = 'playerSelection';
  },
};
