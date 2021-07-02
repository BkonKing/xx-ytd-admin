import {
  RouteView
} from '@/layouts'

export default {
  path: '/basicSet',
  name: 'basicSet',
  component: RouteView,
  meta: {
    title: '基础设置',
    icon: 'table'
  },
  redirect: '/basicSet/informationSet',
  children: [
    {
      path: '/basicSet/informationSet',
      name: 'informationSet',
      component: () => import('@/views/basicSet/informationSet'),
      meta: {
        title: '消息设置',
        icon: 'table'
      }
    },
    {
      path: '/basicSet/editContent',
      name: 'editContent',
      component: () => import('@/views/basicSet/editContent'),
      meta: {
        title: '编辑内容',
        icon: 'table'
      }
    },
    {
      path: '/basicSet/checkSet',
      name: 'checkSet',
      component: () => import('@/views/basicSet/checkSet'),
      meta: {
        title: '审批设置',
        icon: 'table'
      }
    },
    {
      path: '/basicSet/materialSort',
      name: 'materialSort',
      component: () => import('@/views/basicSet/materialSort'),
      meta: {
        title: '物料设置',
        icon: 'table'
      }
    },
    {
      path: '/basicSet/contractSet',
      name: 'contractSet',
      component: () => import('@/views/basicSet/contractSet'),
      meta: {
        title: '合同设置',
        icon: 'table'
      }
    }

  ]
}
