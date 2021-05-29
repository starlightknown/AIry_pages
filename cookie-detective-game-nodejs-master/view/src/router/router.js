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

import VueRouter from 'vue-router';
import Vue from 'vue';
import {PropertyNames, VariableNames} from '../data/enum/configNames';
import {CONFIG_MANAGER} from '../data/Injectables';
import {getValue} from '../util/injector';
import getPlatform, {PLATFORMS} from '../util/getPlatform';

import routes from './routes';

Vue.use(VueRouter);

let router = null;

const getRouter = () => {
  if (!router) {
    const configManager = getValue(CONFIG_MANAGER);

    const processedRoutes = routes.concat({
      path: '*',
      redirect: '/',
    });

    const routerMode =
      getPlatform() === PLATFORMS.BROWSER ? 'history' : 'abstract';

    router = new VueRouter({
      mode: routerMode,
      routes: processedRoutes,
      base: configManager.getVariable(VariableNames.PUBLIC_PATH),
    });

    router.beforeEach((to, from, next) => {
      const persistQueryParams = configManager.getProperty(
          PropertyNames.PERSIST_QUERY_PARAMS,
      );

      let redirect = false;
      const {...query} = to.query;

      if (persistQueryParams && persistQueryParams.length > 0) {
        persistQueryParams.forEach((queryParam) => {
          if (
            typeof from.query[queryParam] !== 'undefined' &&
            typeof query[queryParam] === 'undefined'
          ) {
            query[queryParam] = from.query[queryParam];

            redirect = true;
          }
        });
      }

      if (redirect) {
        next({path: to.path, query});
      } else {
        next();
      }
    });
  }

  return router;
};

export default getRouter;
