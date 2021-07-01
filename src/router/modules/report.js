import {
  RouteView
} from '@/layouts'

export default {
  path: '/report',
  name: 'report',
  component: RouteView,
  meta: {
    title: '报表中心'
  },
  children: [{
    path: '/report/paid',
    name: 'reportPaid',
    component: () => import('@/views/report/paid'),
    meta: {
      title: '付款明细'
    }
  },
  {
    path: '/report/invoiced',
    name: 'reportInvoiced',
    component: () => import('@/views/report/invoiced'),
    meta: {
      title: '开票明细'
    }
  },
  {
    path: '/report/contract',
    name: 'reportContract',
    component: () => import('@/views/report/contract'),
    meta: {
      title: '合同表'
    }
  },
  {
    path: '/report/supplier',
    name: 'reportSupplier',
    component: () => import('@/views/report/supplier'),
    meta: {
      title: '供应商表'
    }
  },
  {
    path: '/report/material',
    name: 'reportMaterial',
    component: () => import('@/views/report/material'),
    meta: {
      title: '物料价格表'
    }
  },
  {
    path: '/report/stock',
    name: 'reportStock',
    component: () => import('@/views/report/stock'),
    meta: {
      title: '库存表'
    }
  }
  ]
}
