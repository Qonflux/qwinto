<template>
  <p class="text-xs text-center total">{{ $t('game.total') }}</p>
  <div class="bg-gray-500 full-width text-center">
    <div class="flex flex-wrap justify-center max-w-2xl mx-auto">
      <div class="w-1/12 rounded-l-lg">
        <p class="w-8 h-8 pt-1 mx-auto my-1 bg-white border-2 border-red-600 rounded-md">
          {{ gameData[player].total[0] }}
        </p>
      </div>
      <div class="w-1/12 rounded-l-lg">
        <p class="w-8 h-8 pt-1 mx-auto my-1 bg-white border-2 border-yellow-400 rounded-md">
          {{ gameData[player].total[1] }}
        </p>
      </div>
      <div class="w-1/12 rounded-l-lg">
        <p class="w-8 h-8 pt-1 mx-auto my-1 bg-white border-2 border-purple-700 rounded-md">
          {{ gameData[player].total[2] }}
        </p>
      </div>
      <p class="mt-p text-lg font-bold text-white">+</p>
      <div class="w-1/12">
        <p class="score-bonus mx-auto">{{ gameData[player].total[3] }}</p>
      </div>
      <div class="w-1/12">
        <p class="score-bonus mx-auto">{{ gameData[player].total[4] }}</p>
      </div>
      <div class="w-1/12">
        <p class="score-bonus mx-auto">{{ gameData[player].total[5] }}</p>
      </div>
      <div class="w-1/12">
        <p class="score-bonus mx-auto">{{ gameData[player].total[6] }}</p>
      </div>
      <div class="w-1/12">
        <p class="score-bonus mx-auto">{{ gameData[player].total[7] }}</p>
      </div>
      <p class="mt-p text-lg font-bold text-white">-</p>
      <div class="w-1/12 rounded-l-lg">
        <p class="w-8 h-8 pt-1 mx-auto my-1 bg-white rounded-md">{{ gameData[player].total[8] }}</p>
      </div>
      <p class="mt-p text-lg font-bold text-white">=</p>
      <div class="w-1/12 rounded-l-lg ml-1">
        <p class="w-12 h-8 pt-1 mx-auto my-1 bg-white border-2 border-gray-800 rounded-md">
          {{ gameData[player].total[9] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    player: Number,
    gameOver: Boolean,
  },
  data() {
    return {
      totalScores: [],
    };
  },
  computed: {
    ...mapGetters(['gameData']),
  }
};
</script>

<style scoped>
.mt-p {
  margin-top: 0.4rem;
}
</style>
