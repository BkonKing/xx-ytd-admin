<template>
  <div>
    <a-card class="search-card" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form ref="form" layout="inline">
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
                <a-form-item label="出入库时间">
                  <a-range-picker
                    v-model="queryParam.time"
                    valueFormat="YYYY-MM-DD"
                    style="width: 100%;"
                  />
                </a-form-item>
              </a-col>
            </template>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="物料">
                  <a-input
                    v-model="queryParam.serachMaterialText"
                    placeholder="编码、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="规格型号">
                  <a-input
                    v-model="queryParam.serachModelText"
                    placeholder="请输入"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="物料品牌">
                  <a-input
                    v-model="queryParam.serachBrandText"
                    placeholder="请输入"
                  ></a-input>
                </a-form-item>
              </a-col>
            </template>
            <advanced-form
              v-model="advanced"
              :md="isParentCompany ? 24 : 8"
              @reset="() => this.queryParam = {}"
              @search="$refs.table.refresh(true)"
            ></advanced-form>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="table-operator">
        <a-button v-if="permissions.ExportPermission" @click="exportReport"
          >导出</a-button
        >
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
    <record-detail-modal
      v-model="visible"
      :data="activeRecord"
    ></record-detail-modal>
  </div>
</template>

<script>
import {
  STable,
  ProjectSelect,
  CompanySelect,
  AdvancedForm
} from '@/components'
import { getStockLkReport, getStockCkReport } from '@/api/report'
import RecordDetailModal from '../../stock/components/RecordDetail'
import { changeJSON2QueryString } from '@/utils/util'

const columns = [
  {
    title: '记录ID',
    dataIndex: 'id'
  },
  {
    title: '类型',
    dataIndex: 'stockTypeV'
  },
  {
    title: '所属项目',
    dataIndex: 'projectName'
  },
  {
    title: '物料',
    dataIndex: 'materiaCount',
    sorter: true
  },
  {
    title: '数量',
    dataIndex: 'materiaNum',
    sorter: true
  },
  {
    title: '领料部门',
    dataIndex: 'department'
  },
  {
    title: '出入库人',
    dataIndex: 'clkAdmin',
    sort: true
  },
  {
    title: '出入库时间',
    dataIndex: 'ctime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'CLKTab',
  components: {
    STable,
    RecordDetailModal,
    ProjectSelect,
    CompanySelect,
    AdvancedForm
  },
  props: {
    // 1:入库
    type: {
      type: String,
      default: '1'
    }
  },
  data () {
    this.columns = columns
    return {
      // 审核弹窗
      visible: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const time = this.queryParam.time
        if (time && time.length) {
          this.queryParam.startDate = time[0]
          this.queryParam.endDate = time[1]
        }
        const api = this.type === '1' ? getStockLkReport : getStockCkReport
        return api(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      activeRecord: {}
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
    },
    eUrl () {
      return this.type === '1' ? '/operate/report/stocklkReportExcel' : '/operate/report/stockCkReportExcel'
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
        location.href = `${baseUrl}${this.eUrl}?${changeJSON2QueryString(params)}`
      }
    },
    goDetail (record) {
      this.activeRecord = record
      this.visible = true
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
