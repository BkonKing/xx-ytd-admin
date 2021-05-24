import Vue from 'vue'
import Router from 'vue-router'
import {
  UserLayout,
  BasicLayout
  // BlankLayout
} from '@/layouts'
// import userRoutes from './modules/user'

Vue.use(Router)

const asyncRoutes = []

const moduleRoutes = require.context('./modules', true, /\.js$/)

moduleRoutes.keys().forEach((name) => {
  asyncRoutes.push(moduleRoutes(name).default)
})
export {
  asyncRoutes
}

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRoutes = [{
  path: '/user',
  component: UserLayout,
  redirect: '/user/login',
  hidden: true,
  children: [{
    path: 'login',
    name: 'login',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
  }]
},

{
  path: '/',
  name: 'index',
  component: BasicLayout,
  hideChildrenInMenu: true,
  meta: {
    title: '首页'
  },
  redirect: 'home',
  children: [{
    path: '/home',
    name: 'home',
    component: () => import('@/views/user/home'),
    meta: {
      title: '首页',
      icon: 'table'
    }
  }].concat(asyncRoutes)
},

{
  path: '/404',
  component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
}
]

// 找不到路由则显示404
const errorRoute = [{
  path: '*',
  redirect: '/404',
  hidden: true
}]

export default new Router({
  mode: process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true' ? 'history' : 'hash',
  routes: constantRoutes.concat(errorRoute)
})
