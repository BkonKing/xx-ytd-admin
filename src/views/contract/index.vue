<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="handleTabChange"
  >
    <a-card style="margin-top: 24px" :bordered="false">
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
        <a-button type="primary" :disabled="!selectedRowKeys.length" @click="openCheck">审核</a-button>
        <a-button @click="goEdit">新增</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="goDetail(record)">查看</a>
            <a @click="goEdit(record)">编辑</a>
            <a @click="handleRemove(record)">删除</a>
            <a @click="openCheck(record)">审核</a>
          </template>
        </span>
      </s-table>
    </a-card>
    <a-modal
      title="审核"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleCheckOk"
      @cancel="handleCheckCancel"
    >
      <check-form
        ref="CheckForm"
        :selectedRowKeys="selectedRowKeys"
      ></check-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
// import moment from 'moment'
import { STable, CheckForm } from '@/components'
import { getContractList, removeCont, auditCont } from '@/api/contract'
import SearchForm from './components/seachForm.vue'

const columns = [
  {
    title: '审核时间',
    dataIndex: 'auditTime',
    scopedSlots: { customRender: 'auditTime' }
  },
  {
    title: '合同状态',
    dataIndex: 'contractStatusv'
  },
  {
    title: '所属项目',
    dataIndex: 'projectName'
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
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'TableList',
  components: {
    STable,
    CheckForm,
    SearchForm
  },
  data () {
    this.columns = columns
    return {
      tabList: [
        { key: '1', tab: '全部' },
        { key: '2', tab: '待审核' },
        { key: '3', tab: '正常' },
        { key: '4', tab: '延期' },
        { key: '5', tab: '终止' },
        { key: '6', tab: '未通过' }
      ],
      tabActiveKey: '1',
      // 审核弹窗
      visible: false,
      confirmLoading: false,
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
        return getContractList(Object.assign(parameter, this.queryParam))
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
    handleTabChange (key) {
      this.tabActiveKey = key
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    openCheck () {
      this.visible = true
      this.$refs.CheckForm && this.$refs.CheckForm.resetFields()
    },
    handleCheckOk () {
      this.confirmLoading = true
      this.$refs.CheckForm.handleSubmit()
        .then(value => {
          console.log(value)
          auditCont(value).then(() => {
            this.$refs.table.refresh()
            this.visible = false
          })
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    handleCheckCancel () {
      this.visible = false
    },
    handleRemove ({ id }) {
      const that = this
      this.$confirm({
        content: '是否删除该合同？',
        onOk () {
          removeCont({
            id
          }).then(({ data }) => {
            that.$message.success('删除合同成功')
            that.$refs.table.refresh()
          })
        }
      })
    },
    goEdit () {
      this.$router.push({
        name: 'ContractEdit'
      })
    },
    goDetail () {
      this.$router.push({
        name: 'ContractDetail'
      })
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
