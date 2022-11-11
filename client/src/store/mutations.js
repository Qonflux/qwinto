export default {
  setGameData(state, payload) {
    state.gameData = payload.gameData;
  },
  resetRoundData(state, roundData) {
    const containsData = (Object.keys(state.roundData).length === 0) ? false : true;
    
    state.roundData = roundData;
    if (containsData && state.gameType === 'online') {
      state.socket.emit('roundData', (state.roundData)); 
    }
  },
  resetDiceNums(state) {
    state.roundData.dices.numbers = { red:null, yellow:null, purple:null }
  },
  setDice(state, payload) {
    state.roundData.dices[payload.color] = payload.num;
  },
  setDiceNum(state, payload) {
    state.roundData.dices.numbers[payload.color] = payload.val;
    if (state.gameType === 'online') {
      state.socket.emit('roundData', (state.roundData));
    }
  },
  updateRemainingRolls(state) {
    state.roundData.remainingRolls--
  },
  setScore(state, payload) {
    state.gameData[state.roundData.activePlayer][payload.color][payload.field] = payload.color === 'fail' ? -5 : state.roundData.dices.total;  
    if (state.gameType === 'online') {
      state.socket.emit('gameData', (state.gameData)); 
    }      
  },
  setTotal(state, payload) {
    state.roundData.dices.total = payload.total;
    if (state.gameType === 'online') {
      state.socket.emit('roundData', (state.roundData));   
    }  
  },  
  nextPlayer(state, payload) {
    state.roundData.activePlayer = payload.next;
    if (state.gameType === 'online') {
      state.socket.emit('roundData', (state.roundData)); 
    }
  },
  setGameOver(state) {
    state.gameOver = true;
  },
  setTotalScore(state, payload) {
    state.gameData[payload.player].total = payload.total;
  },
  // Online
  setGameType(state, payload) {
    state.gameType = payload.type;
  },
  setId(state, payload) {
    state.myId = payload.id;
  },
  setName(state, payload) {
    state.myName = payload;
  },
  setRoundData(state, payload) {
    state.roundData = payload;
  },
  removePlayer(state, payload) {
    state.gameData.splice(payload, 1);
  },
  storeName(state, payload) {
    state.storedName = payload;
  }
};