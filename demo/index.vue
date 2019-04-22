<template>
  <div>
    
    <h1>{{message}}</h1>
    <Button/>
  </div>
</template>

<script>

import {Button} from '@hy/components';
export default {
  name: 'app',
  components:{
    Button
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