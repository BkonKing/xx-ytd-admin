<template>
  <page-header-wrapper>
    <a-card class="search-card" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="所属项目">
                <project-select v-model="queryParam.projectId"></project-select>
              </a-form-item>
            </a-col>
            <a-col v-if="isParentCompany" :md="8" :sm="24">
              <a-form-item label="所属公司">
                <company-select v-model="queryParam.companyId"></company-select>
              </a-form-item>
            </a-col>
            <template v-if="!isParentCompany || advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="创建时间">
                  <a-range-picker
                    v-model="queryParam.time"
                    valueFormat="YYYY-MM-DD"
                  />
                </a-form-item>
              </a-col>
            </template>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="订单">
                  <a-input
                    v-model="queryParam.orderId"
                    placeholder="ID"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="合同">
                  <a-input
                    v-model="queryParam.serachContractText"
                    placeholder="编号、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="物料">
                  <a-input
                    v-model="queryParam.serachMaterialText"
                    placeholder="ID、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="供应商">
                  <a-input
                    v-model="queryParam.serachSupplierText"
                    placeholder="ID、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="付款情况">
                  <pay-status-select
                    v-model="queryParam.payStatus"
                  ></pay-status-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="开票情况">
                  <kp-status-select
                    v-model="queryParam.kpStatus"
                  ></kp-status-select>
                </a-form-item>
              </a-col>
            </template>
            <advanced-form
              v-model="advanced"
              :md="isParentCompany ? 24 : 8"
              @reset="() => {this.queryParam = {};this.$refs.table.refresh(true)}"
              @search="$refs.table.refresh(true)"
            ></advanced-form>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="table-operator">
        <a-button
          v-if="permissions.ExportPermission"
          :disabled="!selectedRowKeys.length"
          @click="exportReport"
        >
          导出
        </a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="{ clear: true }"
        :rowSelection="rowSelection"
        :rowSelectionPaging="true"
        showPagination="auto"
      >
        <span class="table-action" slot="action" slot-scope="text, record">
          <template>
            <a @click="goDetail(record)">查看</a>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import {
  STable,
  ProjectSelect,
  CompanySelect,
  PayStatusSelect,
  KpStatusSelect,
  AdvancedForm
} from '@/components'
import { getMaterialReport } from '@/api/report'
import { changeJSON2QueryString } from '@/utils/util'

const columns = [
  {
    title: '所属项目',
    dataIndex: 'projectName'
  },
  {
    title: '订单ID',
    dataIndex: 'idv',
    width: '172px'
  },
  {
    title: '供应商',
    dataIndex: 'supplierName'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    title: '物料品牌',
    dataIndex: 'brand'
  },
  {
    title: '规格型号',
    dataIndex: 'model'
  },
  {
    title: '税率',
    dataIndex: 'taxRate',
    width: '70px'
  },
  {
    title: '单价',
    dataIndex: 'unitPrice',
    sorter: true,
    customRender (text) {
      return +text ? `￥${text}` : '--'
    }
  },
  {
    title: '金额',
    dataIndex: 'allPrice',
    sorter: true,
    customRender (text) {
      return +text ? `￥${text}` : '--'
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '65px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'reportMaterial',
  components: {
    STable,
    ProjectSelect,
    CompanySelect,
    PayStatusSelect,
    KpStatusSelect,
    AdvancedForm
  },
  data () {
    this.columns = columns
    return {
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const time = this.queryParam.time
        let startDate = ''
        let endDate = ''
        if (time && time.length) {
          startDate = time[0]
          endDate = time[1]
        }
        this.queryParam.startDate = startDate
        this.queryParam.endDate = endDate
        return getMaterialReport(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    rowSelection () {
      if (!this.permissions.ExportPermission) {
        return null
      }
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 导出
    exportReport () {
      if (!this.queryParam.projectId) {
        this.$message.warning('请选择项目')
      } else {
        const baseUrl = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : '/api'
        const params = {
          projectId: this.queryParam.projectId,
          ids: this.selectedRowKeys.join(',')
        }
        console.log(params)
        location.href = `${baseUrl}/operate/report/materialReportExcel?${changeJSON2QueryString(params)}`
      }
    },
    goDetail ({ orderId: id }) {
      this.$router.push({
        name: 'OrderDetail',
        query: {
          id
        }
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>

<style lang="less" scoped>
.table-page-search-wrapper {
  /deep/ .ant-form-inline .ant-form-item > .ant-form-item-label {
    width: 80px;
  }
}
</style>
