import request from '@/utils/request'

export const common = {
  getAllProject: '/public/common/getAllProject',
  getAllCompany: '/public/common/getAllCompany',
  getAllContractType: '/public/common/getAllContractType',
  getAllSupplierType: '/public/common/getAllSupplierType'
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
