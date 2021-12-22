import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 路由表
const routes = [{
  path: '/login',
  name: 'login',
  // 路由懒加载
  component: () => import('@/views/login')
}, {
  path: '/',
  // name: 'layout', // 如果父路由由默认子路由 那他的name没有意义
  // 路由懒加载
  component: () => import('@/views/layout'),
  children: [{
    path: '/',
    name: 'home',
    // 路由懒加载
    component: () => import('@/views/home')
  },
  {
    path: '/qa',
    name: 'qa',
    // 路由懒加载
    component: () => import('@/views/qa')
  },
  {
    path: '/video',
    name: 'video',
    // 路由懒加载
    component: () => import('@/views/video')
  },
  {
    path: '/my',
    name: 'my',
    // 路由懒加载
    component: () => import('@/views/my')
  }
  ]
}, {
  path: '/search',
  name: 'search',
  // 路由懒加载
  component: () => import('@/views/search')
}, {
  path: '/article/:articleId',
  name: 'article',
  // 路由懒加载
  component: () => import('@/views/article'),
  props: true // 开启props 传参 说白就是把路由参数映射到组件的方式
}, {
  path: '/user/profile',
  name: 'user-profile',
  // 路由懒加载
  component: () => import('@/views/user-profile')
}]

const router = new VueRouter({
  routes
})

export default router
