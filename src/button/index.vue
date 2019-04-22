<template>
  <div>
    <h1>{{ message }}</h1>
  </div>
</template>

<script>


export default {
  name: 'App',

  data () {
    return {
      message: 'button'
    };
  }
};
</script>
<style scoped>
  div{
    h1{
      background: #ff0;
      color: #f00;
      width: 200px;
    }
  }
</style>
