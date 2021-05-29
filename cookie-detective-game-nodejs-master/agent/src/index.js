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

const {conversation, Canvas, Simple} = require('@assistant/conversation');
const functions = require('firebase-functions');
const restApi = require('./lib/restApi');
const server = require('./lib/server');
const PACKAGE = require('../package.json');
const config = require('./lib/config')(require('../config/config.json'));
const handleIntent = require('./lib/handleIntent');
const tts = require('./lib/ttsCache');

const VIEW_URL = config('viewUrl');
const WEBHOOK_VERSION = PACKAGE.version;
const HANDLER_NAMES = {
  INTENT: 'intent',
  SCENE: 'scene',
  OPEN_MIC: 'openMic',
  NO_MATCH: 'noMatch',
  NO_INPUT: 'noInput',
  EXIT: 'exit',
};
const MAJOR_VERSION = WEBHOOK_VERSION.split('.')[0];
const LOCAL = process.env.NODE_ENV === 'development';
const EMPTY_SSML = '<speak><break time="0ms"/></speak>';

const webhook = conversation();

Object.keys(HANDLER_NAMES).forEach((key) => {
  const handlerName = HANDLER_NAMES[key];

  webhook.handle(handlerName, (conv) => {
    let input; let noMatch;
    const errors = [];

    if (conv.user.params.webhookVersion !== WEBHOOK_VERSION) {
      conv.user.params.webhookVersion = WEBHOOK_VERSION;
    }

    if (conv.home.params.webhookVersion !== WEBHOOK_VERSION) {
      conv.home.params.webhookVersion = WEBHOOK_VERSION;
    }

    conv.scene.next = conv.scene.next || {};

    if (handlerName === HANDLER_NAMES.EXIT) {
      const exitMessageUrl = 'https://storage.googleapis.com/cookie-detective/tts/9eb5dff6d9d4b3cb79ee5e0b20cf643d.wav';
      return conv.add(new Simple({
        speech: `<speak><audio src="${exitMessageUrl}"></audio></speak>`,
        text: 'See you next time!',
      }));
    }

    try {
      if (handlerName === HANDLER_NAMES.INTENT) input = handleIntent(conv);
    } catch (err) {
      errors.push(err.toString());
    }

    try {
      if ([
        HANDLER_NAMES.OPEN_MIC,
        HANDLER_NAMES.NO_INPUT,
      ].includes(handlerName)) {
        conv.add(EMPTY_SSML);
      }
    } catch (err) {
      errors.push(err.toString());
    }

    if (handlerName === HANDLER_NAMES.NO_MATCH) {
      noMatch = conv.intent.name.match(/^actions\.intent\.(\w+)$/)[1];
    }

    const isMobile = (conv.device.capabilities.includes('WEB_LINK'));

    conv.add(
        new Canvas({
          url: VIEW_URL,
          data: {
            session: conv.session,
            user: conv.user,
            home: conv.home,
            scene: conv.scene.name,
            input,
            noMatch,
            error: errors.join('\n\n'),
            isMobile,
          },
        })
    );
  });
});

const expressApp = restApi({routes: {post: {webhook, tts}}});

if (LOCAL) server({port: process.env.PORT}, expressApp);

module.exports = {
  [`v${MAJOR_VERSION}`]: functions.https.onRequest(expressApp),
};
