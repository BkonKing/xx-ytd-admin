import request from '@/utils/request'

export const dashboardApi = {
  workbench: '/public/common/workbench'
}
// 工作台数据接口(已验证)
export function toWorkbench (params) {
  return request({
    url: dashboardApi.workbench
  })
}
