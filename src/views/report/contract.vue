<template>
  <page-header-wrapper>
    <a-card class="search-card" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <contract-search-form
          v-model="queryParam"
          ref="contractSearchForm"
          @search="$refs.table.refresh(true)"
        ></contract-search-form>
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
        <div slot="orderNum" slot-scope="text" style="min-width: 48px;">{{
          text
        }}</div>
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
import { STable } from '@/components'
import { getContractReport } from '@/api/report'
import { changeJSON2QueryString } from '@/utils/util'
import ContractSearchForm from './components/ContractSearchForm'

const columns = [
  {
    title: '合同状态',
    dataIndex: 'contractStatusv',
    width: '92px'
  },
  {
    title: '所属项目',
    dataIndex: 'projectName'
  },
  {
    title: '合同名称',
    dataIndex: 'contractName'
  },
  {
    title: '合同编号',
    dataIndex: 'contractNo'
  },
  {
    title: '订单',
    dataIndex: 'orderNum',
    sorter: true,
    scopedSlots: { customRender: 'orderNum' }
  },
  {
    title: '金额',
    dataIndex: 'contractMoney',
    sorter: true,
    customRender (text) {
      return +text ? `￥${text}` : '--'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'ctime',
    width: '162px'
  },
  {
    title: '操作',
    dataIndex: 'id',
    width: '64px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'reportContract',
  components: {
    STable,
    ContractSearchForm
  },
  data () {
    this.columns = columns
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        contractStatus: '',
        projectId: '',
        companyId: '',
        categoryId: '',
        orderId: '',
        serachText: '',
        serachSupplierText: '',
        payStatus: '',
        time: []
      },
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
        return getContractReport(Object.assign(parameter, this.queryParam))
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
    // 导出
    exportReport () {
      if (!this.queryParam.projectId) {
        this.$message.warning('请选择项目')
      } else {
        const baseUrl =
          process.env.NODE_ENV === 'production'
            ? process.env.VUE_APP_API_BASE_URL
            : '/api'
        const params = {
          projectId: this.queryParam.projectId,
          ids: this.selectedRowKeys.join(',')
        }
        location.href = `${baseUrl}/operate/report/contractReportExcel?${changeJSON2QueryString(
          params
        )}`
      }
    },
    goDetail ({ id }) {
      this.$router.push({
        name: 'ContractDetail',
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
