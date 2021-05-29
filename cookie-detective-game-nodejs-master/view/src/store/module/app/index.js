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

import scenes from '../../../data/scenes.json';

const NAMESPACE = 'app';
const DEFAULT_USER_DATA = {};

const GETTERS = {
  GET_CURRENT_SCENE: '',
};

const MUTATIONS = {
  SET_DEVICE_STATE: '',
  SET_USER_DATA: '',
  SET_SESSION_DATA: '',
  SET_HOME_DATA: '',
  SET_GAME_RESULT: '',
  SET_VERSIONS: '',
  SET_VIEW: '',
  SET_SCENE: '',
  VIEW_BACK: '',
  SET_INPUT: '',
  SET_WEBHOOK_VERSION: '',
  SET_IS_MOBILE: '',
};

const ACTIONS = {
  RESPONSE: '',
};

[GETTERS, MUTATIONS, ACTIONS].forEach((constants) =>
  Object.keys(constants).forEach((key) => {
    constants[key] = `${NAMESPACE}/${key}`;
  }),
);

export const [AppGetters, AppMutations, AppActions] = [
  GETTERS,
  MUTATIONS,
  ACTIONS,
];

/**
 * This store module, manages the communication between the canvas api,
 * and the vue application
 *
 * when the canvas api receives a new state update
 * the ACTIONS.RESPONSE will be dispatched, so the application
 * can reacts to scene changes or new user inputs
 */

export default {
  state: {
    deviceState: null,
    webhookVersion: '',
    kiaiVersion: '',
    sessionData: {},
    gameResult: undefined,
    view: '',
    viewHistory: [],
    userData: {
      ...DEFAULT_USER_DATA,
    },
    homeData: {},
    input: {},
    isMobile: false,
    scene: '',
  },
  getters: {
    [GETTERS.GET_CURRENT_SCENE](state) {
      return scenes[state.scene];
    },
  },
  mutations: {
    [MUTATIONS.SET_DEVICE_STATE](state, deviceState) {
      state.deviceState = deviceState;
    },
    [MUTATIONS.SET_USER_DATA](state, payload) {
      console.debug('SETTING USER DATA', JSON.stringify(payload));
      state.userData = {...DEFAULT_USER_DATA, ...payload};
    },
    [MUTATIONS.SET_SESSION_DATA](state, payload) {
      console.debug('SETTING SESSION DATA', JSON.stringify(payload));
      state.sessionData = payload;
    },
    [MUTATIONS.SET_HOME_DATA](state, payload) {
      console.debug('SETTING HOME DATA', JSON.stringify(payload));
      state.homeData = payload;
    },
    [MUTATIONS.SET_WEBHOOK_VERSION](state, payload) {
      state.webhookVersion = payload;
    },
    [MUTATIONS.SET_VIEW](state, payload) {
      state.viewHistory.push(state.view);
      state.view = payload;
    },
    [MUTATIONS.SET_SCENE](state, payload) {
      console.debug('SETTING SCENE', payload);
      state.scene = payload;
    },
    [MUTATIONS.VIEW_BACK](state) {
      if (!state.viewHistory.length) return;
      state.view = state.viewHistory.pop();
    },
    [MUTATIONS.SET_INPUT](state, input) {
      state.input = input;
    },
    [MUTATIONS.SET_IS_MOBILE](state, isMobile) {
      state.isMobile = isMobile;
    },
  },
  actions: {
    [ACTIONS.RESPONSE]({commit}, payload) {
      const {session, user, home, input, scene, noMatch, isMobile} = payload;

      commit(MUTATIONS.SET_IS_MOBILE, isMobile);
      commit(MUTATIONS.SET_WEBHOOK_VERSION, user.params.webhookVersion);

      commit(MUTATIONS.SET_USER_DATA, user.params);
      commit(MUTATIONS.SET_SESSION_DATA, session.params);

      // The home object may be undefined, if the home storage
      // is not enabled in the action console
      if (home) commit(MUTATIONS.SET_HOME_DATA, home.params);

      if (scene) commit(MUTATIONS.SET_SCENE, scene);

      // Using an object as value on purpose here,
      // so that the value always changes and the watcher
      // always triggers, even if the actual input string would not
      if (input || noMatch) {
        commit(MUTATIONS.SET_INPUT, {input: input || noMatch});
      }
    },
  },
};
