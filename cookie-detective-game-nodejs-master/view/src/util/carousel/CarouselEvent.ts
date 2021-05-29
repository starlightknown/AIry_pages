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

import {AbstractEvent} from 'seng-event';
import {
  EVENT_TYPE_PLACEHOLDER,
  generateEventTypes,
} from 'seng-event/lib/util/eventTypeUtils';

export interface CarouselEventData {
  index?: number;
  progress?: number;
}

class CarouselEvent extends AbstractEvent {
  public static CHANGE: string = EVENT_TYPE_PLACEHOLDER;
  public static ITEM_IN_VIEW: string = EVENT_TYPE_PLACEHOLDER;
  public static ITEM_IN_VIEW_PROGRESS: string = EVENT_TYPE_PLACEHOLDER;
  public static ITEM_OUT_VIEW: string = EVENT_TYPE_PLACEHOLDER;

  public data: CarouselEventData;

  constructor(
    type: string,
    data: CarouselEventData,
    bubbles?: boolean,
    cancelable?: boolean,
    setTimeStamp?: boolean,
  ) {
    super(type, bubbles, cancelable, setTimeStamp);
    this.data = data;
  }

  /**
   * The clone method returns a cloned instance of the original event.
   *
   * @public
   */
  public clone(): CarouselEvent {
    return new CarouselEvent(
      this.type,
      this.data,
      this.bubbles,
      this.cancelable,
    );
  }
}

generateEventTypes({CarouselEvent});

export default CarouselEvent;
