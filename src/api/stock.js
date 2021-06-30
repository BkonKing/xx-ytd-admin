import request from '@/utils/request'

export const stock = {
  stockList: '/operate/stock/stockList',
  addStock: '/operate/stock/addStock',
  updateStock: '/operate/stock/updateStock',
  removeStock: '/operate/stock/removeStock',
  stockInfo: '/operate/stock/stockInfo',
  stockInfo: '/operate/stock/stockInfo',
  auditBatchstock: '/operate/stock/auditBatchstock',
  getstockPayBystockId: '/operate/stock/getstockPayBystockId',
  addStockPay: '/operate/stock/addStockPay',
  updateStockPay: '/operate/stock/updateStockPay',
  removeStockPay: '/operate/stock/removeStockPay'
}

// 获取库存列表接口
export function getStockList (params) {
  return request({
    url: stock.stockList,
    method: 'get',
    params
  })
}

// 创建库存规格型号接口
export function addStock (data) {
  return request({
    url: stock.addStock,
    method: 'post',
    data
  })
}

// 修改库存规格型号接口
export function updateStock (data) {
  return request({
    url: stock.updateStock,
    method: 'post',
    data
  })
}

// 删除订单接口
export function removeStock (data) {
  return request({
    url: stock.removeStock,
    method: 'post',
    data
  })
}

// 库存详情接口
export function getStockInfo (data) {
  return request({
    url: stock.stockInfo,
    method: 'post',
    data
  })
}

// 获取订单详情接口
export function getstockInfo (params) {
  return request({
    url: stock.stockInfo,
    method: 'get',
    params
  })
}

// 批量审核订单接口
export function auditBatchstock (data) {
  return request({
    url: stock.auditBatchstock,
    method: 'post',
    data
  })
}

// 订单详情付款列表接口
export function getstockPayBystockId (params) {
  return request({
    url: stock.getstockPayBystockId,
    method: 'get',
    params
  })
}

// 创建订单付款接口
export function addstockPay (data) {
  return request({
    url: stock.addstockPay,
    method: 'post',
    data
  })
}

// 修改订单付款接口(
export function updateStockPay (data) {
  return request({
    url: stock.updateStockPay,
    method: 'post',
    data
  })
}

// 删除订单付款接口
export function removestockPay (data) {
  return request({
    url: stock.removestockPay,
    method: 'post',
    data
  })
}
