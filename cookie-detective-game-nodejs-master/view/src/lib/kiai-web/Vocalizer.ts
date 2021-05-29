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

import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {merge} from 'lodash';
import md5 from 'md5';
import {IPipeDestination} from './types';
import PipeSource from './PipeSource';

type TVocalizerOptions = {
  language?: string;
  voice?: string;
  speakingRate?: number;
  pitch?: number;
  volumeGainDb?: number;
  apiKey?: string;
  audioContext?: AudioContext;
  preserveOrder?: boolean;
  baseUrl?: string;
};

type TTtsResponse = {
  audioContent: string;
};

type TRequestQueue = {
  hash: string;
  promise: Promise<void>;
  audioBuffer?: AudioBuffer;
}[];

const REQUEST_CONFIG: AxiosRequestConfig = {
  method: 'post',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  responseType: 'json',
};

const DEFAULT_OPTIONS: TVocalizerOptions = {
  language: 'en-US',
  voice: 'en-US-Wavenet-D',
  preserveOrder: false,
  baseUrl: 'https://texttospeech.googleapis.com/v1/text:synthesize',
};

export default class Vocalizer extends PipeSource implements IPipeDestination {
  private readonly axiosInstance: AxiosInstance;
  private readonly options: TVocalizerOptions;
  private readonly audioContext: AudioContext;
  private requests: TRequestQueue = [];

  constructor(options: TVocalizerOptions = {}) {
    super();

    this.options = {...DEFAULT_OPTIONS, ...options};

    const {apiKey, baseUrl} = this.options;

    if (!apiKey && !baseUrl) {
      throw new Error('Vocalizer: Missing API key for Google Text-to-speech');
    }

    this.audioContext = this.options.audioContext || new AudioContext();

    this.axiosInstance = axios.create(
      merge({baseURL: baseUrl, params: {key: apiKey}}, REQUEST_CONFIG),
    );
  }

  public receive(text: string): void {
    const hash = md5(text);
    const promise = this.synthesize(text)
      .then((audioBuffer) => {
        if (!this.options.preserveOrder) {
          this.publish(audioBuffer);
          return;
        }

        const request = this.requests.find((r) => r.hash === hash);
        if (!request) {
          throw new Error('Vocalizer: No matching request found for response');
        }
        request.audioBuffer = audioBuffer;
        this.processRequestQueue();
      })
      .catch((error) => this.emit('error', error));

    this.requests.push({hash, promise});
  }

  public synthesize(text: string): Promise<AudioBuffer> {
    const input = {ssml: text};
    const voice = {
      languageCode: this.options.language,
      name: this.options.voice,
    };
    const audioConfig = {
      audioEncoding: 'LINEAR16',
      speakingRate: this.options.speakingRate,
      pitch: this.options.pitch,
      volumeGainDb: this.options.volumeGainDb,
      effectsProfileId: ['large-home-entertainment-class-device'],
    };

    return this.axiosInstance
      .post('', {input, voice, audioConfig})
      .then((response) => this.processResponse(response.data));
  }

  private processRequestQueue() {
    setImmediate(() => {
      if (!this.requests.length) return;
      if (!this.requests[0].audioBuffer) return;
      this.publish(this.requests.shift()!.audioBuffer);
      this.processRequestQueue();
    });
  }

  private processResponse(data: TTtsResponse): Promise<AudioBuffer> {
    const arrayBuffer = Uint8Array.from(atob(data.audioContent), (c) =>
      c.charCodeAt(0),
    ).buffer;
    return this.audioContext.decodeAudioData(arrayBuffer);
  }
}
