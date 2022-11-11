<template>
  <the-header v-if="numPlayers"></the-header>
  <start-form v-if="numPlayers === 0" @start-game="startGame"></start-form>
  <score-card
    v-for="(player, i) in gameData" 
    :key="i" 
    :player="i"
    :game-over="gameOver"
    ref="card">
    <template #default>
      <available-actions :checked-colors="checkedColors" v-if="checkActivePlayer && !gameOver"></available-actions>
    </template> 
    <template #control>
      <control-panel 
        @dices-change="passDiceColors"
        v-if="checkActivePlayer && !gameOver"
        ref="controlDices">
      </control-panel>
    </template> 
  </score-card>
  <total-results v-if="gameOver" :total-scores="totalScores"></total-results>
  <base-dialog :show="!!error" :type="errorType" :title="$t('game.notification')" @close="handleError">
    <template #default>
      <p>{{ error }}</p>
    </template>
    <template #actions>
      <base-button @click="handleError">OK</base-button>
    </template>
  </base-dialog>
</template>

<script>
import TheHeader from "./components/TheHeader.vue";
import StartForm from "./components/StartForm.vue";
import ScoreCard from "./components/ScoreCard.vue";
import ControlPanel from "./components/ControlPanel.vue";
import AvailableActions from "./components/AvailableActions.vue";
import TotalResults from "./components/TotalResults.vue";
import { mapActions, mapGetters } from 'vuex';
import scoreMixin from './mixins/score.js';

