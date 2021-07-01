import request from '@/utils/request'

export const basicSetApi = {
  setData: '/set/messageset/setData',
  webSendSet: '/set/messageset/webSendSet',
  wxSendSet: '/set/messageset/wxSendSet',
  setInfo: '/set/messageset/setInfo',
  templateSet: '/set/messageset/templateSet'
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
