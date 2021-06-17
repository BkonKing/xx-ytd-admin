import request from '@/utils/request'

export const supplier = {
  suppList: '/operate/supplier/suppList',
  addSupp: '/operate/supplier/addSupp',
  updateSupp: '/operate/supplier/updateSupp',
  removeSupp: '/operate/supplier/removeSupp'
}

// 获取所有公司接口
export function getSupplierList (data) {
  return request({
    url: supplier.suppList,
    method: 'post',
    data
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
