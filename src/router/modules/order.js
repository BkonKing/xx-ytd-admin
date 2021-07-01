import {
  RouteView
} from '@/layouts'

export default {
  path: '/order',
  name: 'order',
  component: RouteView,
  redirect: '/order/index',
  meta: {
    title: '订单管理'
  },
  hideChildrenInMenu: true,
  children: [
    {
      path: '/order/index',
      name: 'OrderIndex',
      component: () => import('@/views/order/index'),
      meta: {
        title: '订单',
        hidden: true
      }
    },
    {
      path: '/order/index1',
      name: 'orderIndex1',
      redirect: '/order/index',
      component: RouteView,
      meta: {
        title: '订单',
        hidden: true
      },
      children: [
        {
          path: '/order/edit',
          name: 'OrderEdit',
          component: () => import('@/views/order/edit'),
          meta: {
            title: '订单编辑',
            selectedKey: '/order',
            hidden: true
          }
        },
        {
          path: '/order/detail',
          name: 'OrderDetail',
          component: () => import('@/views/order/detail'),
          meta: {
            title: '订单详情',
            selectedKey: '/order',
            hidden: true
          }
        }
      ]
    }
  ]
}
