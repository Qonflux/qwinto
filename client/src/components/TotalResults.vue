<template>
  <div class="flex w-screen text-white">
    <div class="w-screen mt-16">
      <div
        v-for="(result, i) in totalScores"
        :key="i"
        :class="{
          'bg-yellow-500': i === 0,
          'bg-gray-500': i === 1,
          'bg-yellow-700': i === 2,
          'bg-gray-800': i >= 3,
        }"
        class="max-w-xl mt-3 p-3 mx-auto rounded-full flex items-center text-xl"
      >
        <p class="ml-3 flex-grow font-bold">{{ result.name }}</p>
        <div class="mx-auto">
          <span class="fa-stack-1 text-center">
            <i class="fas fa-star fa-gradient-blue fa-stack-2x"></i>
            <i class="fas fa-stack-1x text-center text-sm" style="margin-top:10px">
              <span>{{ result.score }}</span>
            </i>
          </span>
          <div class="mr-1 w-10 h-10 text-center bg-white rounded-full flex justify-center text-2xl items-center">
            <i
              :class="{
                'fa-gradient-yellow fa-trophy': i === 0,
                'fa-gradient-gray fa-trophy': i === 1,
                'fa-gradient-brown fa-trophy': i === 2,
                'fa-gradient-blue fa-award': i >= 3,
              }"
              class="fas"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="text-center my-4">
    <a href="/"><base-button mode="hover:opacity-75">{{ $t('game.back-start') }}</base-button></a>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['totalScores'],
  computed: {
    ...mapGetters(['gameData']),
  },
};
</script>

<style scoped>
.text-small {
  font-size: 0.65rem;
}

.fa-stack[data-count]:after {
  position: absolute;
  right: -10%;
  top: -15%;
  content: attr(data-count);
  font-size: 50%;
  padding: 0.6em;
  border-radius: 999px;
  line-height: 0.75em;
  color: white;
  background: #e53e3e;
  text-align: center;
  min-width: 2em;
  font-weight: bold;
}

.fa-gradient-brown {
  background: -webkit-gradient(linear, left top, left bottom, from(#d69e2e), to(#975a16));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.fa-gradient-gray {
  background: -webkit-gradient(linear, left top, left bottom, from(#e2e8f0), to(#a0aec0));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.fa-gradient-yellow {
  background: -webkit-gradient(linear, left top, left bottom, from(#f6e05e), to(#b7791f));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.fa-gradient-blue {
  background: -webkit-gradient(linear, left top, left bottom, from(#3182ce), to(#2c5282));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

span {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
