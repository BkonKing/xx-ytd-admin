import request from '@/utils/request'

export const contract = {
  getContractList: '/operate/contract/contractList',
  addCont: '/operate/contract/addCont',
  updateCont: '/operate/contract/updateCont',
  removeCont: '/operate/contract/removeCont',
  auditCont: '/operate/contract/auditCont'
}

// 获取合同列表接口
export function getContractList (data) {
  return request({
    url: contract.getContractList,
    method: 'post',
    data
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
