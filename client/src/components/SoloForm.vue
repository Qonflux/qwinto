<template>
  <form @submit.prevent="emitData" class="w-full my-6 text-center">
    <div>
      <label class="text-white">{{ $t('general.name') }}:</label>
      <input
        type="text"
        class="w-full border px-4 py-2 rounded focus:border-blue-500 focus:shadow-outline outline-none text-center"
        autocomplete="off"
        :placeholder="$t('start.username')"
        maxlength="25"
        v-model="name"
        autofocus
        required
      />
    </div>
    <div class="text-center mt-4">
      <base-button type="submit" mode="hover:opacity-75">{{ $t('start.start-game') }}</base-button>
    </div>
  </form>
</template>

<script>
export default {
  emits: ["start"],
  data() {
    return {
      name: this.$store.getters.storedName || ''
    };
  },
  methods: {
    emitData() {
      localStorage.setItem('name', this.name);
      this.$store.dispatch('storeName', this.name);
      this.$emit('start', { name: this.name })
    }
  }
};
</script>
