<template>
  <teleport to="#app">
    <div class="mt-5">
      <p class="loading text-center text-3xl text-white">
        {{ $t('start.more-players') }}
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </p>
      <div v-if="time" class="text-white text-center">
        <p class="text-m mt-1">{{ $t('start.begins-in') }}:</p>
        <p class="loading text-xl">{{ time }}</p>
      </div>
      <p v-if="!time" class="loading text-center text-xs text-white">{{ $t('start.begins-when') }}</p>
      <div class="mx-auto mt-4 items-center max-w-xs p-3 text-center bg-gray-300 rounded">
        <ul>
          <li v-for="(user, i) in users" :key="user" :class="{ 'text-orange-600 font-bold': user === username }">
            {{ i + 1 }}. {{ user }}
          </li>
        </ul>
      </div>
      <div class="mx-auto tems-center max-w-xs p-3 text-center">
        <a href="/">
        <base-icon
          type="fa-gradient-red"
          icon="fa-backward"
        ></base-icon>
        </a>
      </div>
    </div>
  </teleport>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  props: ['username'],
  emits: ['start-game'],
  data() {
    return {
      users: [],
      time: null,
      timer: null,
    };
  },
  methods: {
    ...mapActions(['setId', 'setName']),
  },
  computed: {
    ...mapGetters(['socket']),
    numPlayers() {
      return this.users.length;
    },
  },
  watch: {
    numPlayers(_, oldValue) {
      if (this.numPlayers === 2 && oldValue === 1) {
        this.time = 30;
        this.socket.emit('time', this.time);
        this.timer = setInterval(() => {
          this.time--;
          if (this.time === 0) {
            clearInterval(this.timer);
            this.socket.emit('startGame');
          }
        }, 1000);
      } else if (this.numPlayers < 2) {
        clearInterval(this.timer);
        this.time = null;
      } else if (this.numPlayers > 2 && this.time) {
        this.socket.emit('time', this.time);
      }
    },
  },
  created() {
    this.socket.on('startGame', () => {
      let id = this.users.indexOf(this.username);
      this.setId({ id });
      this.setName(this.username);
      this.$emit('start-game', this.users);
    });

    this.socket.on('roomData', ({ users }) => {
      this.users = users;
    });

    this.socket.on('time', time => {
      if (!this.time) {
        this.time = time;
        this.timer = setInterval(() => {
          this.time--;
          if (this.time === 0) {
            clearInterval(this.timer);
            this.socket.emit('startGame');
          }
        }, 1000);
      }
    });

    if (this.username) {
      this.socket.emit('join', { username: this.username });
    }
  },
};
</script>

<style>
@keyframes blink {
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

.loading span {
  animation-name: blink;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}

.loading span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading span:nth-child(3) {
  animation-delay: 0.4s;
}
</style>
