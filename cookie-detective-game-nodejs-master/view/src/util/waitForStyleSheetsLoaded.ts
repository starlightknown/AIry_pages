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

const waitForStyleSheetsLoaded = (document: HTMLDocument) =>
  new Promise((resolve) => {
    const links = <Array<HTMLLinkElement>>(
      Array.from(document.querySelectorAll('link[rel=stylesheet]'))
    );

    let allLoaded = false;
    let loadedCount = 0;
    const checkAllLoaded = (initial = false) => {
      // initially, check stylesheets in the DOM, otherwise, check loaded count
      if (
        !allLoaded &&
        ((initial && document.styleSheets.length >= links.length) ||
          (!initial && loadedCount >= links.length))
      ) {
        allLoaded = true;

        resolve();
      }
    };

    checkAllLoaded(true);

    if (!allLoaded) {
      links.forEach((stylesheet) => {
        stylesheet.onload = () => {
          loadedCount += 1;
          checkAllLoaded();
        };
      });
    }
  });
export default waitForStyleSheetsLoaded;