export default {
  name: "App",
  components: {
    TheHeader,
    StartForm,
    ScoreCard,
    ControlPanel,
    AvailableActions,
    TotalResults
  },
  mixins: [scoreMixin],
  data() {
    return {
      error: false,
      userLeft: null,
      totalScores: [],
      dices: null,
      checkedColors: []
    };
  },
  computed: {
    ...mapGetters(['gameType', 'gameData', 'roundData', 'gameIsOver', 'numPlayers', 'socket', 'myName']),
    checkActivePlayer() {
      return typeof this.roundData.activePlayer !== 'undefined';
    },
    gameOver() { 
      let filteredArray;
      if (this.roundData.scoreAdded) {
        filteredArray = this.roundData.scoreAdded.filter(n => n);
      }
      return this.gameIsOver && filteredArray.length === this.numPlayers;
    },
    activePlayer() {
      return this.roundData.activePlayer;
    },
    errorType() {
      if (this.error === this.$t('game.not-enough')) {
        return 'error';
      }
      return 'confirm';
    },
    botOwnTurn() {
      return this.gameType === 'solo' && this.roundData.activePlayer !== 0 && this.roundData.scoreAdded.length === 0
    },
    botOthersTurn() {
      return this.gameType === 'solo' && this.roundData.activePlayer !== 0 && this.roundData.scoreAdded.length !== 0
    }
  },
  methods: {
    ...mapActions(
      ['resetRoundData', 'setRoundData', 'setGameData', 'setGameOver', 
      'nextPlayer', 'removePlayer', 'setTotalScore', 'setId', 'setScore']
    ),
    startGame() {
      this.resetRoundData();
    },
    passDiceColors(data) {
      this.checkedColors = data;
    },
    calcScores() {
      this.gameData.forEach((player) => {
        this.totalScores.push({ name: player.name, score: player.total[9]} );
      });
      this.totalScores = this.totalScores.sort((a, b) => b.score - a.score);
    },
    calcBonus(player, fieldNo, bonusField, otherField1, otherField2) {
      if (
        this.gameData[player][bonusField][fieldNo] > 0 &&
        this.gameData[player][otherField1][fieldNo] > 0 &&
        this.gameData[player][otherField2][fieldNo] > 0
      ) {
        return this.gameData[player][bonusField][fieldNo];
      }
      return 0;
    },
    handleError() {
      if (this.error === this.$t('game.not-enough')) {
        location.href = '/';
      }
      this.error = false;
    },
    simulateTurn() {
      let bot = this.roundData.activePlayer;

      // create color arrays
      let colors = {
        red: [[], [], []],
        yellow: [[], [], []],
        purple: [[], [], []]
      }

      // fill color arrays with current scores
      let colorNames = ['red', 'yellow', 'purple'];
      let colorFields = {
        red: [[2,3], [4,6,7], [8,9,10,11]],
        yellow: [[1,2], [3,4,5], [7,8,9,10]],
        purple: [[0,1], [2,3,5], [6,7,8,9]]
      };

      colorNames.forEach(color => {
        colors[color][0].push(
          this.gameData[bot][color][colorFields[color][0][0]],
          this.gameData[bot][color][colorFields[color][0][1]]
        );
        colors[color][1].push(
          this.gameData[bot][color][colorFields[color][1][0]],
          this.gameData[bot][color][colorFields[color][1][1]],
          this.gameData[bot][color][colorFields[color][1][2]]
        );
        colors[color][2].push(
          this.gameData[bot][color][colorFields[color][2][0]],
          this.gameData[bot][color][colorFields[color][2][1]],
          this.gameData[bot][color][colorFields[color][2][2]],
          this.gameData[bot][color][colorFields[color][2][3]]
        );
      });

      /* determine how many dices to roll */
      
      // join color arrays to check where there is room
      let zeroArr = colors.red[0].concat(colors.yellow[0], colors.purple[0]);
      let oneArr = colors.red[1].concat(colors.yellow[1], colors.purple[1]);
      let twoArr = colors.red[2].concat(colors.yellow[2], colors.purple[2]);
      console.log('zero: ', zeroArr);
      console.log('one: ', oneArr);
      console.log('two: ', twoArr);
      
      let numDices;
      let chance = Math.random();
      // room in every array
      if (zeroArr.filter(Boolean).length < 6 && oneArr.filter(Boolean).length < 9 && twoArr.filter(Boolean).length < 12) {
        if (chance <= 0.2) {
        numDices = 1;
        } else if (chance <= 0.55) {
          numDices = 2;
        } else {
          numDices = 3
        }
      // room in arr 0 + 1
      } else if (zeroArr.filter(Boolean).length < 6 && oneArr.filter(Boolean).length < 9) {
        if (chance <= 0.4) {
          numDices = 1;
        } else {
          numDices = 2;
        }
      // room in arr 0 + 2
      } else if (zeroArr.filter(Boolean).length < 6 && twoArr.filter(Boolean).length < 12) {
        if (chance <= 0.33) {
          numDices = 1;
        } else {
          numDices = 3;
        }
      // room in arr 1 + 2
      } else if (oneArr.filter(Boolean).length < 9 && twoArr.filter(Boolean).length < 12) {
        if (chance <= 0.4) {
          numDices = 2;
        } else {
          numDices = 3;
        }
      // only room in 0
      } else if (zeroArr.filter(Boolean).length < 6) {
        numDices = 1
      // only room in 1
      } else if (oneArr.filter(Boolean).length < 9) {
        numDices = 2
      // only room in 2
      } else if (twoArr.filter(Boolean).length < 12) {
        numDices = 3
      }

      // determine which color dices to use
      let useColors = [];
      let usableColors = [];
    
      if (numDices === 3) {
        useColors = ['red', 'yellow', 'purple'];
      } else if (numDices === 2) {
          colorNames.forEach(color => {
          if (colors[color][1].filter(Boolean).length < 3) usableColors.push(color);
        });
        let randomUsableColors = this.shuffle(usableColors);
        if (usableColors.length === 2 || usableColors.length === 3) {
          useColors.push(randomUsableColors[0], randomUsableColors[1])
        } else /* length = 1 */ {
          useColors.push(randomUsableColors[0])
          if (usableColors[0] === 'red') {
            useColors.push('yellow');
          } else if (usableColors[0] === 'yellow') {
            useColors.push('red');
          } else if (usableColors[0] === 'purple') {
            useColors.push('red');
          }
        }
      } else /* numDices === 1 */ {
        colorNames.forEach(color => {
          if (colors[color][0].filter(Boolean).length < 2) usableColors.push(color);
        });
        let randomUsableColors = this.shuffle(usableColors);
        useColors.push(randomUsableColors[0])
      }

      setTimeout(() => {
        // change dice colors
        this.$refs.controlDices.checkedColors = useColors;      
        this.$refs.controlDices.rollDices();    
        // add score
        this.addBotScore('own');             
      }, 2000);
    },
    addBotScore(turn) {
      let total = this.roundData.dices.total;
      console.log(turn, total);
      let colorsUsed = [];
      ['red', 'yellow', 'purple'].forEach(color => {
        if (this.roundData.dices[color] > 0) colorsUsed.push(color);
      });
      
      // determine possible fields
      let possibleFields = [];
      let fieldScores = [
        [[1], [5]], // 1
        [[4], [9]], // 2
        [[6], [10]], // 3
        [[8], [11]], // 4
        [[9], [12]], // 5
        [[10], [13]], // 6
        [[11], [14]], // 7 
        [[12], [15]], // 8
        [[14], [18]], // 9
      ];
      fieldScores.forEach((el, i) => {
        if (total >= el[0] && total <= el[1]) possibleFields.push(i + 1);
      });

      // randomize colors + fields
      let randomColors = this.shuffle(colorsUsed);
      let randomFields = this.shuffle(possibleFields);

      // create new array with colors and original gameData array positions
      let originalArr = [];
      randomColors.forEach(color => {
        originalArr.push({ 
          color, 
          fields: this.originalPosition(randomFields, color) 
        })
      });

      let scoreData = [];
      outerLoop:
      for (let i = 0; i < originalArr.length; i++) {
        for (let y = 0; y < originalArr[i].fields.length; y++) {
          let scoreField = originalArr[i].fields[y];
          let scoreColor = originalArr[i].color;
          if (this.scoreCheck(scoreField, scoreColor) === true && 
          !this.gameData[this.roundData.activePlayer][scoreColor][scoreField]) {
            scoreData.push(scoreColor, scoreField);
            break outerLoop;
          }
        }
      }

      if (scoreData.length === 0 && turn === 'own') { // no compatible field/color found
        if (this.roundData.remainingRolls > 0) {      
          console.log('Roll again');    
          setTimeout(() => {
            // roll dices again
            this.$refs.controlDices.rollDices();  
            // add score
            this.addBotScore('own'); 
          }, 2000);
        } else {
          // enter failed throw
          setTimeout(() => {
            this.$refs.card.$refs.failed.confirmFail(true);
          }, 2000);
        }
      } else if (scoreData.length === 0 && turn === 'other') {
        this.nextPlayer({ next: null }); // nextPlayer already has time-out in action
      } else { // compatible field/color was found
        this.pushScore(scoreData);
      }

    },
    pushScore(data) {
      let color = data[0];
      let field = data[1];

      setTimeout(() => {
        this.setScore({ 
          color: color, 
          field: field 
        });
        // Check if winning conditions are met
        this.calcWinningConditions();
        this.nextPlayer({ next: null });
      }, 2000);
    },
    originalPosition(arr, color) {
      // translate field back to position in original gameData array
      let newArr = arr.map(field => {
        if ((color === 'red' && field <= 3) || (color === 'yellow' && field >= 6)) {
          return field = field + 1;
        } else if (color === 'red' && field >= 4) {
          return field = field + 2; 
        } else if (color === 'purple' && field <= 4) {
          return field = field - 1;
        } else {
          return field
        }
      })
      
      return newArr;
    },
    shuffle(arr) {
      let ctr = arr.length;
      let temp, index;

      // While there are elements in the array
      while (ctr > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * ctr);
        // Decrease ctr by 1
        ctr--;
        // And swap the last element with it
        temp = arr[ctr];
        arr[ctr] = arr[index];
        arr[index] = temp;
      }
      return arr;
    }
  },
  watch: {
    gameOver() {
      this.gameData.forEach((_, player) => {
        // Create new array for storing totals row
        let total = [];
        // For every color: if array has 9 elements, take last value as score; else take the number of elements as score
        let colorArray = ['red', 'yellow', 'purple'];
        colorArray.forEach(color => {
          let newArray = this.gameData[player][color].filter(n => n);
          if (newArray.length === 9) {
            total.push(newArray[8]);
          } else {
            total.push(newArray.length);
          }
        });
        total.push(
          this.calcBonus(player, 3, 'red', 'yellow', 'purple'),
          this.calcBonus(player, 7, 'red', 'yellow', 'purple'),
          this.calcBonus(player, 8, 'yellow', 'red', 'purple'),
          this.calcBonus(player, 2, 'purple', 'red', 'yellow'),
          this.calcBonus(player, 9, 'purple', 'red', 'yellow')
        );
        // -5 points for every failed round
        let failPoints = 0;
        this.gameData[player].fail.forEach(element => {
          failPoints += element;
        });
        total.push(failPoints);
        // Add up everything and store it as the last element of total array
        total.push(total.reduce((a, b) => a + b, 0));
        this.setTotalScore({ player: player, total: total });
      });
      this.calcScores();
    },
    botOwnTurn(newVal) {
      if (newVal) {
        this.simulateTurn();
      }
    },
    botOthersTurn(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.addBotScore('other');
      }
    }
  },
  created() {
    // get localStorage items if there are any
    let lang = localStorage.getItem('lang');
    if (lang) this.$i18n.locale = lang;

    let name = localStorage.getItem('name');
    if (name) this.$store.dispatch('storeName', name);

    this.socket.on('connect', () => {
      console.log('Connected!', this.socket.id);
    });

    this.socket.on('roomData', ({ users, started, user }) => {
      if (this.gameOver) return;
      if (users.length < 2 && started) {
        this.error = this.$t('game.not-enough');
      } else if (started) {
        this.userLeft = this.gameData[user].name;
        this.error = `${this.userLeft} ${this.$t('game.left')}...`;
        if (user === this.roundData.activePlayer) {
          if (this.roundData.scoreAdded.length === 0) {
            // determine next player
            const next = this.roundData.activePlayer === this.gameData.length - 1 ? 0 : this.roundData.activePlayer;
            this.$store.commit('nextPlayer', { next: next });
            this.$store.dispatch('resetRoundData');
          } else {
            this.nextPlayer({ instant: true, playerLeft: true });
          }
        }
        // remove from gameData
        setTimeout(() => {
          this.removePlayer(user);
          // set new id
          let id = this.gameData.findIndex(el => el.name === this.myName);
          this.setId({ id });
        }, 1000);
      }
    });

    this.socket.on('roundData', (data) => {
      this.setRoundData(data);
    });

    this.socket.on('gameData', (data) => {
      this.setGameData({ gameData: data });
    });

    this.socket.on('gameOver', () => {
      this.setGameOver();
    });
  }
};
</script>

<style>
#app {
  box-sizing: border-box;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a, button, div, span, i, input {
-webkit-tap-highlight-color: transparent;
-webkit-touch-callout: none;
-webkit-user-select: none;
-khtml-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
}

body {
  background: #181b20;
  color: #2d3748;
}

.full-width {
	left: 50%;
	margin-left: -50vw;
	margin-right: -50vw;
	max-width: 100vw;
	position: relative;
	right: 50%;
	width: 100vw;
}
</style>
