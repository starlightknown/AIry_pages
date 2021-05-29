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

import {TimelineMax, Power1} from 'gsap';
import {SplitText} from '../vendor/gsap/SplitText';
import eases from '../animation/eases';

export default function staggerWordAnimation(
  parent: HTMLElement,
  duration: number = 1,
  stagger: number = 0.2,
): TimelineMax {
  const timeline = new TimelineMax();

  let words = <Array<HTMLElement>>(
    Array.from(parent.querySelectorAll('.js-word'))
  );

  if (words.length === 0) {
    const splitText = new SplitText(parent, {
      type: 'word',
      wordsClass: 'js-word split-text-word',
    });
    words = <Array<HTMLElement>>Array.from(parent.querySelectorAll('.js-word'));
  }

  timeline.staggerFromTo(
    words,
    duration,
    {scaleY: 0},
    {scaleY: 1, ease: eases.bounceInOutY},
    stagger,
    0,
  );
  timeline.staggerFromTo(
    words,
    duration,
    {scaleX: 0},
    {scaleX: 1, ease: eases.bounceInOutX},
    stagger,
    0,
  );

  return timeline;
}

export function bounceEffect(
  element: HTMLElement,
  duration: number = 1,
): TimelineMax {
  const timeline = new TimelineMax();
  timeline.fromTo(
    element,
    duration,
    {scaleY: 0},
    {scaleY: 1, ease: eases.bounceInOutY},
    0,
  );
  timeline.fromTo(
    element,
    duration,
    {scaleX: 0},
    {scaleX: 1, ease: eases.bounceInOutX},
    0,
  );

  return timeline;
}
