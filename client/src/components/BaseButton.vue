<template>
  <button :class="mode" class="bg-gray-600 text-white font-bold py-2 px-4 border-b-4 border-gray-700 rounded">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: ['mode']
};
</script>