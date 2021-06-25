import request from '@/utils/request'

export const common = {
  getAllProject: '/public/common/getAllProject',
  getAllCompany: '/public/common/getAllCompany',
  getAllContractType: '/public/common/getAllContractType',
  getAllSupplier: '/public/common/getAllSupplier',
  getAllSupplierType: '/public/common/getAllSupplierType',
  getAllMaterialType: '/public/common/getAllMaterialType',
  getLogType: '/public/common/getLogType',
  getLogAdmin: '/public/common/getLogAdmin',
  getLogsList: '/public/common/getLogsList',
  getAllContract: '/public/common/getAllContract'

}

// 获取所有项目接口
export function getAllProject (data) {
  return request({
    url: common.getAllProject,
    method: 'post',
    data
  })
}

// 获取所有公司接口
export function getAllCompany (data) {
  return request({
    url: common.getAllCompany,
    method: 'post',
    data
  })
}

// 获取合同类型接口
export function getAllContractType (data) {
  return request({
    url: common.getAllContractType,
    method: 'post',
    data
  })
}

// 获取供应商类型接口
export function getAllSupplierType (data) {
  return request({
    url: common.getAllSupplierType,
    method: 'post',
    data
  })
}

// 获取物料类型接口
export function getAllMaterialType (params) {
  return request({
    url: common.getAllMaterialType,
    method: 'get',
    params
  })
}

// 获取供应商接口
export function getAllSupplier (data) {
  return request({
    url: common.getAllSupplier,
    method: 'post',
    data
  })
}

// 获取操作日志模块接口
export function getLogType (params) {
  return request({
    url: common.getLogType,
    method: 'get',
    params
  })
}

// 获取日志操作员接口
export function getLogAdmin (params) {
  return request({
    url: common.getLogAdmin,
    method: 'get',
    params
  })
}

// 获取操作日志列表接口
export function getLogsList (params) {
  return request({
    url: common.getLogsList,
    method: 'get',
    params
  })
}

// 获取关联合同接口
export function getAllContract (data) {
  return request({
    url: common.getAllContract,
    method: 'post',
    data
  })
}
