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

import md5 from 'md5';
import Vocalizer from './kiai-web/Vocalizer';
import AudioPlayer from './kiai-web/AudioPlayer';

const audioContext = new AudioContext();

export default class Voice {
  private audioPlayer: AudioPlayer = new AudioPlayer({audioContext});
  private vocalizer: Vocalizer = null;
  private options: any = {};
  private cache: {[hash: string]: AudioBuffer | Promise<AudioBuffer>} = {};

  constructor(options: {[key: string]: any}) {
    this.options = options;
    this.vocalizer = new Vocalizer({...options, audioContext});
  }

  preload(
    phrases: string[],
    progressCallback: (progress: number) => void = () => null,
  ): Promise<void[]> {
    let loaded = 0;

    const loadPhrase = (phrase) =>
      this.load(phrase)
        .then(() => {
          progressCallback(++loaded / phrases.length);
        })
        .catch((err) => {
          // tslint:disable-next-line:no-console
          console.warn('[VOICE]', `failed to load ${phrase}`, 'error', err);
          progressCallback(++loaded / phrases.length);
        });

    return Promise.all(phrases.map(loadPhrase));
  }

  async say(phrase: string): Promise<void> {
    await this.audioPlayer.stop().play(await this.load(phrase));
  }

  async load(phrase: string): Promise<AudioBuffer> {
    const hash = md5(phrase);
    const cache = this.cache[hash];

    if (cache instanceof AudioBuffer) {
      // tslint:disable-next-line:no-console
      console.debug('[Voice]', `from cache "${phrase}"`);
    }

    if (cache instanceof Promise) {
      // tslint:disable-next-line:no-console
      console.debug('[Voice]', `already loading "${phrase}"`);
    }

    if (!cache) {
      this.cache[hash] = this.vocalizer.synthesize(phrase).then((audio) => {
        this.cache[hash] = audio;
        // tslint:disable-next-line:no-console
        console.debug('[Voice]', `loaded "${phrase}"`);
        return audio;
      });
    }
    return this.cache[hash];
  }

  shutUp(): Voice {
    this.audioPlayer.stop();
    return this;
  }

  release(): Voice {
    // tslint:disable-next-line:no-console
    console.debug('[VOICE] cache released');
    this.cache = {};
    return this;
  }
}
