import request from '@/utils/request'

export const stock = {
  stockList: '/operate/stock/stockList',
  addStock: '/operate/stock/addStock',
  updateStock: '/operate/stock/updateStock',
  removeStock: '/operate/stock/removeStock',
  stockInfo: '/operate/stock/stockInfo',
  stockClkList: '/operate/stock/stockClkList',
  stockClkInfo: '/operate/stock/stockClkInfo',
  addStockCk: '/operate/stock/addStockCk',
  updateStockCk: '/operate/stock/updateStockCk',
  removeStockCk: '/operate/stock/removeStockCk',
  getAllProMaterial: '/public/common/getAllProMaterial',
  getAllProMaterialBand: '/public/common/getAllProMaterialBand',
  getAllProMatBanModel: '/public/common/getAllProMatBanModel',
  getAllProMatBanModelUnit: '/public/common/getAllProMatBanModelUnit',
  getAllStockClkList: '/public/common/getAllStockClkList',
  stockCkBill: '/operate/stock/stockCkBill'
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
export function getStockInfo (params) {
  return request({
    url: stock.stockInfo,
    method: 'get',
    params
  })
}

// 出入库存列表接口
export function getStockClkList (params) {
  return request({
    url: stock.stockClkList,
    method: 'get',
    params
  })
}

// 库存出入库详情接口
export function getStockClkInfo (params) {
  return request({
    url: stock.stockClkInfo,
    method: 'get',
    params
  })
}

// 创建出库单接口
export function addStockCk (data) {
  return request({
    url: stock.addStockCk,
    method: 'post',
    headers: {
      noToast: true
    },
    data
  })
}

// 修改出库单接口(
export function updateStockCk (data) {
  return request({
    url: stock.updateStockCk,
    method: 'post',
    headers: {
      noToast: true
    },
    data
  })
}

// 删除出库单接口接口
export function removeStockCk (data) {
  return request({
    url: stock.removeStockCk,
    method: 'post',
    data
  })
}

// 编辑出库单物料数据加载接口
export function getAllProMaterial (params) {
  return request({
    url: stock.getAllProMaterial,
    method: 'get',
    params
  })
}

// 编辑出库单物料品牌加载接口
export function getAllProMaterialBand (params) {
  return request({
    url: stock.getAllProMaterialBand,
    method: 'get',
    params
  })
}

// 编辑出库单规格型号加载接口
export function getAllProMatBanModel (params) {
  return request({
    url: stock.getAllProMatBanModel,
    method: 'get',
    params
  })
}

// 编辑出库单单位加载接口
export function getAllProMatBanModelUnit (params) {
  return request({
    url: stock.getAllProMatBanModelUnit,
    method: 'get',
    params
  })
}

// 库存详情出入库列表接口
export function getAllStockClkList (params) {
  return request({
    url: stock.getAllStockClkList,
    method: 'get',
    params
  })
}

// 出库单数据打印接口
export function getStockCkBill (params) {
  return request({
    url: stock.stockCkBill,
    method: 'get',
    params
  })
}
