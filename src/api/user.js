import request from '@/utils/request'

export const userApi = {
  Login: '/system/slognin/login',
  Logout: '/auth/logout',
  UserInfo: '/user/info',
  UserMenu: '/user/nav'
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

export function getSmsCaptcha (data) {
  return request({
    url: userApi.Logout,
    method: 'post',
    data
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get'
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
