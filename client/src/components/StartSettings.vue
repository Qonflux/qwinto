<template>
  <p class="text-white text-center mt-6">{{ $t('start.language') }}</p>
  <div class="text-center mt-2">
    <flag @click="switchLang('en')" :class="{ 'opacity-50': lang !== 'en' }" class="rounded-full text-5xl m-1" iso="gb" />
    <flag @click="switchLang('nl')" :class="{ 'opacity-50': lang !== 'nl' }" class="rounded-full text-5xl m-1" iso="nl" />
    <flag @click="switchLang('de')" :class="{ 'opacity-50': lang !== 'de' }" class="rounded-full text-5xl m-1" iso="de" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      lang: localStorage.getItem('lang') || 'en'
    }
  },
  methods: {
    ...mapActions(['setLang']),
    switchLang(lang) {
      this.lang = lang;
      localStorage.setItem('lang', lang);
      this.$i18n.locale = lang;  
    }
  }
};
</script>
