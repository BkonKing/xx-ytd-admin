import {
  RouteView
} from '@/layouts'

export default {
  path: '/project',
  name: 'project',
  component: RouteView,
  meta: {
    title: '项目管理',
    icon: 'table'
  },
  children: [
    {
      path: '/project/index',
      name: 'ProjectIndex',
      component: () => import('@/views/project/index'),
      meta: {
        title: '项目管理',
        icon: 'table'
      }
    },
    {
      path: '/project/detail',
      name: 'ProjectDetail',
      component: () => import('@/views/project/detail'),
      meta: {
        title: '项目详情',
        icon: 'table'
      }
    }
  ]
}
