import request from '@/utils/request'

export const loginApi = {
  Login: '/system/slognin/login',
  outLogin: '/system/slognin/outlogin'
}
// 登录
export function login (data) {
  return request({
    url: loginApi.Login,
    method: 'post',
    data
  })
}
// 退出登录
export function logout () {
  return request({
    url: loginApi.outLogin,
    method: 'post'
  })
}
