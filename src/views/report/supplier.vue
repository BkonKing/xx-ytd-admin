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
            <a-col :md="8" :sm="24">
              <a-form-item label="所属公司">
                <company-select v-model="queryParam.companyId"></company-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="创建时间">
                  <a-range-picker
                    v-model="queryParam.ctime"
                    valueFormat="YYYY-MM-DD"
                    @change="changeCreationTime"
                  />
                </a-form-item>
              </a-col>
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
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="
                  (advanced && { float: 'right', overflow: 'hidden' }) || {}
                "
              >
                <a-button type="primary" @click="$refs.table.refresh(true)"
                  >查询</a-button
                >
                <a-button
                  style="margin-left: 8px"
                  @click="() => (this.queryParam = {})"
                  >重置</a-button
                >
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? "收起" : "展开" }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="table-operator">
        <a-button
          type="primary"
          :disabled="!selectedRowKeys.length"
          @click="openExport"
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
        showPagination="auto"
      >
        <span class="table-action" slot="action" slot-scope="text, record">
          <template>
            <a @click="goDetail(record)">查看</a>
          </template>
        </span>
      </s-table>
    </a-card>
    <export-type-modal
      v-model="visible"
      @select="exportReport"
    ></export-type-modal>
  </page-header-wrapper>
</template>

<script>
import {
  STable,
  ProjectSelect,
  CompanySelect,
  SupplierTypeSelect,
  MaterialTypeSelect
} from '@/components'
import exportTypeModal from './components/exportTypeModal'
import { getSuppReport } from '@/api/report'

const columns = [
  {
    title: '所属项目',
    dataIndex: 'projectName'
  },
  {
    title: '供应商ID',
    dataIndex: 'id'
  },
  {
    title: '供应商',
    dataIndex: 'supplierName'
  },
  {
    title: '类型',
    dataIndex: 'supplierTypeName'
  },
  {
    title: '统一社会信用代码',
    dataIndex: 'supplierTypeName'
  },
  {
    title: '供应物料',
    dataIndex: 'materialCount',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '100px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'reportSupplier',
  components: {
    STable,
    ProjectSelect,
    CompanySelect,
    SupplierTypeSelect,
    MaterialTypeSelect,
    exportTypeModal
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
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
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getSuppReport(requestParameters)
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    rowSelection () {
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
    // 导出
    openExport () {
      if (!this.queryParam.projectId) {
        this.$message.warning('请选择项目')
      } else if (!this.tableData || !this.tableData.length) {
        this.$message.warning('当前项目有没有数据')
      } else {
        this.visible = true
      }
    },
    exportReport () {},
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
.table-page-search-wrapper {
  /deep/ .ant-form-inline .ant-form-item > .ant-form-item-label {
    width: 80px;
  }
}
</style>
