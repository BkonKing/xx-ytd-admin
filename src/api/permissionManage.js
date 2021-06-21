import request from '@/utils/request'

export const permissionApi = {
  getRoles: '/system/roles/getRoles',
  getAllotsMenus: '/system/roles/getAllotsMenus'

}
// 角色管理接口(已验证)
export function toGetRoles () {
  return request({
    url: permissionApi.getRoles,
    method: 'post'
  })
}
