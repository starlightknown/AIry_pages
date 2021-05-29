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

import {TGameResult} from '../type/TGameResult';
import DataModel from './DataModel';
import {TLevel} from '../type/TLevel';
import levels from '../levels.json';

const levelModel = new DataModel<TLevel>(levels as Array<TLevel>);

/**
 * This model that adds some decorator functions to the GameResult object,
 * this object is created by the intent saveGameResult in the game scene, and added to the home storage
 */

export class GameResultModel implements TGameResult {
  public playerId: string;
  public level: number;
  public questionsUsed: number;
  public secondsUsed: number;
  public timestamp: number;
  public gameOver?: boolean;

  constructor(gameResult: TGameResult) {
    this.playerId = gameResult.playerId;
    this.level = gameResult.level;
    this.questionsUsed = gameResult.questionsUsed;
    this.secondsUsed = gameResult.secondsUsed;
    this.timestamp = gameResult.timestamp;
    this.gameOver = gameResult.gameOver;
  }

  getLevel(): TLevel {
    return levelModel
      .getArrayOfItems()
      .find(
        (level) =>
          level.ordinal === this.level || (this.level as any) === level.id,
      );
  }

  get questionsLeft() {
    const level = this.getLevel();
    if (!level) return 0;
    return level.maxQuestions - this.questionsUsed;
  }

  isGameOver() {
    if (typeof this.gameOver !== 'undefined') {
      return this.gameOver;
    }

    // little fallback, in case the gameOver property is not present
    return this.questionsLeft < 1;
  }

  get score(): number {
    if (this.isGameOver()) return 0;

    const bonus = this.questionsUsed === 1 ? 10 : 0;
    const score =
      this.questionsLeft * 10 + (10 - this.secondsUsed / 30) + bonus;
    const scoreRounded = Math.round(score);
    // Bounding the score to min 10 and max 99
    return Math.max(10, Math.min(99, scoreRounded));
  }
}
