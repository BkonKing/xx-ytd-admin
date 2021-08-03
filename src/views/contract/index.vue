<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="handleTabChange"
  >
    <a-card class="search-card" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="审核状态">
                <a-select
                  v-model="queryParam.status"
                  placeholder="请选择"
                  :disabled="statusAble"
                >
                  <a-select-option
                    v-for="option in statusOptions"
                    :value="option.value"
                    :key="option.value"
                  >
                    {{ option.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
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
            <a-col :md="8" :sm="24">
              <a-form-item label="合同状态">
                <a-select
                  v-model="queryParam.contractStatus"
                  placeholder="请选择"
                  :disabled="contractStatusAble"
                >
                  <a-select-option
                    v-for="option in contractStatusOptions"
                    :value="option.value"
                    :key="option.value"
                  >
                    {{ option.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="合同类型">
                <contract-type-select
                  v-model="queryParam.categoryId"
                ></contract-type-select>
              </a-form-item>
            </a-col>
            <template v-if="!isParentCompany || advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="合同">
                  <a-input
                    v-model="queryParam.serachText"
                    placeholder="编号、名称"
                  ></a-input>
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
                <a-form-item label="创建时间">
                  <a-range-picker
                    v-model="queryParam.time"
                    valueFormat="YYYY-MM-DD"
                  />
                </a-form-item>
              </a-col>
            </template>
            <advanced-form
              v-model="advanced"
              :md="isParentCompany ? 16 : 24"
              @search="$refs.table.refresh(true)"
              @reset="reset"
            ></advanced-form>
          </a-row>
        </a-form>
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
        :scroll="{ x: 2500 }"
        style="width: 100%"
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
                (permissions.UpdatePermission ||
                  permissions.UpdatePartPermission) &&
                  userCompanyId == record.companyId
              "
              @click="goEdit(record)"
              >编辑</a
            >
            <a
              v-if="
                permissions.RemovePermission &&
                  userCompanyId == record.companyId
              "
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
import {
  STable,
  CheckForm,
  TimeWait,
  ProjectSelect,
  CompanySelect,
  ContractTypeSelect,
  PayStatusSelect,
  AdvancedForm
} from '@/components'
import {
  getContractList,
  removeCont,
  auditCont,
  auditBatchCont
} from '@/api/contract'
import { getIsAuditSet } from '@/api/common'
import setCompanyId from '@/mixins/setCompanyId'
import beforeRouteLeave from '@/mixins/beforeRouteLeave'

export default {
  name: 'ContractIndex',
  mixins: [setCompanyId, beforeRouteLeave],
  components: {
    STable,
    CheckForm,
    TimeWait,
    ProjectSelect,
    CompanySelect,
    ContractTypeSelect,
    PayStatusSelect,
    AdvancedForm
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
      // 审核状态：0=全部、1=待审核、2=已通过、3=未通过
      statusOptions: [
        { value: '0', text: '全部' },
        { value: '1', text: '待审核' },
        { value: '2', text: '已通过' },
        { value: '3', text: '未通过' }
      ],
      // 合同状态：0=全部、1=正常、2=延期、3=终止
      contractStatusOptions: [
        {
          value: 0,
          text: '全部'
        },
        {
          value: 1,
          text: '正常'
        },
        {
          value: 2,
          text: '延期'
        },
        {
          value: 3,
          text: '终止'
        }
      ],
      // 查询参数
      queryParam: {
        time: [],
        companyId: undefined,
        status: undefined,
        contractStatus: undefined
      },
      columns: [
        {
          title: '所属项目',
          dataIndex: 'projectName'
        },
        {
          title: '合同编号',
          dataIndex: 'contractNo'
        },
        {
          title: '合同名称',
          dataIndex: 'contractName'
        },
        {
          title: '类型',
          dataIndex: 'categoryName'
        },
        {
          title: '供应商',
          dataIndex: 'supplierName'
        },
        {
          title: '金额',
          dataIndex: 'contractMoney',
          sorter: true,
          customRender (text) {
            return `￥${text}`
          }
        },
        {
          title: '总量',
          dataIndex: 'contractTotal'
        },
        {
          title: '税率',
          dataIndex: 'taxRate',
          customRender (text) {
            const number = parseFloat(text)
            return number ? `${number}%` : number
          }
        },
        {
          title: '签订日期',
          dataIndex: 'signDate'
        },
        {
          title: '有效期',
          dataIndex: 'startDate',
          customRender (text, row) {
            return `${text}~${row.endDate}`
          }
        },
        {
          title: '结算方式',
          dataIndex: 'settleTypeName'
        },
        {
          title: '付款方式',
          dataIndex: 'payTypeName'
        },
        {
          title: '订单',
          dataIndex: 'orderNum',
          sorter: true
        },
        {
          title: '已付款',
          dataIndex: 'orderPayMoney',
          customRender (text) {
            return text === '--' ? '--' : `￥${text}`
          }
        },
        {
          title: '未付款',
          dataIndex: 'orderUnPayMoney',
          customRender (text) {
            return text === '--' ? '--' : `￥${text}`
          }
        },
        {
          title: '已收票金额',
          dataIndex: 'orderInvoicedMoney',
          customRender (text) {
            return text === '--' ? '--' : `￥${text}`
          }
        },
        {
          title: '未收票金额',
          dataIndex: 'orderUnInvoicedMoney',
          customRender (text) {
            return text === '--' ? '--' : `￥${text}`
          }
        },
        {
          title: '审核状态',
          dataIndex: 'statusv'
        },
        {
          title: '合同状态',
          dataIndex: 'contractStatusv'
        },
        {
          title: '审核时间',
          dataIndex: 'auditTime',
          scopedSlots: { customRender: 'auditTime' }
        },
        {
          title: '备注',
          dataIndex: 'remarks'
        },
        {
          title: '创建时间',
          dataIndex: 'ctime'
        },
        {
          title: '操作',
          dataIndex: 'id',
          fixed: 'right',
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
        return getContractList(Object.assign(parameter, this.queryParam))
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
        fixed: true,
        selectedRowKeys: this.selectedRowKeys,
        getCheckboxProps: record => ({
          props: {
            disabled: +record.status !== 0 || record.auditPermission === 0
          }
        }),
        onChange: this.onSelectChange
      }
    },
    statusAble () {
      return this.tabActiveKey !== '0' && +this.tabActiveKey < 10
    },
    contractStatusAble () {
      return this.tabActiveKey !== '0' && +this.tabActiveKey > 10
    }
  },
  created () {
    const tab = this.$route.query.tabActiveKey
    if (tab) {
      this.tabActiveKey = tab
      // this.changeColumns(+tab)
    }
  },
  methods: {
    handleTabChange (key) {
      this.tabActiveKey = key
      this.changeStatus()
      // this.changeColumns(+key)
      this.$refs.table.refresh()
    },
    changeColumns (index) {
      // 是否有审核时间
      const isAudit =
        this.columns.findIndex(column => column.dataIndex === 'auditTime') > -1
      // 是否有审核状态
      const isStatus =
        this.columns.findIndex(column => column.dataIndex === 'statusv') > -1
      if (index === 1) {
        isStatus && this.columns.shift()
        // !isAudit && this.columns.unshift(...checkTimec)
      } else if (index === 0 || index > 10) {
        isAudit && this.columns.shift()
        // !isStatus && this.columns.unshift(...checkStatusC)
      } else {
        isAudit && this.columns.shift()
        isStatus && this.columns.shift()
      }
    },
    reset () {
      this.queryParam = {
        time: [],
        companyId: undefined,
        status: undefined,
        contractStatus: undefined
      }
      this.changeStatus()
      this.setcompanyId()
      this.$refs.table.refresh(true)
    },
    changeStatus () {
      const index = +this.tabActiveKey
      if (index !== 0) {
        if (index < 10) {
          this.queryParam.status = String(index)
        } else {
          this.queryParam.contractStatus = index - 10
        }
      } else {
        this.queryParam.status = undefined
        this.queryParam.contractStatus = undefined
      }
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
        title: '删除合同',
        content: `确认删除 "${contractName}" 吗？`,
        icon: () =>
          this.$createElement('a-icon', {
            props: {
              type: 'exclamation-circle',
              theme: 'filled'
            }
          }),
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
        success &&
          this.$router.push({
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
</style>
