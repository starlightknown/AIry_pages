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

const OPEN_MIC = 'OPEN_MIC';

let _dispatcher = () => {};
let openMicCallback;

/**
 * This function will return the global instance of the canvas API
 * @private
 * @return {*}: CanvasAPI
 */
function getCanvasGlobal() {
  return window.interactiveCanvas || window.assistantCanvas;
}

/**
 * Internal function, triggered by the canvas api every time
 * the g action receives a new payload from the webhook
 * @private
 * @param {any} state: state payload
 */
function handleStateChange(state) {
  const {input, noMatch, error} = state;

  if (error) console.error(`Webhook error: ${error}`);

  _dispatcher(state);

  if (openMicCallback && (input || noMatch)) openMicCallback(input, noMatch);
}

/**
 * Trigger the handleStateChange for every state payload
 * @private
 * @param {any} states
 */
function onUpdate(states) {
  states.forEach(handleStateChange);
}

/**
 * Init the canvas API by attaching the listeners triggered
 * every time the state changes
 * @private
 */
function init() {
  const canvas = getCanvasGlobal();

  if (!canvas) throw new Error('interactiveCanvas global not found');

  canvas.ready({onUpdate});
}

/**
 * Public interface for the canvas api
 * It's just an abstraction layer that simplify the use around the game
 */
export default {
  setup(dispatcher) {
    if (typeof dispatcher !== 'function') {
      throw new Error(
          'Please provide a dispatcher function for handling state updates',
      );
    }

    _dispatcher = dispatcher;

    if (getCanvasGlobal()) return init();

    window.addEventListener('load', init);
  },

  openMic(callback) {
    openMicCallback = callback;

    this.sendText(OPEN_MIC);
  },

  sendText(text) {
    const canvas = getCanvasGlobal();

    if (!canvas) throw new Error('interactiveCanvas global not found');

    return new Promise((resolve, reject) =>
      canvas
          .sendTextQuery(text)
          .then((response) => {
          // the response can be: 'SUCCESS', 'BLOCKED' or 'UNKNOWN'

            if (response === 'SUCCESS') return resolve(response);

            return reject(response);
          })
          .catch((response) => reject(response)),
    );
  },
};
