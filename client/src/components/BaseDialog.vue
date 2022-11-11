<template>
  <teleport to="body">
    <div v-if="show" class="fixed top-0 left-0 h-screen w-full z-10 bg-black bg-opacity-75" @click="$emit('close')"></div>
    <transition name="dialog">
      <dialog class="fixed p-0 m-0 w-4/5 z-50 rounded-lg overflow-hidden" open v-if="show">
        <header :class="bgColor" class="p-4 text-white w-full flex">
          <slot name="header">
            <h2 class="m-0">{{ title }}</h2>
          </slot>
          <div class="ml-auto font-bold cursor-pointer" @click="$emit('close')">X</div>
        </header>
        <section class="p-4">
          <slot></slot>
        </section>
        <menu class="p-4 m-0 flex justify-end">
          <slot name="actions">
          </slot>
        </menu>
      </dialog>
    </transition>  
  </teleport>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false
    },
    type: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    } 
  },
  emits: ['close'],
  computed: {
    bgColor() {
      if (this.type === 'error') {
        return 'bg-red-600';
      } else if (this.type === 'confirm') {
        return 'bg-orange-500';
      }
      return 'bg-green-600';
    }
  }
};
</script>

<style scoped>
dialog {
  top: 10vh;
  left: 10%;
}

@media (min-width: 768px) {
  dialog {
    left: calc(50% - 20rem);
    width: 40rem;
  }
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: translateY(-50px) scale(0.8);
}

.dialog-enter-active {
  transition: all 0.3s ease-out;
}

.dialog-leave-active {
  transition: all 0.3s ease-in;
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>