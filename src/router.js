import Vue from 'vue'
import axios from 'axios'
import VueRouter from 'vue-router'
import Login from './views/Login.vue'
import Index from './views/Index.vue'
import Users from './views/users/Users.vue'
import Rights from './views/rights/Rights.vue'
import Roles from './views/rights/Roles.vue'
import Categories from './views/product/Categories.vue'
import Goods from './views/product/Goods.vue'
import moment from 'moment'
import GoodsAdd from './views/product/Add.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/index' },
    { path: '/login', component: Login, name: 'login' },
    //  可以设置给路由设置一个name属性连式编程时可以通过name属性跳转页面
    {
      path: '/index',
      component: Index,
      name: 'index',
      children: [
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Categories },
        { path: '/goods', component: Goods },
        { path: '/goods-add', component: GoodsAdd }
      ]
    }
  ]
})
// 设置一个全局的过滤器
Vue.filter('dataFilter', value => {
  return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
})
//  导航守卫全局守卫
router.beforeEach((to, from, next) => {
  //  to   往哪儿去
  //  from 从哪儿来
  //  next() 想走就走，不想就留下 是一个回调函数
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
// 把axios绑定在Vue的原型上与Vue建立关联 优化代码
Vue.prototype.axios = axios

// 设置全局的axios的baseURL
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 使用拦截器设置统一的Authorization属性token
// 请求拦截
axios.interceptors.request.use(function (config) {
  // 统一配置token参数 在请求之前获取到的数据
  config.headers = {
    Authorization: localStorage.getItem('token')
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截
axios.interceptors.response.use(function (response) {
  // 在响应后获取的数据 直接返回res.data 优化太多点语法
  response = response.data
  return response
}, function (error) {
  return Promise.reject(error)
})
export default router
