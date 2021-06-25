import request from '@/utils/request'

export const permissionApi = {
  getRoles: '/system/roles/getRoles',
  getAllotsMenus: '/system/roles/getAllotsMenus',
  updateBatchRole: '/system/roles/updateBatchRole',
  removeBatchRole: '/system/roles/removeBatchRole',
  removeRole: '/system/roles/removeRole',
  updateAllotsMenus: '/system/roles/updateAllotsMenus',
  getAdminList: '/system/admin/getAdminList',
  addAdmin: '/system/admin/addAdmin',
  removeAdmin: '/system/admin/removeAdmin',
  updateAdmin: '/system/admin/updateAdmin',
  getAdminMenus: '/system/admin/getAllotsMenus',
  updateAdminMenus: '/system/admin/updateAllotsMenus',
  getAllRoles: '/public/common/getAllRoles'
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

// 新增人员接口(已验证)
export function toAddAdmin (data) {
  return request({
    url: permissionApi.addAdmin,
    method: 'post',
    data
  })
}
// 删除人员接口(已验证)
export function toRemoveAdmin (data) {
  return request({
    url: permissionApi.removeAdmin,
    method: 'post',
    data
  })
}
// 修改人员接口(已验证)
export function toUpdateAdmin (data) {
  return request({
    url: permissionApi.updateAdmin,
    method: 'post',
    data
  })
}
// 管理员对应的菜单数据接口(已验证)
export function toGetAdminMenus (params) {
  return request({
    url: permissionApi.getAdminMenus,
    params
  })
}
// 配置管理员对应的权限接口(已验证)
export function toUpdateAdminMenus (data) {
  return request({
    url: permissionApi.updateAdminMenus,
    method: 'post',
    data
  })
}
// 获取所有角色接口(已验证)
export function getAllRoles () {
  return request({
    url: permissionApi.getAllRoles,
    method: 'post'
  })
}
