import request from '@/utils/request'

export const contract = {
  getContractList: '/operate/contract/contractList',
  addCont: '/operate/contract/addCont',
  updateCont: '/operate/contract/updateCont',
  removeCont: '/operate/contract/removeCont',
  auditCont: '/operate/contract/auditCont',
  contractInfo: '/operate/contract/contractInfo',
  auditBatchCont: '/operate/contract/auditBatchCont',
  getSettleType: '/public/common/getAllSettleType',
  getPayType: '/public/common/getAllPayType',
  getOrderList: '/operate/order/orderList',
  getOrderPayByContId: '/operate/order/getOrderPayByContId'
}

// 获取合同列表接口
export function getContractList (params) {
  return request({
    url: contract.getContractList,
    method: 'get',
    params
  })
}

// 创建合同接口
export function addCont (data) {
  return request({
    url: contract.addCont,
    method: 'post',
    data
  })
}

// 创建合同接口
export function updateCont (data) {
  return request({
    url: contract.updateCont,
    method: 'post',
    data
  })
}

// 删除合同接口
export function removeCont (data) {
  return request({
    url: contract.removeCont,
    method: 'post',
    data
  })
}

// 审核合同接口
export function auditCont (data) {
  return request({
    url: contract.auditCont,
    method: 'post',
    data
  })
}

// 合同详情接口
export function getContractInfo (params) {
  return request({
    url: contract.contractInfo,
    method: 'get',
    params
  })
}

// 批量审核合同接口
export function auditBatchCont (data) {
  return request({
    url: contract.auditBatchCont,
    method: 'post',
    data
  })
}

// 结算方式接口
export function getSettleType (data) {
  return request({
    url: contract.getSettleType,
    method: 'post',
    data
  })
}

// 支付方式接口
export function getPayType (data) {
  return request({
    url: contract.getPayType,
    method: 'post',
    data
  })
}

// 合同详情订单列表
export function getOrderList (params) {
  return request({
    url: contract.getOrderList,
    method: 'get',
    params
  })
}

// 合同详情付款列表
export function getOrderPayByContId (params) {
  return request({
    url: contract.getOrderPayByContId,
    method: 'get',
    params
  })
}
