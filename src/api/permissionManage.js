import request from '@/utils/request'

export const permissionApi = {
  getRoles: '/system/roles/getRoles',
  getAllotsMenus: '/system/roles/getAllotsMenus',
  updateBatchRole: '/system/roles/updateBatchRole',
  removeBatchRole: '/system/roles/removeBatchRole'

}
// 角色管理接口(已验证)
export function toGetRoles () {
  return request({
    url: permissionApi.getRoles,
    method: 'post'
  })
}
// 批量添加/编辑角色接口(已验证)
export function toUpdateBatchRole (data) {
  return request({
    url: permissionApi.updateBatchRole,
    method: 'post',
    data
  })
}
// 批量删除角色接口(已验证)
export function toRemoveBatchRole (data) {
  return request({
    url: permissionApi.removeBatchRole,
    method: 'post',
    data
  })
}
