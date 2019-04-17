<template>
  <h1>{{ message }}</h1>
</template>

<script>


export default {
  name: 'page2',

  data() {
    return {
      message: 'Hello, page2!'
    };
  }
};
</script>
<style scoped>
	h1{
		background: #ff0;
	}
</style>