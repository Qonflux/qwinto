export default {
  gameType(state) {
    return state.gameType;
  },
  gameData(state) {
    return state.gameData;
  },
  myId(state) {
    return state.myId;
  },
  myName(state) {
    return state.myName;
  },
  numPlayers(state) {
    return state.gameData.length;
  },
  roundData(state) {
    return state.roundData;
  },
  gameIsOver(state) {
    return state.gameOver;
  },
  socket(state) {
    return state.socket;
  },
  storedName(state) {
    return state.storedName;
  }
};