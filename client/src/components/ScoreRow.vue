<template>
  <div @click="addScore($event, color)" class="flex flex-wrap mb-2 sm:ml-5 sm:mr-5" :class="`${color}-row`">
    <slot></slot>
  </div>  
  <base-dialog :show="!!errorMessage" type="error" :title="$t('game.error-title')" @close="errorMessage = null">
    <template #default>
      <p>{{ errorMessage }}</p>
    </template>
    <template #actions>
      <base-button @click="errorMessage = null">OK</base-button>
    </template>
  </base-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import scoreMixin from '../mixins/score.js';

export default {
  mixins: [scoreMixin],
  props: {
    color: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      errorMessage: null,
    };
  },
  methods: {
    ...mapActions(['setScore', 'nextPlayer', 'setGameOver']),
    addScore(e, color) {
      if ((this.myId !== this.roundData.activePlayer && this.myId !== null) || (this.gameType === 'solo' && this.roundData.activePlayer !== 0)) {
        return;
      }
      let field = parseInt(e.target.classList[1].slice(1), 10)
      if (this.roundData.dices[color] > 0 && 
      e.target.tagName === 'P' && 
      !this.gameData[this.roundData.activePlayer][color][field] && 
      !this.roundData.scoreAdded[this.roundData.activePlayer]) {
        // Check if score can be added
        const check = this.scoreCheck(field, color);

        // Only run if score can be added
        if (check === true) {
          this.setScore({ 
            color: color, 
            field: field 
          });
          // Check if winning conditions are met
          this.calcWinningConditions();
          this.nextPlayer({ next: null });
        } else if (check === 'already in column') {
          this.errorMessage = this.$t('game.error-column');
        } else if (check === 'not ascending') {
          this.errorMessage =  this.$t('game.error-ascending');
        }

        // Determine error
      } else if (this.roundData.remainingRolls === 2) {
        this.errorMessage = this.$t('game.error-throw');
      } else if (this.roundData.dices[color] === 0 && !this.roundData[this.roundData.activePlayer]) {
        this.errorMessage = this.$t('game.error-color');
      }
    }
  },
  computed: {
    ...mapGetters(['gameData', 'roundData', 'numPlayers', 'myId', 'gameType', 'socket'])
  }
};
</script>