export default {
  setGameData(context, payload) {
    context.commit('setGameData', payload);
  },
  resetRoundData(context) {
    let activePlayer = !context.state.roundData.activePlayer ? 0 : context.state.roundData.activePlayer;

    let roundData = {
      activePlayer: activePlayer,
      remainingRolls: 2,
      scoreAdded: [],
      dices: {
        total: 0,
        red: 0,
        yellow: 0,
        purple: 0,
        numbers: { red:null, yellow:null, purple:null },
      }
    };
    if (!context.state.gameOver) {
      context.commit('resetRoundData', roundData);
    }
  },
  resetDiceNums(context) {
    context.commit('resetDiceNums');
  },
  setDice(context, payload) {
    context.commit('setDice', payload);
  },
  setDiceNum(context, payload) {
    context.commit('setDiceNum', payload);
  },
  updateRemainingRolls(context) {
    context.commit('updateRemainingRolls');
  },
  setScore(context, payload) {
    context.commit('setScore', payload);
  },
  setTotal(context, payload) {
    context.commit('setTotal', payload);
  },
  nextPlayer(context, payload) {
    // Remove remaining roll if there is 1 left
    if (context.state.roundData.remainingRolls === 1) {
      this.dispatch('updateRemainingRolls');
    }
    // Determine next player
    if (!payload.playerLeft) {
      payload.next = context.state.roundData.activePlayer === context.state.gameData.length - 1 ? 0 : context.state.roundData.activePlayer + 1;
    } else {
      payload.next = context.state.roundData.activePlayer === context.state.gameData.length - 1 ? 0 : context.state.roundData.activePlayer;
    }
    // Check if next player has added a score this round
    if (context.state.roundData.scoreAdded[payload.next] === true) {
      // Set next player and start new round 
      if (!payload.playerLeft) {
        payload.next = payload.next === context.state.gameData.length - 1 ? 0 : payload.next + 1;
      } else {
        payload.next = payload.next === context.state.gameData.length - 1 ? 0 : payload.next;
      }
      setTimeout(() => {
        if (!payload.playerLeft) {
          context.state.roundData.scoreAdded[context.state.roundData.activePlayer] = true;
        }  
        context.commit('nextPlayer', payload);
        this.dispatch('resetRoundData');
      }, payload.instant ? 0 : 1000);
    } else {
      // Go to next player
      setTimeout(() => {
        if (!payload.playerLeft) {
          context.state.roundData.scoreAdded[context.state.roundData.activePlayer] = true;
        }  
        context.commit('nextPlayer', payload)
      }, payload.instant ? 0 : 1000);
    }
  },
  setGameOver(context) {
    context.commit('setGameOver');
  },
  setTotalScore(context, payload) {
    context.commit('setTotalScore', payload);
  },
  // Online
  setGameType(context, payload) {
    context.commit('setGameType', payload);
  },
  setId(context, payload) {
    context.commit('setId', payload);
  },
  setName(context, payload) {
    context.commit('setName', payload);
  },
  setRoundData(context, payload) {
    context.commit('setRoundData', payload);
  },
  removePlayer(context, payload) {
    context.commit('removePlayer', payload);
  },
  storeName(context, payload) {
    context.commit('storeName', payload);
  }
};