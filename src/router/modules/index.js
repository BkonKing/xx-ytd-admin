// eslint-disable-next-line
import {
  // UserLayout,
  // BasicLayout,
  // BlankLayout,
  RouteView
} from '@/layouts'

export default [
  // dashboard
  {
    path: '/dashboard/workplace',
    name: 'Workplace',
    // redirect: '/dashboard/workplace',
    component: () => import('@/views/dashboard/Workplace'),
    hidden: true,
    meta: {
      title: '工作台'
    }
  },
  {
    path: '/MessageCenter/index',
    name: 'MessageCenterIndex',
    component: () => import('@/views/user/MessageCenter'),
    meta: {
      title: '消息中心'
    }
  }
]
