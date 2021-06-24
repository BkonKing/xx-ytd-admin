import request from '@/utils/request'

export const permissionApi = {
  getRoles: '/system/roles/getRoles',
  getAllotsMenus: '/system/roles/getAllotsMenus',
  updateBatchRole: '/system/roles/updateBatchRole',
  removeBatchRole: '/system/roles/removeBatchRole',
  removeRole: '/system/roles/removeRole',
  updateAllotsMenus: '/system/roles/updateAllotsMenus',
  getAdminList: '/system/admin/getAdminList'

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
// 删除角色接口(已验证)
export function toRemoveRole (data) {
  return request({
    url: permissionApi.removeRole,
    method: 'post',
    data
  })
}
// 角色对应的菜单数据接口(已验证)
export function toGetAllotsMenus (params) {
  return request({
    url: permissionApi.getAllotsMenus,
    method: 'get',
    params
  })
}
// 配置角色对应的权限接口(已验证)
export function toUpdateAllotsMenus (data) {
  return request({
    url: permissionApi.updateAllotsMenus,
    method: 'post',
    data
  })
}
// 人员列表接口(已验证)
export function toGetAdminList (params) {
  return request({
    url: permissionApi.getAdminList,
    method: 'post',
    params
  })
}
