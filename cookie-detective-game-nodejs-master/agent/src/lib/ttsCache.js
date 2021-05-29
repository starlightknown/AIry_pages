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

const md5 = require('md5');
const storage = require('./storage');
const tts = require('./tts');

const TTS_DIR = 'tts';

/**
 * Handles voice synthesis requests and returns a cached result or forwards the
 * call to the Google TTS service and caches and returns the result
 * @param {XMLHttpRequest} req The request object
 * @return {Promise<{audioContent: string}>} The base64-encoded audio
 */
module.exports = async (req) => {
  let {body} = req;
  if (typeof body === 'string') body = JSON.parse(req.body);
  const {input, voice, audioConfig} = body;
  const hash = md5(
      [
        voice.languageCode,
        voice.name || '',
        audioConfig.audioEncoding,
        audioConfig.speakingRate || 1,
        audioConfig.pitch || 1,
        audioConfig.volumeGainDb || 0,
        (audioConfig.effectsProfileId || []).join(','),
        input.ssml,
      ].join('/'),
  );
  const fileName = `${TTS_DIR}/${hash}.wav`;

  let audioContent = await storage.get(fileName).catch(() => null);

  if (!audioContent) {
    audioContent = await tts.synthesize({input, voice, audioConfig});

    storage.store(fileName, audioContent);
  }

  audioContent = audioContent.toString('base64');

  return {
    audioContent,
  };
};
