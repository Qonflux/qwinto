<template>
  <form @submit.prevent="emitData" class="w-full my-6 md:mb-0 text-center">
    <set-players :players="players.length" @plus="addPlayer" @min="minPlayer"></set-players>
    <div
      v-for="(player, index) in players"
      :key="player"
      :class="`player-${player}`"
      class="mt-4">
      <label class="text-white mt-4">{{ $t('general.name') }}:</label>
      <input
        type="text"
        class="w-full border px-4 py-2 rounded focus:border-blue-500 focus:shadow-outline outline-none text-center"
        :class="`name-${player}`"
        autocomplete="off"
        maxlength="25"
        :placeholder="`${$t('general.player')} ${player + 1}`"
        v-model="names[index]"
      />
    </div>
    <div class="text-center mt-4">
      <base-button type="submit" mode="hover:opacity-75">{{ $t('start.start-game') }}</base-button>
    </div>
  </form>
</template>

<script>
import SetPlayers from "./SetPlayers.vue";

export default {
  components: {
    SetPlayers
  },  
  emits: ["start"],
  data() {
    return {
      players: [0, 1],
      names: ["", ""]
    };
  },
  methods: {
    addPlayer() {
      this.players.push(this.players.length);
      this.names.push("");
    },
    minPlayer() {
      this.players.pop(this.players.length);
      this.names.pop(this.names.length);
    },
    emitData() {
      this.$emit('start', { players: this.players, names: this.names })
    }
  }
};
</script>