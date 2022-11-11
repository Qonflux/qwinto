<template>
  <div class="inline-block text-center text-small m-2 cursor-pointer">
    <span class="fa-stack fa-2x" :data-count="number">
      <i class="fas fa-circle fa-stack-2x"></i>
      <i class="fas fa-stack-1x" :class="type + ' ' + icon"></i>
    </span>
  </div>
</template>

<script>
export default {
  props: ['type', 'number', 'icon']
};
</script>

<style scoped>
.text-small {
  font-size: 0.65rem;
}

.fa-stack[data-count]:after{
  position: absolute;
  right: -10%;
  top: -15%;
  content: attr(data-count);
  font-size: 50%;
  padding: .6em;
  border-radius: 999px;
  line-height: .75em;
  color:  white;
  background: #e53e3e;
  text-align: center;
  min-width: 2em;
  font-weight: bold;
}

.fa-gradient-red {
  background: -webkit-gradient(linear, left top, left bottom, from(#e53e3e), to(#742a2a));
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

.fa-gradient-purple {
  background: -webkit-gradient(linear, left top, left bottom, from(#805ad5), to(#6b46c1));
  background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.fa-gradient-green {
  background: -webkit-gradient(linear, left top, left bottom, from(#9ae6b4), to(#276749));
  background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}
</style>
