export default {
  methods: {
    scoreCheck(field, color) {
      let player = this.roundData.activePlayer;
      let score = this.roundData.dices.total;
      // Copy score array with the current score in it
      let copyArray = [...this.gameData[player][color]];
      copyArray[field] = score;
      // Create new array without empty elements
      let filteredArray = copyArray.filter(n => n);
      // Check if array is ascending
      if (this.isSorted(filteredArray)) {
        // Check if number is not the same as field above or below
        if (
          color === 'red' &&
          (score === this.gameData[player].yellow[field] || score === this.gameData[player].purple[field])
        ) {
          return 'already in column';
        } else if (
          color === 'yellow' &&
          (score === this.gameData[player].red[field] || score === this.gameData[player].purple[field])
        ) {
          return 'already in column';
        } else if (
          color === 'purple' &&
          (score === this.gameData[player].red[field] || score === this.gameData[player].yellow[field])
        ) {
          return 'already in column';
        }
        return true;
      }
      return 'not ascending';
    },
    isSorted(arr) {
      const limit = arr.length - 1;
      return arr.every((_, i) => (i < limit ? arr[i] < arr[i + 1] : true));
    },
    calcWinningConditions() {
      for (let i = 0; i < this.numPlayers; i++) {
        let fullRows = 0;
        // Create array with every row color
        let colorArray = ['red', 'yellow', 'purple'];
        colorArray.forEach( color => {
          let filteredArray = this.gameData[i][color].filter(n => n);
          // Increment fullRows if row has 9 elements
          if (filteredArray.length === 9) {
            fullRows++;
          }
        });
        if (fullRows >= 2) {
          this.$store.dispatch('setGameOver')
          if (this.gameType === 'online') {
            this.$store.getters.socket.emit('gameOver');
          }
        }
      }
    }
  },
};
