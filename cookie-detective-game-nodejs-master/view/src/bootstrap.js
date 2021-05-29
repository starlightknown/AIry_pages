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

import 'modernizr';
import Vue from 'vue';
import {sync} from 'vuex-router-sync';
import './asset/style/screen.scss';
import './settings/settings';
import directive from './directive/directive';
import component from './component/component';
import getRouter from './router/router';
import getStore from './store/store';
import startUp from './control/startUp';
import setupInjects from './util/setupInjects';
import App from './App';
import filter from './filter/filter';
import canvas from './lib/canvas';
import {AppActions} from './store/module/app';

// register filters globally
Object.keys(filter).forEach((key) => Vue.filter(key, filter[key]));

// register directives globally
Object.keys(directive).forEach((key) => Vue.directive(key, directive[key]));

// register components globally
Object.keys(component).forEach((key) => Vue.component(key, component[key]));

setupInjects();

if (window.webpackPublicPath) {
  // eslint-disable-next-line
  __webpack_public_path__ = window.webpackPublicPath;
}

const router = getRouter();
const store = getStore();

// set up global interactiveCanvas
canvas.setup((state) => store.dispatch(AppActions.RESPONSE, state));

// sync router data to store
sync(store, router);

// Init new vue app
const app = new Vue({
  router,
  store,
  render: (createElement) => createElement(App),
});

// Mount the app after startUp
startUp().then(() => app.$mount('#app'));
