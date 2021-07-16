<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="handleTabChange"
  >
    <a-card class="search-card" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <search-form
          v-model="queryParam"
          ref="contractSearchForm"
          :statusAble="tabActiveKey !== '0' && +tabActiveKey < 10"
          :contractStatusAble="tabActiveKey !== '0' && +tabActiveKey > 10"
          @search="$refs.table.refresh(true)"
        ></search-form>
      </div>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="table-operator">
        <a-button
          v-if="permissions.AuditPermission"
          type="primary"
          :disabled="!selectedRowKeys.length"
          @click="openCheck"
          >审核</a-button
        >
        <a-button v-if="permissions.CreatePermission" @click="goEdit"
          >新增</a-button
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
        <span slot="auditTime" slot-scope="text, record">
          <time-wait
            v-if="text"
            :time="`${text - record.nowTime}`"
            upClass="error-text"
            :delay="60000"
          ></time-wait>
          <template v-else>--</template>
        </span>
        <span class="table-action" slot="action" slot-scope="text, record">
          <template>
            <a @click="goDetail(record)">查看</a>
            <a
              v-if="
                permissions.UpdatePermission || permissions.UpdatePartPermission
              "
              @click="goEdit(record)"
              >编辑</a
            >
            <a
              v-if="permissions.RemovePermission"
              @click="handleRemove(record)"
              >删除</a
            >
            <a
              v-if="
                +record.status === 0 &&
                  permissions.AuditPermission &&
                  record.auditPermission
              "
              @click="openCheck(record)"
              >审核</a
            >
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
import { STable, CheckForm, TimeWait } from '@/components'
import SearchForm from './components/seachForm'
import {
  getContractList,
  removeCont,
  auditCont,
  auditBatchCont
} from '@/api/contract'
import { getIsAuditSet } from '@/api/common'

const checkTimec = [
  {
    title: '审核时间',
    dataIndex: 'auditTime',
    scopedSlots: { customRender: 'auditTime' }
  }
]

const checkStatusC = [
  {
    title: '审核状态',
    dataIndex: 'statusv'
  }
]

export default {
  name: 'TableList',
  components: {
    STable,
    CheckForm,
    SearchForm,
    TimeWait
  },
  data () {
    return {
      tabList: [
        { key: '0', tab: '全部' },
        { key: '1', tab: '待审核' },
        { key: '2', tab: '已通过' },
        { key: '3', tab: '未通过' },
        { key: '11', tab: '正常' },
        { key: '12', tab: '延期' },
        { key: '13', tab: '终止' }
      ],
      tabActiveKey: '0',
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
      columns: [
        {
          title: '审核状态',
          dataIndex: 'statusv'
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
          dataIndex: 'contractMoney',
          sorter: true
        },
        {
          title: '创建时间',
          dataIndex: 'ctime'
        },
        {
          title: '操作',
          dataIndex: 'id',
          width: '180px',
          scopedSlots: { customRender: 'action' }
        }
      ],
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
        const index = +this.tabActiveKey
        const queryParam = {}
        if (index !== 0) {
          if (index < 10) {
            queryParam.status = this.tabActiveKey
          } else {
            queryParam.status = 0
            queryParam.contractStatus = index - 10
          }
        }
        return getContractList(Object.assign(parameter, this.queryParam, queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      checkId: ''
    }
  },
  computed: {
    rowSelection () {
      if (!this.permissions.AuditPermission) {
        return null
      }
      return {
        selectedRowKeys: this.selectedRowKeys,
        getCheckboxProps: record => ({
          props: {
            disabled: +record.status !== 0 || record.auditPermission === 0
          }
        }),
        onChange: this.onSelectChange
      }
    }
  },
  created () {
    const tab = this.$route.query.tabActiveKey
    if (tab) {
      this.tabActiveKey = tab
      this.changeColumns(+tab)
    }
  },
  methods: {
    handleTabChange (key) {
      this.tabActiveKey = key
      this.changeColumns(+key)
      this.$refs.table.refresh()
    },
    changeColumns (index) {
      // 是否有审核时间
      const isAudit = this.columns.findIndex(column => column.dataIndex === 'auditTime') > -1
      // 是否有审核状态
      const isStatus = this.columns.findIndex(column => column.dataIndex === 'statusv') > -1
      if (index === 1) {
        isStatus && this.columns.shift()
        !isAudit && this.columns.unshift(...checkTimec)
      } else if (index === 0 || index > 10) {
        isAudit && this.columns.shift()
        !isStatus && this.columns.unshift(...checkStatusC)
      } else {
        isAudit && this.columns.shift()
        isStatus && this.columns.shift()
      }
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    openCheck ({ id }) {
      id && (this.checkId = id)
      this.visible = true
      this.$refs.CheckForm && this.$refs.CheckForm.resetFields()
    },
    handleCheckOk () {
      this.confirmLoading = true
      this.$refs.CheckForm.handleSubmit()
        .then(value => {
          if (this.checkId) {
            this.auditCont(value)
          } else if (this.selectedRowKeys) {
            this.auditBatchCont(value)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    auditCont (value) {
      auditCont({
        ...value,
        id: this.checkId
      }).then(({ data, message }) => {
        this.checkId = ''
        this.checkCall(message)
      })
    },
    auditBatchCont (value) {
      auditBatchCont({
        ...value,
        ids: this.selectedRowKeys
      }).then(({ data, message }) => {
        this.$refs.table.clearSelected()
        this.checkCall(message)
      })
    },
    checkCall (message) {
      this.$message.success(message)
      this.visible = false
      this.$refs.table.refresh()
    },
    handleCheckCancel () {
      this.checkId = ''
      this.visible = false
    },
    handleRemove ({ id, contractName }) {
      const that = this
      this.$confirm({
        title: '删除人员', // 用户名
        content: `确认删除 "${contractName}" 吗？`,
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
    goEdit ({ id }) {
      getIsAuditSet({
        auditType: 2
      }).then(({ success }) => {
        success && this.$router.push({
          name: 'ContractEdit',
          query: {
            id
          }
        })
      })
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
