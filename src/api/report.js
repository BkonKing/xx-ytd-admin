import request from '@/utils/request'

export const report = {
  paidReport: '/operate/report/paidReport',
  updatePaidRepBz: '/operate/report/updatePaidRepBz',
  invoicedReport: '/operate/report/invoicedReport',
  updateInvoicedRepBz: '/operate/report/updateInvoicedRepBz',
  contractReport: '/operate/report/contractReport',
  suppReport: '/operate/report/suppReport',
  materialReport: '/operate/report/materialReport',
  stockReport: '/operate/report/stockReport',
  stockLkReport: '/operate/report/stockLkReport',
  stockCkReport: '/operate/report/stockCkReport'
}

// 付款明细报表接口
export function getStockList (params) {
  return request({
    url: report.paidReport,
    method: 'get',
    params
  })
}

// 编辑付款明细报表备注接口
export function updatePaidRepBz (data) {
  return request({
    url: report.updatePaidRepBz,
    method: 'post',
    data
  })
}

// 开票明细报表接口
export function getInvoicedReport (params) {
  return request({
    url: report.invoicedReport,
    method: 'get',
    params
  })
}

// 编辑开票明细报表备注接口
export function updateInvoicedRepBz (data) {
  return request({
    url: report.updateInvoicedRepBz,
    method: 'post',
    data
  })
}

// 合同明细报表接口
export function getContractReport (params) {
  return request({
    url: report.contractReport,
    method: 'get',
    params
  })
}

// 供应商报表接口
export function getSuppReport (params) {
  return request({
    url: report.suppReport,
    method: 'get',
    params
  })
}

// 供应商报表接口
export function getMaterialReport (params) {
  return request({
    url: report.materialReport,
    method: 'get',
    params
  })
}

// 库存明细报表接口
export function getStockReport (params) {
  return request({
    url: report.stockReport,
    method: 'get',
    params
  })
}

// 入库明细报表接口
export function getStockLkReport (params) {
  return request({
    url: report.stockLkReport,
    method: 'get',
    params
  })
}

// 出库明细报表接口
export function getStockCkReport (params) {
  return request({
    url: report.stockCkReport,
    method: 'get',
    params
  })
}
