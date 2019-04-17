
// import Vue from 'vue';
import VueRouter from 'vue-router';

import index from './index.vue';
import page1 from './page1.vue';
import page2 from './page2.vue';
const router = new VueRouter({
	mode:'hash',
    // 指定路由选中时的样式类名
    linkActiveClass: 'active',
    // hashbang: true, // 将路径格式化为#!开头
    // history: true, // 启用HTML5 history模式，可以使用pushState和replaceState来管理记录
    /**
     * 4.@desc 路由配置配置具体的路径
     */
    routes: [
    	{
    		path:'/',
    		component: index
    	},
        {
            path: '/page1',
            component: page1
        },
        {
            path: '/page2',
            component: page2
        },
  
    ]

})

export default router;