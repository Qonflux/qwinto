<template>
  <div @click="clickFail" class="mt-3 mb-3 w-40 justify-center text-center">
    <p class="mt-1 text-xs">{{ $t('game.failed-throw') }}: -5</p>
    <div class="bg-gray-400 flex flex-wrap justify-center rounded-md">
      <div 
        v-for="i in [0, 1, 2, 3]"
        :key="i">
        <p class="w-8 h-8 pt-1 mx-1 my-1 text-center bg-white rounded-md fail">{{ isFail(i) }}</p>
      </div>
    </div>
  </div>
  <base-dialog :show="confirm" type="confirm" :title="$t('game.confirm-title')" @close="confirmFail(false)">
    <template #default>
      <p>{{ $t('game.confirm-fail') }}</p>
    </template>
    <template #actions>
      <base-button class="mr-2" mode="hover:opacity-75" @click="confirmFail(true)">OK</base-button>
      <base-button mode="hover:opacity-75" @click="confirmFail(false)">{{ $t('general.no') }}</base-button>
    </template>
  </base-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  props: ['player'],
  data() {
    return {
      confirm: false
    };
  },
  computed: {
    ...mapGetters(['gameData', 'roundData', 'socket', 'myId', 'gameType'])
  },
  methods: {
    ...mapActions(['setScore', 'nextPlayer', 'setGameOver']),
    isFail(field) {
      if (this.gameData[this.player]['fail'][field] === -5) return 'X';
    },
    clickFail() {
       // Player fails round
      if ((this.myId !== this.roundData.activePlayer && this.myId !== null) || (this.gameType === 'solo' && this.roundData.activePlayer !== 0)) {
        return;
      }
      if (this.roundData.remainingRolls < 2 && this.roundData.scoreAdded.length === 0) {
        this.confirm = true;
      }
    },
    confirmFail(answer) {
      this.confirm = false;
      if (answer) {
        this.setScore({ 
          color: 'fail', 
          field: this.gameData[this.roundData.activePlayer].fail.length 
        });
        this.checkNumFails();
        this.nextPlayer({ next: null });
      } 
    },
    checkNumFails() {
      if (this.gameData[this.roundData.activePlayer].fail.length === 4) {
        this.setGameOver();    
        if (this.gameType === 'online') {
          this.socket.emit('gameOver');
        }
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Handlee&display=swap');

p.fail {
  font-family: 'Handlee', cursive;
}
</style>