import {
  RouteView
} from '@/layouts'

export default {
  path: '/project',
  name: 'project',
  component: RouteView,
  redirect: '/project/index',
  meta: {
    title: '项目管理'
  },
  hideChildrenInMenu: true,
  children: [
    {
      path: '/project/index',
      name: 'ProjectIndex',
      component: () => import('@/views/project/index'),
      meta: {
        title: '项目列表',
        hidden: true,
        keepAlive: true
      }
    },
    {
      path: '/project/index1',
      name: 'ProjectIndex1',
      redirect: '/project/index',
      component: RouteView,
      meta: {
        title: '项目列表',
        hidden: true
      },
      children: [
        {
          path: '/project/detail',
          name: 'ProjectDetail',
          component: () => import('@/views/project/detail'),
          meta: {
            title: '项目详情',
            selectedKey: '/project',
            hidden: true
          }
        }
      ]
    }
  ]
}
