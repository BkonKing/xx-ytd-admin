import request from '@/utils/request'

export const basicSetApi = {
  setData: '/set/messageset/setData',
  webSendSet: '/set/messageset/webSendSet',
  wxSendSet: '/set/messageset/wxSendSet',
  setInfo: '/set/messageset/setInfo',
  templateSet: '/set/messageset/templateSet',
  setData2: '/set/auditset/setData',
  material: '/set/category/material',
  updateBatchMaterial: '/set/category/updateBatchMaterial',
  removeMaterial: '/set/category/removeMaterial',
  removeBatchMaterial: '/set/category/removeBatchMaterial',
  contract: '/set/category/contract',
  updateBatchContract: '/set/category/updateBatchContract',
  removeBatchContract: '/set/category/removeBatchContract',
  removeContract: '/set/category/removeContract',
  getAllAdminList: '/public/common/getAllAdminList',
  updateSetData: '/set/auditset/updateSetData'
}

// 消息设置数据接口(已验证)
export function toSetData () {
  return request({
    url: basicSetApi.setData,
    method: 'post'
  })
}
// 站内信发送设置接口(已验证)
export function toWebSendSet (data) {
  return request({
    url: basicSetApi.webSendSet,
    method: 'post',
    data
  })
}
// 微信公众号发送设置接口(已验证)
export function toWxSendSet (data) {
  return request({
    url: basicSetApi.wxSendSet,
    method: 'post',
    data
  })
}
// 消息设置详情接口(已验证)
export function toSetInfo (params) {
  return request({
    url: basicSetApi.setInfo,
    params
  })
}
// 消息推送模版设置接口(已验证)
export function toTemplateSet (data) {
  return request({
    url: basicSetApi.templateSet,
    method: 'post',
    data
  })
}
// 审批设置数据接口(已验证)
export function toSetCheckData () {
  return request({
    url: basicSetApi.setData2,
    method: 'post'

  })
}
// 材料分类接口(已验证)
export function toMaterial (params) {
  return request({
    url: basicSetApi.material
  })
}
// 批量添加/编辑材料分类接口(已验证)
export function toUpdateBatchMaterial (data) {
  return request({
    url: basicSetApi.updateBatchMaterial,
    method: 'post',
    data
  })
}
// 删除材料分类接口(已验证)
export function toRemoveMaterial (data) {
  return request({
    url: basicSetApi.removeMaterial,
    method: 'post',
    data
  })
}
// 批量删除材料分类接口(已验证)
export function toRemoveBatchMaterial (data) {
  return request({
    url: basicSetApi.removeBatchMaterial,
    method: 'post',
    data
  })
}
// 合同分类接口(已验证)
export function toContract () {
  return request({
    url: basicSetApi.contract
  })
}
// 批量添加/编辑合同分类接口(已验证)
export function toUpdateBatchContract (data) {
  return request({
    url: basicSetApi.updateBatchContract,
    method: 'post',
    data
  })
}
// 删除合同分类接口(已验证)
export function toRemoveBatchContract (data) {
  return request({
    url: basicSetApi.removeBatchContract,
    method: 'post',
    data
  })
}
// 删除合同分类接口(已验证)
export function toRemoveContract (data) {
  return request({
    url: basicSetApi.removeContract,
    method: 'post',
    data
  })
}
// 获取审核人员列表接口(已验证)
export function toGetAllAdminList () {
  return request({
    url: basicSetApi.getAllAdminList

  })
}
// 编辑审批设置接口(已验证)
export function toUpdateSetData (data) {
  return request({
    url: basicSetApi.updateSetData,
    method: 'post',
    data
  })
}
