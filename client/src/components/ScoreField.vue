<template>
  <div class="w-1/12 flex justify-center font-bold" :class="[bg, rounded]">
    <p v-if="fieldType !== ''" :class="[fieldType, `p${field}`]">
      <transition name="input">
        <span v-if="typeof input !== 'undefined'">{{ input }}</span>
      </transition>
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    type: {
      type: String
    },
    field: {
      type: Number
    },
    color: {
      type: String
    },
    player: {
      type: Number
    }
  },
  computed: {
    ...mapGetters(['gameData', 'roundData']),
    bg() {
      if (this.type === 'blank') return '';
      if (this.color === 'red') return 'bg-red-600';
      if (this.color === 'yellow') return 'bg-yellow-400';
      if (this.color === 'purple') return 'bg-purple-700';
      return '';
    },
    rounded() {
      if ((this.color === 'red' && this.field == 2) || 
      (this.color === 'yellow' && this.field == 1) || 
      (this.color === 'purple' && this.field == 0)) return 'rounded-l-lg';
      if ((this.color === 'red' && this.field == 11) || 
      (this.color === 'yellow' && this.field == 10) || 
      (this.color === 'purple' && this.field == 9)) return 'rounded-r-lg';
      return '';
    },
    fieldType() {
      if (this.type === 'normal') return 'score-normal';
      if (this.type === 'bonus') return 'score-bonus';
      return '';
    },
    input() {
      return this.gameData[this.player][this.color][this.field];
    },
    checkActivePlayer() {
      return typeof this.roundData.activePlayer !== 'undefined';
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sacramento&display=swap');

span {
  display: inline-block;
  font-family: 'Sacramento', cursive;
}

.input-enter-from {
  transform: scale(3);
  opacity: 0;
}

.input-enter-active {
  transition: all 0.3s ease;
}

.input-enter-to {
  transform: scale(1);
  opacity: 1;
}
</style>