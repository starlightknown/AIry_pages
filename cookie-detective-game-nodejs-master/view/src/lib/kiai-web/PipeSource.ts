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
import EventEmitter from './EventEmitter';

export default class PipeSource extends EventEmitter {
  private destinations: IPipeDestination[] = [];

  public pipe(
    destination: IPipeDestination | ((data: any) => any),
  ): PipeSource {
    // tslint:disable-next-line:no-parameter-reassignment
    if (typeof destination === 'function') destination = new Pipe(destination);

    this.destinations.push(destination);

    return destination as PipeSource & IPipeDestination;
  }

  protected publish(data: any): void {
    this.destinations.forEach((destination) => {
      setTimeout(() => destination.receive(data), 0);
    });
  }
}

class Pipe extends PipeSource implements IPipeDestination {
  private readonly handler: (data: any) => any;

  constructor(handler: (data: any) => any) {
    super();

    this.handler = handler;
  }

  public receive(data: any): void {
    this.publish(this.handler(data));
  }
}
