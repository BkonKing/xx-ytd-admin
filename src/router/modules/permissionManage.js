import {
  PageView
} from '@/layouts'

export default {
  path: '/permissionManage',
  name: 'permissionManage',
  component: PageView,
  meta: {
    title: '权限管理',
    icon: 'table'
  },
  redirect: '/permissionManage/personList',
  children: [
    {
      path: '/permissionManage/personList',
      name: 'personList',
      component: () => import('@/views/permissionManage/personList'),
      meta: {
        title: '人员列表',
        icon: 'table'
      }
    },
    {
      path: '/permissionManage/roleManage',
      name: 'roleManage',
      component: () => import('@/views/permissionManage/roleManage'),
      meta: {
        title: '角色管理',
        icon: 'table'
      }
    }
  ]
}
