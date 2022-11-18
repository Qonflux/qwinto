<template>
  <div v-if="showPlayer" class="flex justify-center h-screen bg-gray-200">
    <div
      class="w-screen fixed bottom-0"
      :class="{ 'opacity-75': (gameType === 'online' && player !== myId) || (gameType === 'solo' && roundData.activePlayer !== 0) }">
      <div class="text-2xl font-bold text-center my-4">
        {{ gameData[player].name }}
      </div>
      <div class="flex flex-col max-w-2xl mx-auto">
        <score-row v-if="!gameOver" color="red">
          <score-field
            v-for="(fields, i) in scoreFieldData.red"
            :key="i"
            :player="player"
            :type="fields"
            :field="i"
            color="red"
          ></score-field>
        </score-row>
        <score-row v-if="!gameOver" color="yellow">
          <score-field
            v-for="(fields, i) in scoreFieldData.yellow"
            :key="i"
            :player="player"
            :type="fields"
            :field="i"
            color="yellow"
          ></score-field>
        </score-row>
        <score-row v-if="!gameOver" color="purple">
          <score-field
            v-for="(fields, i) in scoreFieldData.purple"
            :key="i"
            :player="player"
            :type="fields"
            :field="i"
            color="purple"
          ></score-field>
        </score-row>
      </div>
      <div v-if="!gameOver" class="flex mx-5">
        <slot></slot>
        <failed-row :player="player" ref="failed"></failed-row>
        <slot name="control"></slot>
      </div>
      <total-row :player="player" :gameOver="gameOver"></total-row>
    </div>
  </div>
</template>

<script>
import ScoreRow from './ScoreRow.vue';
import ScoreField from './ScoreField.vue';
import FailedRow from './FailedRow.vue';
import TotalRow from './TotalRow.vue';
import { mapGetters } from 'vuex';

export default {
  props: {
    player: Number,
    gameOver: Boolean
  },
  
  components: {
    ScoreRow,
    ScoreField,
    FailedRow,
    TotalRow
  },
  
  data() {
    return {
      scoreFieldData: {
        red: [
          'blank',
          'blank',
          'normal',
          'bonus',
          'normal',
          'empty',
          'normal',
          'bonus',
          'normal',
          'normal',
          'normal',
          'normal',
        ],
        yellow: [
          'blank',
          'normal',
          'normal',
          'normal',
          'normal',
          'normal',
          'empty',
          'normal',
          'bonus',
          'normal',
          'normal',
          'blank',
        ],
        purple: [
          'normal',
          'normal',
          'bonus',
          'normal',
          'empty',
          'normal',
          'normal',
          'normal',
          'normal',
          'bonus',
          'blank',
          'blank',
        ],
      }
    };
  },
  
  computed: {
    ...mapGetters(['gameData', 'roundData', 'gameType', 'myId']),
    showPlayer() {
      return this.roundData.activePlayer === this.player && !this.gameOver;
    }
  }
};
</script>
