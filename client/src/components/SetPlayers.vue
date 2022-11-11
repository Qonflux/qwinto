<template>
  <label class="mt-4 text-white">{{ $t('start.players-question') }}</label>
  <div class="flex">
    <div class="select-none border py-2 px-4 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-l" @click="decrease">-</div>
    <input
      class="border p-2 w-full text-center outline-none"
      type="number"
      v-model="number"
      readonly
    />
    <div class="select-none border py-2 px-4 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-r" @click="increase">+</div>
  </div>
</template>

<script>
export default {
  props: ['players'],
  emits: ['plus', 'min'],
  data() {
    return {
      number: this.players,
    };
  },
  methods: {
    increase() {
      if (this.number < 6) {
        this.number++;
        this.$emit('plus');
      }
    },
    decrease() {
      if (this.number > 2) {
        this.number--;
        this.$emit('min');
      }
    }
  }
};
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>