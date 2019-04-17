<template>
  <h1>{{ message }}</h1>
</template>

<script>
import {test} from 'utils';

export default {
  name: 'app',
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