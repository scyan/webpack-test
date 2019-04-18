<template>
  <div>
  <h1>{{message}}</h1>
</div>
</template>

<script>


export default {
  name: 'app',

  data() {
    return {
      message: '我是一个组件'
    };
  }
};
</script>
<style scoped>
	div{
		background: #ff0;
    h1{
      color: #f00;
    }
	}
</style>