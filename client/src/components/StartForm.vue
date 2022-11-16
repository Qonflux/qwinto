<template>
  <div v-if="!type" class="fixed h-full w-full flex items-center justify-center pointer-events-none">
    <div class="z-10">
      <img class="mx-auto right-0 left-0 w-32" src="../assets/images/qwinto-start.png" alt="logo" />
    </div>
  </div>
  <div v-if="!type" class="flex">
    <div class="h-screen flex flex-col flex-1 text-white">
      <div @click="toggleType('online')" class="flex-1 gradient-red flex pointer-events-auto">
        <div class="my-auto mx-auto text-center">
          <p class="text-2xl font-bold">
            <i class="fas fa-globe-americas"></i>
            {{ $t('start.online') }}
          </p>
          <p>{{ $t('start.online-summary') }}</p>
        </div>
      </div>
      <div @click="toggleType('solo')" class="flex-1 gradient-yellow flex">
        <div class="my-auto mx-auto text-center">
          <p class="text-2xl font-bold">
            <i class="fas fa-user"></i>
            {{ $t('start.single') }}
          </p>
          <p>{{ $t('start.single-summary') }}</p>
        </div>
      </div>
    </div>
    <div class="h-screen flex flex-col flex-1 text-white">
      <div @click="toggleType('local')" class="flex-1 gradient-purple flex">
        <div class="my-auto mx-auto text-center">
          <p class="text-2xl font-bold">
            <i class="fas fa-user-friends"></i>
            {{ $t('start.local') }}
          </p>
          <p>{{ $t('start.local-summary') }}</p>
        </div>
      </div>
      <div @click="toggleType('settings')" class="flex-1 gradient-gray flex">
        <div class="my-auto mx-auto text-center">
          <p class="text-2xl font-bold">
            <i class="fas fa-cog"></i>
            {{ $t('start.settings') }}
          </p>
          <p>{{ $t('start.settings-summary') }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-if="type" :class="bgGradient" class="text-white p-1 flex">
    <div v-if="!inLobby" @click="type = null" class="flex-1">&nbsp;<i class="fas fa-arrow-left"></i>&nbsp;</div>
    <div v-else class="flex-1"></div>
    <div class="capitalize font-bold">{{ menu }}</div>
    <div class="flex-1"></div>
  </div>
  <div class="form mx-auto max-w-xs">
    <local-form v-if="type === 'local'" @start="startGame"></local-form>
    <online-form v-if="type === 'online'" @in-lobby="toggleLobby" @start-game="startOnlineGame" @error="$emit('error', $event)"></online-form>
    <start-settings v-if="type === 'settings'"></start-settings>
    <solo-form v-if="type === 'solo'" @start="startSoloGame"></solo-form>
  </div>
  <base-dialog :show="!lang" type="lang" :title="$t('start.lang-title')" @close="setLang('en')">
    <template #default>
      <div class="text-center mt-2">
        <flag @click="setLang('en')" class="rounded-full text-5xl m-1" iso="gb" />
        <flag @click="setLang('nl')" class="rounded-full text-5xl m-1" iso="nl" />
        <flag @click="setLang('de')" class="rounded-full text-5xl m-1" iso="de" />
      </div>
    </template>
  </base-dialog>
</template>

<script>
import LocalForm from './LocalForm.vue';
import OnlineForm from './OnlineForm.vue';
import StartSettings from './StartSettings.vue';
import SoloForm from './SoloForm.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    LocalForm,
    OnlineForm,
    StartSettings,
    SoloForm,
  },

  emits: ['start-game', 'error'],

  data() {
    return {
      gameData: [],
      type: null,
      inLobby: false,
      lang: localStorage.getItem('lang'),
    };
  },

  computed: {
    bgGradient() {
      return { 
        'gradient-red': this.type === 'online',
        'gradient-purple': this.type === 'local',
        'gradient-yellow': this.type === 'solo',
        'gradient-gray': this.type === 'settings'
      }
    },
    menu() {
      if (this.type === 'online') return this.$t('start.online')
      if (this.type === 'local') return this.$t('start.local')
      if (this.type === 'solo') return this.$t('start.single')
      if (this.type === 'settings') return this.$t('start.settings')
      return ''
    }
  },

  methods: {
    ...mapActions(['setGameData', 'setGameType']),
    setLang(lang) {
      localStorage.setItem('lang', lang);
      this.$i18n.locale = lang;
      this.lang = lang;
    },
    toggleType(type) {
      this.type = type;
    },
    startGame(data) {
      data.players.forEach(i => {
        let name = data.names[i] ? data.names[i] : `Speler ${i + 1}`;
        this.gameData.push({
          name: name,
          red: [],
          yellow: [],
          purple: [],
          fail: [],
          total: []
        });
      });
      // push gameData to Vuex store
      this.setGameData({ gameData: this.gameData });
      this.setGameType({ type: this.type });
      // Tell App.vue that gameData was set and start game
      this.$emit('start-game');
    },
    startSoloGame(data) {
      this.gameData.push({
        name: data.name,
        red: [],
        yellow: [],
        purple: [],
        fail: [],
        total: []
      },
      {
        name: 'Qwinbot',
        red: [],
        yellow: [],
        purple: [],
        fail: [],
        total: []
      });

      // push gameData to Vuex store
      this.setGameData({ gameData: this.gameData });
      this.setGameType({ type: this.type });

      // Tell App.vue that gameData was set and start game
      this.$emit('start-game');
    },
    startOnlineGame(data) {
      if (this.gameData.length === 0) {
        data.forEach(player => {
          this.gameData.push({
            name: player,
            red: [],
            yellow: [],
            purple: [],
            fail: [],
            total: []
          });
        });
      }

      // push gameData to Vuex store
      this.setGameData({ gameData: this.gameData });
      this.setGameType({ type: this.type });

      // Tell App.vue that gameData was set and start game
      this.$emit('start-game');
    },
    toggleLobby() {
      this.inLobby = true;
    },
  },
};
</script>

<style scoped>
.gradient-red {
  background: -webkit-gradient(linear, left top, left bottom, from(#e53e3e), to(#742a2a));
}

.gradient-yellow {
  background: -webkit-gradient(linear, left top, left bottom, from(#f6e05e), to(#b7791f));
}

.gradient-purple {
  background: -webkit-gradient(linear, left top, left bottom, from(#805ad5), to(#5b21b6));
}

.gradient-gray {
  background: -webkit-gradient(linear, left top, left bottom, from(#a0aec0), to(#718096));
}
</style>
