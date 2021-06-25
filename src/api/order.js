import request from '@/utils/request'

export const order = {
  getOrderList: '/operate/order/orderList',
  addOrder: '/operate/order/addOrder',
  updateOrder: '/operate/order/updateOrder',
  removeOrder: '/operate/order/removeOrder',
  auditOrder: '/operate/order/auditOrder',
  orderInfo: '/operate/order/orderInfo',
  auditBatchOrder: '/operate/order/auditBatchOrder',
  getOrderPayByOrderId: '/operate/order/getOrderPayByOrderId',
  addOrderPay: '/operate/order/addOrderPay',
  updateOrderPay: '/operate/order/updateOrderPay',
  removeOrderPay: '/operate/order/removeOrderPay'
}

// 获取订单列表接口
export function getOrderList (params) {
  return request({
    url: order.getOrderList,
    method: 'get',
    params
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

// 获取订单详情接口
export function getOrderInfo (params) {
  return request({
    url: order.orderInfo,
    method: 'get',
    params
  })
}

// 批量审核订单接口
export function auditBatchOrder (data) {
  return request({
    url: order.auditBatchOrder,
    method: 'post',
    data
  })
}

// 订单详情付款列表接口
export function getOrderPayByOrderId (params) {
  return request({
    url: order.getOrderPayByOrderId,
    method: 'get',
    params
  })
}

// 创建订单付款接口
export function addOrderPay (data) {
  return request({
    url: order.addOrderPay,
    method: 'post',
    data
  })
}

// 修改订单付款接口(
export function updateOrderPay (data) {
  return request({
    url: order.updateOrderPay,
    method: 'post',
    data
  })
}

// 删除订单付款接口
export function removeOrderPay (data) {
  return request({
    url: order.removeOrderPay,
    method: 'post',
    data
  })
}
