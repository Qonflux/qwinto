import { createStore } from 'vuex';
import io from 'socket.io-client';

import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

const store = createStore({
  state() {
    return {
      gameType: null,
      socket: io(/* 'http://localhost:3000',  */{
        transports: ['websocket'],
        allowUpgrades: false
      }),
      gameData: [],
      myId: null,
      myName: null,
      roundData: {},
      gameOver: false,
      storedName: null
    };
  },
  mutations,
  actions,
  getters
});

export default store;