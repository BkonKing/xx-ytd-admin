<template>
  <page-header-wrapper>
    <a-card class="search-card" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="关联项目">
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
                    v-model="queryParam.ctime"
                    valueFormat="YYYY-MM-DD"
                    @change="changeCreationTime"
                  />
                </a-form-item>
              </a-col>
            </template>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="类型">
                  <supplier-type-select
                    v-model="queryParam.supplierType"
                  ></supplier-type-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="供应商">
                  <a-input
                    v-model="queryParam.searchText"
                    placeholder="ID、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="供应物料">
                  <material-type-select
                    v-model="queryParam.material"
                  ></material-type-select>
                </a-form-item>
              </a-col>
            </template>
            <advanced-form
              v-model="advanced"
              :md="isParentCompany ? 24 : 8"
              @reset="reset"
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
          type="primary"
          :disabled="!selectedRowKeys.length"
          @click="exportReport"
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
  </page-header-wrapper>
</template>

<script>
import {
  STable,
  ProjectSelect,
  CompanySelect,
  SupplierTypeSelect,
  MaterialTypeSelect,
  AdvancedForm
} from '@/components'
import { changeJSON2QueryString } from '@/utils/util'
import { getSuppReport } from '@/api/report'
import setCompanyId from '@/mixins/setCompanyId'

export default {
  name: 'reportSupplier',
  mixins: [setCompanyId],
  components: {
    STable,
    ProjectSelect,
    CompanySelect,
    SupplierTypeSelect,
    MaterialTypeSelect,
    AdvancedForm
  },
  data () {
    return {
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: true,
      // 查询参数
      queryParam: {
        status: '',
        projectId: '',
        companyId: '',
        supplierType: '',
        searchText: '',
        material: '',
        ctime: []
      },
      columns: [
        {
          title: '所属项目',
          dataIndex: 'projectName',
          width: '20%',
          customRender: (text) => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '供应商ID',
          dataIndex: 'idv',
          class: 'nowrap'
        },
        {
          title: '供应商',
          dataIndex: 'supplierName',
          width: '15%',
          customRender: (text) => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '类型',
          dataIndex: 'supplierTypeName',
          width: '10%',
          customRender: (text) => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '统一社会信用代码',
          dataIndex: 'socialCode',
          class: 'nowrap'
        },
        {
          title: '供应物料',
          dataIndex: 'materialName',
          customRender: (text) => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '65px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const time = this.queryParam.ctime
        let startDate = ''
        let endDate = ''
        if (time && time.length) {
          startDate = time[0]
          endDate = time[1]
        }
        this.queryParam.startDate = startDate
        this.queryParam.endDate = endDate
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getSuppReport(requestParameters)
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
    // 创建时间更改事件
    changeCreationTime (value) {
      this.queryParam.startDate = value[0]
      this.queryParam.endDate = value[1]
    },
    reset () {
      this.queryParam = {
        status: '',
        projectId: '',
        companyId: '',
        supplierType: '',
        searchText: '',
        material: '',
        ctime: []
      }
      this.setcompanyId()
      this.$refs.table.refresh(true)
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
        location.href = `${baseUrl}/operate/report/suppReportExcel?${changeJSON2QueryString(params)}`
      }
    },
    goDetail ({ id }) {
      this.$router.push({
        name: 'SupplierDetail',
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
</style>
