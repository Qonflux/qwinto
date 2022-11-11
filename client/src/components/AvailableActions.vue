<template>
  <div class="flex-1 flex-start mt-auto" role="alert">
    <p class="font-bold text-sm">{{ $t('game.available-actions') }}:</p>
    <ul v-if="(myId === roundData.activePlayer || myId === null) && ((gameType === 'solo' && roundData.activePlayer === 0) || gameType !== 'solo')" class="list-disc text-xs ml-4">
      <li v-if="roundData.remainingRolls === 2">{{ $t('game.choose-dices') }}.</li>
      <li v-if="roundData.remainingRolls > 0 && !scoreAdded && checkedColors.length > 0">{{ $t('game.throw-dices') }} ({{ roundData.remainingRolls }}x).</li>
      <li v-show="roundData.remainingRolls < 2 && !scoreAdded">{{ $t('game.enter-score') }} ({{ roundData.dices.total }}).</li>
      <li v-if="roundData.remainingRolls < 2 && roundData.scoreAdded.length === 0">{{ $t('game.choose-failed') }}.</li>
      <li v-if="roundData.scoreAdded[roundData.activePlayer]">...</li>
    </ul>
    <ul v-if="(myId !== roundData.activePlayer && gameType !== 'local') && ((gameType === 'solo' && roundData.activePlayer !== 0) || gameType !== 'solo')" class="list-disc text-xs ml-4">
      <li>{{ $t('game.wait-turn') }}</li>
    </ul>
    <p v-if="roundData.scoreAdded.length > 0 && !roundData.scoreAdded[roundData.activePlayer] && (myId === roundData.activePlayer || myId === null) && (gameType !== 'solo' || (gameType === 'solo' && roundData.activePlayer === 0))">
      <a @click="nextPlayer({ instant: true })" class="text-xs text-blue-500 underline hover:text-blue-700 skip" href="#">{{ $t('game.skip') }} →</a>
    </p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  props: ['checkedColors'],
  methods: {
    ...mapActions(['nextPlayer']),
  },
  computed: {
    ...mapGetters(['gameData', 'roundData', 'myId', 'gameType']),
    scoreAdded() {
      return this.roundData.scoreAdded[this.roundData.activePlayer]
    }
  }
};
</script>