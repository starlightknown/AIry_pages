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

import EventDispatcher from 'seng-event';
import IIndexable from '../interface/IIndexable';

export default class DataModel<T extends IIndexable> extends EventDispatcher {
  protected options: any = {};
  protected total: number = 0;
  protected items!: {[key: string]: T};
  protected arrayOfItems!: Array<T>;

  constructor(items?: Array<T>, options?: any) {
    super();

    this.options = Object.assign(this.options, options);

    if (items) {
      this.storeItems(items);
    }
  }

  /**
   * @public
   * @method getItems
   */
  public getItems(): {[key: string]: T} {
    return this.items;
  }

  /**
   * @public
   * @method getArrayOfItems
   */
  public getArrayOfItems(): Array<T> {
    return this.arrayOfItems;
  }

  /**
   * @description: store all items
   * @public
   * @method storeItems
   * @param {Array<T>} items
   */
  public storeItems(items: Array<T>): void {
    this.arrayOfItems = items;
    this.items = {};
    this.total = items.length;

    // Store once as object for faster look-up.
    items.forEach((item: T) => {
      this.items[item.id] = item;
    });
  }

  /**
   * @public
   * @method getItemById
   * @param {string} id
   * @returns {T}
   */
  public getItemById(id: any): T {
    const item = this.items[id];
    if (!item) {
      // console.warn(`following id does not exist [${id}]`);
    }

    return item;
  }

  /**
   * @public
   * @method getItemByIds
   * @param {string} ids
   * @returns {Array<T>}
   */
  public getItemsByIds(ids: Array<any>): Array<T> {
    return ids.map((id) => this.getItemById(id));
  }

  /**
   * @public
   * @method dispose
   */
  public dispose(): void {}
}
