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

import {ILoadTaskOptions, AbstractLoadTask} from 'task-loader';

export default class LoadSoundMethodTask extends AbstractLoadTask<any> {
  protected options!: ILoadSoundMethodTaskOptions;

  constructor(options: any) {
    // Set the batch to 1 and the cache to false
    super(Object.assign(options, {batchSize: 1, cached: false}));
  }

  /**
   * @public
   * @method loadAsset
   * @param {string} src
   * @returns {Promise<any>}
   */
  public loadAsset(src: string): Promise<void> {
    //  has it's own asset loader and manages the loading mechanism internally
    return Promise.resolve();
  }

  /**
   * @public
   * @method load
   * @param {(progress: number) => void} update
   * @returns {Promise<void>}
   */
  public load(update: (progress: number) => void): Promise<void> {
    return this.options.loadMethod((progress: number) => {
      update(progress);
    });
  }

  /**
   * @public
   * @method dispose
   */
  public dispose(): void {
    super.dispose();
  }
}

export interface ILoadSoundMethodTaskOptions extends ILoadTaskOptions<any> {
  // params: { [key: string]: any };
  loadMethod: Function;
}
