<template>
  <div class="float-left absolute w-screen z-10">
    <header class="h-12 flex bg-transparent mt-1">
      <div class="p-2 flex-grow">
        <img src="../assets/images/logo.png" alt="logo" class="w-24 h-auto ml-1" />
      </div>
      <base-icon 
        v-if="numPlayers" 
        :number="numPlayers" 
        type="fa-gradient-yellow" 
        icon="fa-users" 
        @click="showPlayerList = true">
      </base-icon>
      <base-icon 
        class="mr-6"
        type="fa-gradient-purple" 
        icon="fa-cog"
        @click="showSettings = true">
      </base-icon>
    </header>
  </div>
  <base-dialog :show="showPlayerList" type="normal" :title="$t('game.players-list')" @close="showPlayerList = false">
    <template #default>
      <ul>
        <li 
          v-for="(player, i) in gameData" 
          :key="i" 
          :class="{ 'text-orange-600 font-bold': player.name === gameData[roundData.activePlayer].name }">
          {{ i + 1 }}. {{ player.name }}
        </li>
      </ul>  
    </template>
    <template #actions>
      <base-button @click="showPlayerList = false">OK</base-button>
    </template>
  </base-dialog>
  <base-dialog :show="showSettings" type="normal" :title="$t('start.settings')" @close="showSettings = false">
    <template #default>
      <p class="text-center">{{ $t('start.language') }}</p>
      <div class="text-center mt-2">
        <flag @click="switchLang('en')" :class="{ 'opacity-50': lang !== 'en' }" class="rounded-full text-5xl m-1" iso="gb" />
        <flag @click="switchLang('nl')" :class="{ 'opacity-50': lang !== 'nl' }" class="rounded-full text-5xl m-1" iso="nl" />
        <flag @click="switchLang('de')" :class="{ 'opacity-50': lang !== 'de' }" class="rounded-full text-5xl m-1" iso="de" />
      </div>
    </template>
    <template #actions>
      <base-button @click="showSettings = false">OK</base-button>
    </template>
  </base-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      showPlayerList: false,
      showSettings: false,
      lang: localStorage.getItem('lang') || 'en'
    };
  },
  computed: {
    ...mapGetters(['gameData', 'roundData', 'numPlayers'])
  },
  methods: {
    ...mapActions(['setLang']),
    switchLang(lang) {
      this.lang = lang;
      localStorage.setItem('lang', lang);
      this.$i18n.locale = lang;  
    }
  }
}
</script>