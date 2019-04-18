<template>
  <div>
    
    <h1>{{message}}</h1>
    <Comp/>
  </div>
</template>

<script>

import Comp from '@hy/components';
export default {
  name: 'app',
  components:{
    Comp
  },
  data() {
    return {
      message: '我是一个demo'
    };
  }
};
</script>
<style scoped>
	h1{
		background: #f00;
	}
</style>