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
                <a-select v-model="queryParam.status" placeholder="请选择">
                  <a-select-option
                    v-for="option in tabList"
                    :value="option.key"
                    :key="option.key"
                  >
                    {{ option.tab }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="所属项目">
                <project-select v-model="queryParam.projectId"></project-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="所属公司">
                  <company-select
                    v-model="queryParam.companyId"
                  ></company-select>
                </a-form-item>
              </a-col>
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
                  <a-select
                    v-model="queryParam.payStatus"
                    placeholder="请选择"
                    default-value="0"
                  >
                    <a-select-option
                      v-for="option in payStatusOptions"
                      :value="option.value"
                      :key="option.value"
                    >
                      {{ option.text }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="开票情况">
                  <a-select
                    mode="multiple"
                    v-model="queryParam.kpStatus"
                    placeholder="请选择"
                  >
                    <a-select-option
                      v-for="option in kpStatusOptions"
                      :value="option.value"
                      :key="option.value"
                    >
                      {{ option.text }}
                    </a-select-option>
                  </a-select>
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
            <a-col :md="(!advanced && 8) || 16" :sm="24">
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
          @click="openCheck"
          >审核</a-button
        >
        <a-button @click="goEdit">新增</a-button>
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
        <!-- <span slot="checkTime" slot-scope="text, record, index">
          {{ text }}
        </span> -->

        <span class="table-action" slot="action" slot-scope="text, record">
          <template>
            <a @click="goDetail(record)">查看</a>
            <a @click="goEdit(record)">编辑</a>
            <a @click="handleRemove(record)">删除</a>
            <a v-if="+record.status === 0" @click="openCheck(record)">审核</a>
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
        label="订单"
        :show-value="idv"
        :selectedRowKeys="selectedRowKeys"
      ></check-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import { STable, CheckForm, ProjectSelect, CompanySelect } from '@/components'
import {
  getOrderList,
  removeOrder,
  auditOrder,
  auditBatchOrder
} from '@/api/order'

const checkColumn = [
  {
    title: '审核时间',
    dataIndex: 'auditTime',
    scopedSlots: { customRender: 'auditTime' }
  },
  {
    title: '审核状态',
    dataIndex: 'statusv'
  }
]

const columns = [
  {
    title: '审核时间',
    dataIndex: 'auditTime',
    scopedSlots: { customRender: 'auditTime' }
  },
  {
    title: '审核状态',
    dataIndex: 'statusv'
  },
  {
    title: '所属项目',
    dataIndex: 'projectName'
  },
  {
    title: '订单ID',
    dataIndex: 'idv'
  },
  {
    title: '物料数量',
    dataIndex: 'materialNum',
    sorter: true
  },
  {
    title: '金额',
    dataIndex: 'allPrice',
    sorter: true
  },
  {
    title: '付款情况',
    dataIndex: 'status'
  },
  {
    title: '创建时间',
    dataIndex: 'ctime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '180px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'TableList',
  components: {
    STable,
    CheckForm,
    ProjectSelect,
    CompanySelect
  },
  data () {
    this.columns = columns
    return {
      // 审核状态：0=全部、1=待审核、2=已通过、3=未通过
      tabList: [
        { key: '0', tab: '全部' },
        { key: '1', tab: '待审核' },
        { key: '2', tab: '已通过' },
        { key: '3', tab: '未通过' }
      ],
      tabActiveKey: '0',
      visible: false,
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 付款情况：0=全部、1=全部已付、2=全部未付、3=部分已付/未付
      payStatusOptions: [
        {
          text: '全部',
          value: '0'
        },
        {
          text: '全部已付',
          value: '1'
        },
        {
          text: '全部未付',
          value: '2'
        },
        {
          text: '部分已付/未付',
          value: '3'
        }
      ],
      // 开票情况：0=全部、1=全部已开、2=全部未开、3=部分已开/未开
      kpStatusOptions: [
        {
          text: '全部',
          value: '0'
        },
        {
          text: '全部已开',
          value: '1'
        },
        {
          text: '全部未开',
          value: '2'
        },
        {
          text: '部分已开/未开',
          value: '3'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const time = this.queryParam.time
        if (time && time.length) {
          this.queryParam.startDate = time[0]
          this.queryParam.endDate = time[1]
        }
        return getOrderList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      checkId: '',
      idv: ''
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
      this.queryParam.status = key
      if (+key < 2 && this.columns[0].dataIndex !== 'auditTime') {
        this.columns.unshift(...checkColumn)
      } else if (+key > 1 && this.columns[0].dataIndex !== 'id') {
        this.columns.shift()
        this.columns.shift()
      }
      this.$refs.table.refresh()
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    openCheck ({ id, idv }) {
      if (id) {
        this.checkId = id
        this.idv = idv
      } else if (this.selectedRowKeys.length) {
        this.idv = this.selectedRows
          .map(data => data.idv)
          .join('，')
      }
      this.visible = true
      this.$refs.CheckForm && this.$refs.CheckForm.resetFields()
    },
    handleCheckOk () {
      this.confirmLoading = true
      this.$refs.CheckForm.handleSubmit()
        .then(value => {
          if (this.checkId) {
            this.auditOrder(value)
          } else if (this.selectedRowKeys) {
            this.auditBatchOrder(value)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    auditOrder (value) {
      auditOrder({
        ...value,
        id: this.checkId
      }).then(({ data, message }) => {
        this.checkId = ''
        this.checkCall(message)
      })
    },
    auditBatchOrder (value) {
      auditBatchOrder({
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
    goEdit ({ id }) {
      this.$router.push({
        name: 'OrderEdit',
        query: {
          id
        }
      })
    },
    handleRemove ({ id, idv }) {
      const that = this
      this.$confirm({
        title: '删除人员', // 用户名
        content: `确认删除 "${idv}" 吗？`,
        onOk () {
          removeOrder({
            id
          }).then(({ data }) => {
            that.$message.success('删除订单成功')
            that.$refs.table.refresh()
          })
        }
      })
    },
    goDetail ({ id }) {
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
