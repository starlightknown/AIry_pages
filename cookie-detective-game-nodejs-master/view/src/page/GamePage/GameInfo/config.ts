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

import translate from '../../../lib/translate';

export enum GameInfoId {
  CHOICE = 'choice',
  AMOUNT_OF_QUESTIONS = 'amountOfQuestions',
  TIME = 'time',
}

export const getGameInfoItems = (data: {maxQuestions: number}) => {
  return [
    {
      id: GameInfoId.CHOICE,
      description: translate(`gameInfo.${[GameInfoId.CHOICE]}.description`),
    },
    {
      id: GameInfoId.AMOUNT_OF_QUESTIONS,
      description: translate(
        `gameInfo.${[GameInfoId.AMOUNT_OF_QUESTIONS]}.description`,
      ).replace('{maxQuestions}', data.maxQuestions),
    },
    {
      id: GameInfoId.TIME,
      description: translate(`gameInfo.${[GameInfoId.TIME]}.description`),
    },
  ];
};
