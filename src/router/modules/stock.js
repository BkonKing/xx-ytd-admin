import {
  RouteView
} from '@/layouts'

export default {
  path: '/stock',
  name: 'stock',
  component: RouteView,
  redirect: '/stock/index',
  meta: {
    title: '库存管理'
  },
  children: [
    {
      path: '/stock/index',
      name: 'stockIndex',
      component: () => import('@/views/stock/index'),
      meta: {
        title: '库存列表'
      }
    },
    {
      path: '/stock/index1',
      name: 'stockIndex1',
      redirect: '/stock/index',
      component: RouteView,
      hidden: true,
      meta: {
        title: '库存列表'
      },
      children: [
        {
          path: '/stock/detail',
          name: 'stockDetail',
          component: () => import('@/views/stock/detail'),
          meta: {
            title: '库存详情',
            selectedKey: '/stock/index',
            hidden: true
          }
        }
      ]
    },
    {
      path: '/stock/record',
      name: 'stockRecord',
      component: () => import('@/views/stock/record'),
      meta: {
        title: '出入库记录'
      }
    },
    {
      path: '/stock/record1',
      name: 'stockRecord1',
      redirect: '/stock/record',
      component: RouteView,
      meta: {
        title: '出入库记录'
      },
      hidden: true,
      children: [
        {
          path: '/stock/edit',
          name: 'stockEdit',
          component: () => import('@/views/stock/edit'),
          meta: {
            title: '库存编辑',
            selectedKey: '/stock/record',
            hidden: true
          }
        }
      ]
    }
  ]
}
