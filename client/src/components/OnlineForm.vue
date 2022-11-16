<template>
  <form v-if="!inLobby" @submit.prevent="checkUsername" class="w-full my-6 text-center">
    <div>
      <label class="text-white">{{ $t('general.name') }}:</label>
      <input
        type="text"
        class="w-full border px-4 py-2 rounded focus:border-blue-500 focus:shadow-outline outline-none text-center"
        autocomplete="off"
        :placeholder="$t('start.username')"
        v-model.trim="username"
        maxlength="25"
        autofocus
        required
      />
    </div>
    <div class="text-center mt-4">
      <base-button type="submit" mode="hover:opacity-75">{{ $t('start.find-game') }}</base-button>
    </div>
  </form>
  <game-lobby :username="username" v-if="inLobby" @start-game="startGame"></game-lobby>
</template>

<script>
import GameLobby from "./GameLobby.vue";
import { mapGetters } from 'vuex';

export default {
  emits: ['in-lobby', 'start-game'],

  components: {
    GameLobby
  },  

  data() {
    return {
      username: this.$store.getters.storedName || '',
      inLobby: false,
      isLoading: false
    };
  },

  methods: {
    checkUsername() {
      if (this.username === '') return;
      this.socket.emit('checkUsername', { username: this.username });
    },
    findGame() {
      localStorage.setItem('name', this.username);
      this.$store.dispatch('storeName', this.username);
      this.inLobby = true;
      this.$emit('in-lobby');
    },
    startGame(players) {
      localStorage.setItem('playing-name', this.username);
      this.$emit('start-game', players)
    }
  },
  
  computed: {
    ...mapGetters(['myName', 'socket'])
  },
  
  created() {
    this.socket.on('hasUsername', (boolean) => {
      if (!boolean) this.findGame()
      else this.$emit('error', this.$t('start.username-taken'))
    });
  }
};
</script>
