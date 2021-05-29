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

import {IPipeDestination} from './types';
import PipeSource from './PipeSource';

type TAudioPlayerOptions = {
  audioContext?: AudioContext;
  queueInput?: boolean;
  queueTimeout?: number;
  publishInterval?: number;
};

const DEFAULT_OPTIONS: TAudioPlayerOptions = {
  queueInput: false,
  queueTimeout: 0,
  publishInterval: 100,
};

export default class AudioPlayer extends PipeSource
  implements IPipeDestination {
  private readonly audioContext: AudioContext;
  private readonly analyser: AnalyserNode;
  private readonly options: TAudioPlayerOptions;
  private playing: boolean = false;
  private queue: AudioBuffer[] = [];
  private publishTimer: number;
  private bufferSource: AudioBufferSourceNode;
  private paused: boolean = false;

  constructor(options: TAudioPlayerOptions = {}) {
    super();

    this.options = {...DEFAULT_OPTIONS, ...options};

    this.audioContext = options.audioContext || new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.connect(this.audioContext.destination);
  }

  public receive(data: AudioBuffer): void {
    if (!this.options.queueInput) {
      this.play(data);
      return;
    }

    if (this.playing || this.paused) {
      this.queue.push(data);
      return;
    }

    this.play(data);
  }

  private next(): AudioPlayer {
    if (!this.playing || this.paused) return this;

    if (!this.options.queueInput || !this.queue.length) {
      this.playing = false;
      this.bufferSource = null;
      this.emit('ended');
      return this;
    }

    setTimeout(
      () => this.playAudio(this.queue.shift()),
      this.options.queueTimeout,
    );

    return this;
  }

  public play(data: AudioBuffer): Promise<void> {
    this.playing = true;
    this.emit('started');
    return this.playAudio(data);
  }

  private playAudio(data: AudioBuffer): Promise<void> {
    return new Promise((resolve) => {
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 1;
      gainNode.connect(this.audioContext.destination);

      const source = this.audioContext.createBufferSource();
      source.buffer = data;
      source.connect(gainNode);

      source.connect(this.analyser);
      source.addEventListener('ended', () => {
        this.next();
        resolve();
      });
      source.start();
      this.bufferSource = source;

      this.publishTimeDomainData();
    });
  }

  public stop(): AudioPlayer {
    if (this.bufferSource) this.bufferSource.stop();
    this.playing = false;
    this.bufferSource = null;
    return this;
  }

  public pause(): AudioPlayer {
    this.paused = true;
    return this;
  }

  public resume(): AudioPlayer {
    this.paused = false;
    this.playing = true;
    this.next();
    return this;
  }

  private publishTimeDomainData(): void {
    if (!this.playing) return;

    const timeDomainData = new Float32Array(this.analyser.frequencyBinCount);
    this.analyser.getFloatTimeDomainData(timeDomainData);
    this.publish(timeDomainData);

    // requestAnimationFrame(this.publishFrequencyData.bind(this));
    window.clearTimeout(this.publishTimer);
    this.publishTimer = window.setTimeout(
      this.publishTimeDomainData.bind(this),
      this.options.publishInterval,
    );
  }
}
