import request from '@/utils/request'

export const supplier = {
  suppList: '/operate/supplier/suppList',
  addSupp: '/operate/supplier/addSupp',
  updateSupp: '/operate/supplier/updateSupp',
  removeSupp: '/operate/supplier/removeSupp',
  suppInfo: '/operate/supplier/suppInfo',
  auditSupp: '/operate/supplier/auditSupp',
  auditBatchSupp: '/operate/supplier/auditBatchSupp',
  getSuppMaterialList: '/public/common/getSuppMaterialList'
}

// 获取所有公司接口
export function getSupplierList (params) {
  return request({
    url: supplier.suppList,
    method: 'get',
    params
  })
}

// 获取所有公司接口
export function addSupplier (data) {
  return request({
    url: supplier.addSupp,
    method: 'post',
    data
  })
}

// 编辑供应商接口
export function updateSupplier (data) {
  return request({
    url: supplier.updateSupp,
    method: 'post',
    data
  })
}

// 删除供应商接口
export function removeSupplier (data) {
  return request({
    url: supplier.removeSupp,
    method: 'post',
    data
  })
}

// 获取供应商详情接口
export function getSuppInfo (params) {
  return request({
    url: supplier.suppInfo,
    method: 'get',
    params
  })
}

// 审核供应商接口
export function auditSupp (data) {
  return request({
    url: supplier.auditSupp,
    method: 'POST',
    data
  })
}

// 审核供应商接口
export function auditBatchSupp (data) {
  return request({
    url: supplier.auditBatchSupp,
    method: 'POST',
    data
  })
}

// 审核供应商接口
export function getSuppMaterialList (params) {
  return request({
    url: supplier.getSuppMaterialList,
    method: 'get',
    params
  })
}
