import {
  PageView
} from '@/layouts'

export default {
  path: '/basicSet',
  name: 'basicSet',
  component: PageView,
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
    }

  ]
}
