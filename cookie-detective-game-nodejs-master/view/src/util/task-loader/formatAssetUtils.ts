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

import IImageSequence from '../image-sequence/data/interface/IImageSequence';

export const formatImageSequences = (
  sequences: Array<IImageSequence>,
  versionRoot: string,
) => {
  const imageSequenceAssets: Array<string> = [];
  sequences.forEach((sequence: any) => {
    sequence.source = sequence.source.replace('{$versionRoot}', versionRoot);

    for (let i = sequence.startCount; i <= sequence.frameCount; i += 1) {
      imageSequenceAssets.push(
        `${sequence.source.replace(
          '{frame}',
          i.toString().padStart(sequence.padCount, '0'),
        )}`,
      );
    }
  });

  return imageSequenceAssets;
};

export const formatImages = (
  images: Array<{source: string}>,
  versionRoot: string,
  locale?: string,
) => {
  return images.map((item) => formatImage(item.source, versionRoot, locale));
};

export const formatImage = (
  image: string,
  versionRoot: string,
  locale?: string,
) => {
  const asset = image.replace('{$versionRoot}', versionRoot);
  return asset.replace('{locale}', <string>locale);
};

export const formatObjectImages = (
  images: {[key: string]: string},
  versionRoot: string,
) => {
  return Object.keys(images).map((key) =>
    images[key].replace('{$versionRoot}', versionRoot),
  );
};

export const formatAudio = (audio: string, versionRoot: string) => {
  return audio.replace('{$versionRoot}', versionRoot);
};
