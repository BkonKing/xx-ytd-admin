<template>
  <page-header-wrapper>
    <a-card class="search-card" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <search-form
          v-model="queryParam"
          ref="contractSearchForm"
          @search="$refs.table.refresh(true)"
        ></search-form>
      </div>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="table-operator">
        <a-button
         v-if="permissions.ExportPermission"
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
import { STable } from '@/components'
import { getContractReport } from '@/api/report'
import SearchForm from '../contract/components/seachForm.vue'
import exportTypeModal from './components/exportTypeModal'

const columns = [
  {
    title: '合同状态',
    dataIndex: 'contractStatusv'
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
    sorter: true
  },
  {
    title: '金额',
    dataIndex: 'orderMoney',
    sorter: true
  },
  {
    title: '创建时间',
    dataIndex: 'ctime'
  },
  {
    title: '操作',
    dataIndex: 'id',
    width: '100px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'reportContract',
  components: {
    STable,
    SearchForm,
    exportTypeModal
  },
  data () {
    this.columns = columns
    return {
      // 弹窗
      visible: false,
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
        if (time && time.length) {
          this.queryParam.startDate = time[0]
          this.queryParam.endDate = time[1]
        }
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
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 导出
    openExport () {
      if (!this.queryParam.projectId) {
        this.$message.warning('请选择项目')
      } else {
        this.visible = true
      }
    },
    exportReport () {},
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
