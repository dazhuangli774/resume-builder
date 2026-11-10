import Vue from 'vue'
import VueRouter from 'vue-router'
// ... 其他导入
import Home from '../views/Home.vue'
import Templates from '../views/Templates.vue'
import About from '../views/About.vue'
import UserGuide from '../views/UserGuide.vue'
// ... 导入登录、注册等

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/templates', name: 'Templates', component: Templates },
  { path: '/about', name: 'About', component: About },
  { path: '/guide', name: 'UserGuide', component: UserGuide },
  // ... 其他路由 (登录、注册、编辑器等)
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router