import request from '@/utils/request'

export const order = {
  getOrderList: '/operate/order/orderList',
  addOrder: '/operate/order/addOrder',
  updateOrder: '/operate/order/updateOrder',
  removeOrder: '/operate/order/removeOrder',
  auditOrder: '/operate/order/auditOrder'
}

// 获取订单列表接口
export function getOrderList (data) {
  return request({
    url: order.getOrderList,
    method: 'post',
    data
  })
}

// 创建订单接口
export function addOrder (data) {
  return request({
    url: order.addOrder,
    method: 'post',
    data
  })
}

// 创建订单接口
export function updateOrder (data) {
  return request({
    url: order.updateOrder,
    method: 'post',
    data
  })
}

// 删除订单接口
export function removeOrder (data) {
  return request({
    url: order.removeOrder,
    method: 'post',
    data
  })
}

// 审核订单接口
export function auditOrder (data) {
  return request({
    url: order.auditOrder,
    method: 'post',
    data
  })
}
