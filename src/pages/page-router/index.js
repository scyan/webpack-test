
import Vue from 'vue';
// import App from './index.vue';
import VueRouter from 'vue-router';
import router from './router';

Vue.use(VueRouter)

new Vue({
  el: '#app',
  router,
  render: h => h('router-view')
  // render: h => h(App)
})