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

/* tslint:disable:variable-name no-parameter-reassignment no-increment-decrement */
type TAsset = string | HTMLImageElement | AudioBuffer | {};
type TAssetData = string | AudioBuffer | {};
type TProgressCallback = (progress: number) => void;
type TOptions = {
  root?: string;
};

let _options: TOptions;

const GLOBAL_NAMESPACE = '__global';

const _assets: {[namespace: string]: {[url: string]: TAsset}} = {
  [GLOBAL_NAMESPACE]: {},
};

let _audioContext: AudioContext;

// eslint-disable-next-line no-return-assign
const getAudioContext = () =>
  _audioContext || (_audioContext = new AudioContext());

const EXTENSIONS: {[key: string]: string[]} = {
  VIDEO: ['mp4', 'mov', 'webm'],
  IMAGE: ['png', 'jpg', 'jpeg', 'gif'],
  AUDIO: ['wav', 'ogg', 'mp3'],
  DATA: ['json'],
};

const error = (url: string, msg: string) =>
  new Error(`AssetManager: ${url} - ${msg}`);

const retrieve = (
  url: string,
  responseType: XMLHttpRequestResponseType,
): Promise<any> =>
  new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = responseType;
    request.onload = () => {
      if (request.status !== 200) {
        return reject(
          error(url, `Failed to load asset (status ${request.status})`),
        );
      }

      return resolve(request.response);
    };
    request.onerror = reject;
    request.send();
  });

const loadAssetType: {[key: string]: (url: string) => Promise<any>} = {
  AUDIO: (url: string) =>
    retrieve(url, 'arraybuffer').then((data: ArrayBuffer) =>
      getAudioContext().decodeAudioData(data),
    ),
  VIDEO: (url: string) =>
    retrieve(url, 'blob').then((data) => URL.createObjectURL(data)),
  IMAGE: (url: string) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', reject);
    }),
  DATA: (url: string) => retrieve(url, 'json'),
};

const getAssetData = (asset: TAsset): TAssetData =>
  (asset instanceof HTMLImageElement && (asset as HTMLImageElement).src) ||
  asset;

const loadAsset = (
  url: string,
  namespace: string = GLOBAL_NAMESPACE,
): Promise<TAssetData> => {
  if (_assets[namespace][url]) return Promise.resolve(_assets[namespace][url]);

  const extension = url.split('.').pop();

  if (!extension) return Promise.reject(error(url, 'Missing extension'));

  const assetType = Object.keys(EXTENSIONS).find((type) =>
    EXTENSIONS[type].includes(extension.toLowerCase()),
  );

  if (!assetType) {
    return Promise.reject(error(url, `Unsupported asset type (${extension})`));
  }

  // eslint-disable-next-line no-return-assign
  return loadAssetType[assetType](`${_options.root || ''}${url}`).then((data) =>
    getAssetData((_assets[namespace][url] = data)),
  );
};

function load(
  assets: string[],
  namespace?: string,
  onProgress?: TProgressCallback,
): Promise<TAssetData[]>;
function load(
  assets: string[],
  onProgress?: TProgressCallback,
): Promise<TAssetData[]>;
function load(
  asset: string,
  namespace?: string,
  onProgress?: TProgressCallback,
): Promise<TAssetData[]>;
function load(
  asset: string,
  onProgress?: TProgressCallback,
): Promise<TAssetData[]>;
function load(
  assets: string[] | string,
  namespaceOrOnProgress: string | TProgressCallback = GLOBAL_NAMESPACE,
  onProgress?: TProgressCallback,
): Promise<TAssetData[]> {
  if (!(assets instanceof Array)) assets = [assets];

  let namespace = namespaceOrOnProgress as string;

  if (typeof namespaceOrOnProgress === 'function') {
    onProgress = namespaceOrOnProgress;
    namespace = GLOBAL_NAMESPACE;
  }

  _assets[namespace] = _assets[namespace] || {};

  let loaded = 0;
  return Promise.all(
    assets.map((url) =>
      loadAsset(url, namespace).then(
        (asset: TAsset): TAsset => {
          if (onProgress) onProgress(++loaded / assets.length);
          return asset;
        },
      ),
    ),
  );
}

function get(url: string, namespace: string = GLOBAL_NAMESPACE): TAssetData {
  const asset = _assets[namespace][url];
  if (!asset) throw error(url, 'Requested asset not loaded');
  return getAssetData(asset);
}

function release(): void;
function release(urls: string[]): void;
function release(namespace: string): void;
function release(urlsOrNamespace?: string[] | string): void {
  if (!urlsOrNamespace) {
    Object.keys(_assets)
      .filter((namespace) => namespace !== GLOBAL_NAMESPACE)
      .forEach((namespace) => {
        delete _assets[namespace];
      });

    release(GLOBAL_NAMESPACE);

    return;
  }

  if (urlsOrNamespace instanceof Array) {
    urlsOrNamespace.forEach((url) => {
      delete _assets[GLOBAL_NAMESPACE][url];
    });
    return;
  }

  delete _assets[urlsOrNamespace];

  if (urlsOrNamespace === GLOBAL_NAMESPACE) _assets[GLOBAL_NAMESPACE] = {};
}

const assetManager = {
  load,
  get,
  release,
};

const install = (Vue: any, options: TOptions = {}) => {
  Vue.prototype.$assets = assetManager;
  _options = options;
};

export default {...assetManager, install};
