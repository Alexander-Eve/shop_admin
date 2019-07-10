import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './views/Login.vue'
import Index from './views/Index.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/index' },
    //  可以设置给路由设置一个name属性连式编程时可以通过name属性跳转页面
    { path: '/index', component: Index, name: 'index' },
    { path: '/login', component: Login, name: 'login' }
  ]
})
//  导航守卫全局守卫
router.beforeEach((to, from, next) => {
  //  to   往哪儿去
  //  from 从哪儿来
  //  next() 想走就走，不想就留下 是一个回调函数
  console.log('to', to)
  console.log('from', from)
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
