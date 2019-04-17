<template>
  <div>{{ message }}</div>
</template>

<script>


export default {
  name: 'page1',

  data() {
    return {
      message: 'Hello, page1!'
    };
  }
};
</script>
<style scoped>
	h1{
		background: #f00;
	}
</style>