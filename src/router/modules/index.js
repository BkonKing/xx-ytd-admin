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
      title: '工作台',
      keepAlive: true
    }
  },
  {
    path: '/contract',
    name: 'Contract',
    component: RouteView,
    meta: {
      title: '合同管理',
      keepAlive: true
    },
    children: [{
      path: '/contract/index',
      name: 'ContractIndex',
      component: () => import('@/views/contract/index'),
      meta: {
        title: '合同',
        keepAlive: true
      }
    }, {
      path: '/contract/edit',
      name: 'ContractEdit',
      component: () => import('@/views/contract/edit'),
      meta: {
        title: '合同编辑'
      }
    }, {
      path: '/contract/detail',
      name: 'ContractDetail',
      component: () => import('@/views/contract/detail'),
      meta: {
        title: '合同详情'
      }
    }]
  },
  {
    path: '/order',
    name: 'Order',
    component: RouteView,
    meta: {
      title: '订单管理',
      keepAlive: true
    },
    children: [
      {
        path: '/order/index',
        name: 'OrderIndex',
        component: () => import('@/views/order/index'),
        meta: {
          title: '订单列表',
          keepAlive: true
        }
      },
      {
        path: '/order/edit',
        name: 'OrderEdit',
        component: () => import('@/views/order/edit'),
        meta: {
          title: '订单编辑'
        }
      },
      {
        path: '/order/detail',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail'),
        meta: {
          title: '订单详情'
        }
      }
    ]
  },
  {
    path: '/supplier',
    name: 'Supplier',
    component: RouteView,
    meta: {
      title: '供应商管理',
      keepAlive: true
    },
    children: [
      {
        path: '/supplier/index',
        name: 'SupplierIndex',
        component: () => import('@/views/supplier/index'),
        meta: {
          title: '供应商',
          keepAlive: true
        }
      },
      {
        path: '/supplier/edit',
        name: 'SupplierEdit',
        component: () => import('@/views/supplier/edit'),
        meta: {
          title: '新增供应商'
        }
      },
      {
        path: '/supplier/detail',
        name: 'SupplierDetail',
        component: () => import('@/views/supplier/detail'),
        meta: {
          title: '供应商详情'
        }
      }
    ]
  },
  {
    path: '/stock',
    name: 'Supplier',
    component: RouteView,
    meta: {
      title: '库存管理'
    },
    children: [
      {
        path: '/stock/index',
        name: 'stockIndex',
        component: () => import('@/views/stock/index'),
        meta: {
          title: '库存列表',
          keepAlive: true
        }
      },
      {
        path: '/stock/record',
        name: 'stockRecord',
        component: () => import('@/views/stock/record'),
        meta: {
          title: '出入库记录',
          keepAlive: true
        }
      },
      // {
      //   path: '/stock/edit',
      //   name: 'stockEdit',
      //   component: () => import('@/views/stock/edit'),
      //   meta: {
      //     title: '新增库存',
      //     keepAlive: true
      //   }
      // },
      {
        path: '/stock/detail',
        name: 'stockDetail',
        component: () => import('@/views/stock/detail'),
        meta: {
          title: '库存详情'
        }
      }
    ]
  }
]
