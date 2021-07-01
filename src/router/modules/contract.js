import {
  RouteView
} from '@/layouts'

export default {
  path: '/contract',
  name: 'contract',
  component: RouteView,
  redirect: '/contract/index',
  meta: {
    title: '合同管理'
  },
  hideChildrenInMenu: true,
  children: [
    {
      path: '/contract/index',
      name: 'ContractIndex',
      component: () => import('@/views/contract/index'),
      meta: {
        title: '合同',
        hidden: true
      }
    },
    {
      path: '/contract/index1',
      name: 'contractIndex1',
      redirect: '/contract/index',
      component: RouteView,
      meta: {
        title: '合同',
        hidden: true
      },
      children: [
        {
          path: '/contract/edit',
          name: 'ContractEdit',
          component: () => import('@/views/contract/edit'),
          meta: {
            title: '合同编辑',
            selectedKey: '/contract',
            hidden: true
          }
        },
        {
          path: '/contract/detail',
          name: 'ContractDetail',
          component: () => import('@/views/contract/detail'),
          meta: {
            title: '合同详情',
            selectedKey: '/contract',
            hidden: true
          }
        }
      ]
    }
  ]
}
