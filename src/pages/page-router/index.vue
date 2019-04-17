<template>
  <h2> <router-link to="/page2">商品</router-link> </h2>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      message: 'Hello, Vue!'
    };
  }
};
</script>
<style scoped>
	h1{
		background: #f00;
	}
</style>