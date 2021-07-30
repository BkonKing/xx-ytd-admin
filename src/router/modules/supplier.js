import {
  RouteView
} from '@/layouts'

export default {
  path: '/supplier',
  name: 'Supplier',
  component: RouteView,
  redirect: '/supplier/index',
  meta: {
    title: '供应商管理'
  },
  hideChildrenInMenu: true,
  children: [
    {
      path: '/supplier/index',
      name: 'SupplierIndex',
      component: () => import('@/views/supplier/index'),
      meta: {
        title: '供应商',
        hidden: true,
        keepAlive: true
      }
    },
    {
      path: '/supplier/index1',
      name: 'supplierIndex1',
      redirect: '/supplier/index',
      component: RouteView,
      meta: {
        title: '供应商',
        hidden: true
      },
      children: [
        {
          path: '/supplier/edit',
          name: 'SupplierEdit',
          component: () => import('@/views/supplier/edit'),
          meta: {
            title: '供应商编辑',
            selectedKey: '/supplier',
            hidden: true
          }
        },
        {
          path: '/supplier/detail',
          name: 'SupplierDetail',
          component: () => import('@/views/supplier/detail'),
          meta: {
            title: '供应商详情',
            selectedKey: '/supplier',
            hidden: true
          }
        }
      ]
    }
  ]
}
