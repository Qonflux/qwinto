<template>
  <div class="mt-auto flex-1">
    <div class="ml-auto w-48 text-right mb-1">
      <input
        :class="{ animate: checkedColors.length < 1 }"
        v-if="roundData.remainingRolls === 2 && (roundData.activePlayer === myId || myId === null) && ((gameType === 'solo' && roundData.activePlayer === 0) || gameType !== 'solo')"
        type="checkbox"
        class="w-9 h-9 text-red-600 bg-red-600 mr-1 form-checkbox"
        value="red"
        v-model="checkedColors"
        autocomplete="off"
        style="margin-right:5px;"
      />
      <input
        :class="{ animate: checkedColors.length < 1 }"
        v-if="roundData.remainingRolls === 2 && (roundData.activePlayer === myId || myId === null) && ((gameType === 'solo' && roundData.activePlayer === 0) || gameType !== 'solo')"
        type="checkbox"
        class="w-9 h-9 text-yellow-400 bg-yellow-400 form-checkbox"
        value="yellow"
        v-model="checkedColors"
        autocomplete="off"
      />
      <input
        :class="{ animate: checkedColors.length < 1 }"
        v-if="roundData.remainingRolls === 2 && (roundData.activePlayer === myId || myId === null) && ((gameType === 'solo' && roundData.activePlayer === 0) || gameType !== 'solo')"
        type="checkbox"
        class="w-9 h-9 text-purple-700 bg-purple-700 ml-1 form-checkbox"
        value="purple"
        v-model="checkedColors"
        autocomplete="off"
        style="margin-right:3px; margin-left:5px"
      />
      <span v-if="roundData.dices && roundData.dices.numbers.red" class="text-lrg fa-stack fa-2x">
        <i style="font-size:1.5em;" class="fas fa-stack-1x fa-square text-white"></i>
        <i :class="`fa-dice-${roundData.dices.numbers.red}`" class="fas fa-stack-2x text-red-600"></i>
      </span>
      <span v-if="roundData.dices && roundData.dices.numbers.yellow" class="text-lrg fa-stack fa-2x">
        <i style="font-size:1.5em;" class="fas fa-stack-1x fa-square text-white"></i>
        <i :class="`fa-dice-${roundData.dices.numbers.yellow}`" class="fas fa-stack-2x text-yellow-400"></i>
      </span>
      <span v-if="roundData.dices && roundData.dices.numbers.purple" class="text-lrg fa-stack fa-2x">
        <i style="font-size:1.5em;" class="fas fa-stack-1x fa-square text-white"></i>
        <i :class="`fa-dice-${roundData.dices.numbers.purple}`" class="fas fa-stack-2x text-purple-700"></i>
      </span>
      <base-icon
        v-if="(roundData.activePlayer === myId || myId === null) && roundData.scoreAdded.length === 0  && ((gameType === 'solo' && roundData.activePlayer === 0) || gameType !== 'solo')"
        class="mb-0"
        :class="{ 'opacity-50': !roundData.remainingRolls || checkedColors.length < 1, animate: roundData.remainingRolls === 2 && checkedColors.length > 0 }"
        type="fa-gradient-green"
        icon="fa-redo"
        @click="rollDices"
        :number="roundData.remainingRolls">
      </base-icon>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  emits: ['dices-change'],
  data() {
    return {
      checkedColors: []
    };
  },
  computed: {
    ...mapGetters(['roundData', 'myId', 'gameType']),
    scoreAdded() {
      return this.roundData.scoreAdded.length;
    }
  },
  watch: {
    checkedColors() {
      this.$emit('dices-change', this.checkedColors);
    },
    scoreAdded() {
      // Reset checkedColors
      this.checkedColors = ['red', 'yellow', 'purple'];
      this.$emit('dices-change', this.checkedColors);
    }
  },
  methods: {
    ...mapActions(['resetDiceNums', 'setDice', 'setDiceNum', 'updateRemainingRolls', 'setTotal']),
    rollDices() {
      if (this.roundData.remainingRolls > 0 && (this.checkedColors.length > 0 || this.roundData.scoreAdded.length === 0)) {
        // Set all dices numbers to null
        this.resetDiceNums();
        // Call calcDices for each element in checkedColors
        this.checkedColors.forEach(e => this.calcDices(e, 1, 6));
        // Update remaining rolls
        this.updateRemainingRolls();
        // Add dices and push total to Vuex store
        let total = this.roundData.dices.red + this.roundData.dices.yellow + this.roundData.dices.purple;
        this.setTotal({ total: total });
      }
    },
    calcDices(color, min, max) {
      // Reset previous dice
      this.setDice({ color: color, num: 0 });
      // Calc random dice number
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      this.setDice({ color: color, num: randomNum });
      // Convert numbers to text for FontAwesome
      this.convertNum(color);
    },
    convertNum(color) {
      switch (this.roundData.dices[color]) {
        case 1:
          this.setDiceNum({ color: color, val: 'one' });
          break;
        case 2:
          this.setDiceNum({ color: color, val: 'two' });
          break;
        case 3:
          this.setDiceNum({ color: color, val: 'three' });
          break;
        case 4:
          this.setDiceNum({ color: color, val: 'four' });
          break;
        case 5:
          this.setDiceNum({ color: color, val: 'five' });
          break;
        case 6:
          this.setDiceNum({ color: color, val: 'six' });
          break;
      }
    },
  }
};
</script>

<style scoped>
.w-9 {
  width: 2.22rem;
}

.h-9 {
  height: 2.22rem;
}

.text-lrg {
  font-size: 1.27rem;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.animate {
  animation-name: pulse;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
}
</style>
