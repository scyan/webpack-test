<template>
	<div>
	  <h1>{{ message }}</h1>
	  <Comp/>
	</div>
</template>

<script>
import {test} from 'utils';
import Comp from '@hy/component';
export default {
  name: 'app',
  components:{
  	Comp
  },
  async created(){
		console.log('dsds')
		console.log(await test())
  },
  data() {
    return {
      message: 'Hello, V!'
    };
  }
};
</script>
<style>
	body{
		background: #f00;
	}
</style>