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

export type TIntentParameter = {
  name: string;
  entity: string;
  mandatory: boolean;
};

export type TIntent = {
  events: string[];
  isFallback: boolean;
  phrases: {
    [language: string]: string[];
  };
  parameters: TIntentParameter[];
  contexts: string[];
  priority: string;
};

export type TIntents = {[name: string]: TIntent};

export interface IPipeDestination {
  receive: (data: any) => void;
}

export type TPrimitive = string | number | boolean | null;

export type TKeyValue = {
  [key: string]: TPrimitive | TPrimitive[] | TKeyValue | TKeyValue[];
};
