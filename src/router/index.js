import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import index from '../page/index.vue'
import 'vuetify/dist/vuetify.min.css'
import collection from '../page/collection'
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {path: '/', component: index},
    {path:'/collection',component:collection}
  ]
})
