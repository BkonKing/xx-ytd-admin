import request from '@/utils/request'

export const userApi = {
  Login: '/system/slognin/login',
  Logout: '/system/slognin/logout',
  UserInfo: '/public/common/getAccountInfo',
  updateBasicSet: '/system/account/updateBasicSet',
  updateSecuritySet: '/system/account/updateSecuritySet',
  UserMenu: '/system/menus/getMenus',
  bdCode: '/public/common/bdCode',
  uploadImg: '/file/uploads/uImages'
}

/**
 * 登录
 * data: {
 *     username: '',
 *     password: '',
 * }
 * @param data
 * @returns {*}
 */
export function login (data) {
  return request({
    url: userApi.Login,
    method: 'post',
    data
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'post'
  })
}

export function updateBasicSet (data) {
  return request({
    url: userApi.updateBasicSet,
    method: 'post',
    data
  })
}

export function updateSecuritySet (data) {
  return request({
    url: userApi.updateSecuritySet,
    method: 'post',
    data
  })
}

export function getDdCode (data) {
  return request({
    url: userApi.bdCode,
    method: 'post',
    data
  })
}

export function uploadImg (data) {
  console.log(data)
  return request({
    url: userApi.uploadImg,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function getMenu () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post'
  })
}
