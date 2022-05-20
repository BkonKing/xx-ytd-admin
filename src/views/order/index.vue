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
                  :disabled="tabActiveKey !== '0'"
                  placeholder="请选择"
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
            <template v-if="!isParentCompany || advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="物料">
                  <a-input
                    v-model="queryParam.serachMaterialText"
                    placeholder="编码、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
            </template>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="供应商">
                  <a-input
                    v-model="queryParam.serachSupplierText"
                    placeholder="ID、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="订单日期">
                  <a-range-picker
                    v-model="queryParam.orderDate"
                    valueFormat="YYYY-MM-DD"
                    style="width: 100%;"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="创建时间">
                  <a-range-picker
                    v-model="queryParam.time"
                    valueFormat="YYYY-MM-DD"
                    style="width: 100%;"
                  />
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
        table-layout="fixed"
        :columns="columns"
        :data="loadData"
        :alert="{ clear: true }"
        :rowSelection="rowSelection"
        :showPagination="true"
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

        <template slot="footer">
          <a-table
            v-if="footerData && footerData.length"
            class="table-footer"
            size="default"
            rowKey="id"
            :columns="columns"
            :rowSelection="{}"
            :dataSource="footerData"
            :pagination="false"
            :showHeader="false"
          >
          </a-table>
        </template>
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
import {
  STable,
  CheckForm,
  ProjectSelect,
  CompanySelect,
  AdvancedForm,
  TimeWait
} from '@/components'
import {
  getOrderList,
  removeOrder,
  auditOrder,
  auditBatchOrder
} from '@/api/order'
import { getIsAuditSet } from '@/api/common'
import setCompanyId from '@/mixins/setCompanyId'
import beforeRouteLeave from '@/mixins/beforeRouteLeave'

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
  name: 'OrderIndex',
  mixins: [setCompanyId, beforeRouteLeave],
  components: {
    STable,
    CheckForm,
    ProjectSelect,
    CompanySelect,
    AdvancedForm,
    TimeWait
  },
  data () {
    return {
      tabActiveKey: '0',
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
      // 查询参数
      queryParam: {
        companyId: ''
      },
      columns: [
        {
          title: '审核状态',
          class: 'nowrap',
          dataIndex: 'statusv'
        },
        {
          title: '所属项目',
          dataIndex: 'projectName',
          customRender: text => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '订单ID',
          dataIndex: 'idv',
          customRender: text => {
            return <div class="contract-statusv">{text}</div>
          }
        },
        {
          title: '物料数量',
          dataIndex: 'materialNum',
          class: 'nowrap',
          sorter: true
        },
        {
          title: '订单金额',
          dataIndex: 'orderPrice',
          class: 'nowrap',
          sorter: true,
          customRender (text) {
            return +text ? `￥${text}` : '--'
          }
        },
        {
          title: '创建时间',
          dataIndex: 'ctime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          class: 'nowrap',
          scopedSlots: { customRender: 'action' }
        }
      ],
      footerData: [],
      dsTotal: 0, // 待审核tab数量
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const time = this.queryParam.time
        const orderDate = this.queryParam.orderDate
        let startDate = ''
        let endDate = ''
        let orderStartDate = ''
        let orderEndDate = ''
        if (time && time.length) {
          startDate = time[0]
          endDate = time[1]
        }
        if (orderDate && orderDate.length) {
          orderStartDate = orderDate[0]
          orderEndDate = orderDate[1]
        }
        this.queryParam.startDate = startDate
        this.queryParam.endDate = endDate
        this.queryParam.orderStartDate = orderStartDate
        this.queryParam.orderEndDate = orderEndDate
        const queryParam = {}
        if (this.tabActiveKey !== '0') {
          queryParam.status = this.tabActiveKey
        }
        return getOrderList(
          Object.assign(parameter, this.queryParam, queryParam)
        ).then(res => {
          this.dsTotal = res.data.dsTotal
          if (+res.data.total) {
            this.footerData = [
              {
                id: 'total',
                idv: '合计',
                orderPrice: res.data.allPrice,
                allPaid: res.data.allPaid,
                allUnpaid: res.data.allUnpaid
              }
            ]
          } else {
            this.footerData = []
          }
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      checkId: '',
      idv: ''
    }
  },
  computed: {
    // 审核状态：0=全部、1=待审核、2=已通过、3=未通过
    tabList () {
      const dsTotal = +this.dsTotal ? ` ${this.dsTotal}` : ''
      return [
        { key: '0', tab: '全部' },
        { key: '1', tab: `待审核${dsTotal}` },
        { key: '2', tab: '已通过' },
        { key: '3', tab: '未通过' }
      ]
    },
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
      this.changeColumns(tab)
    }
  },
  methods: {
    handleTabChange (key) {
      this.tabActiveKey = key
      this.queryParam = { companyId: '' }
      this.setcompanyId()
      this.changeColumns(key)
      this.$refs.table.refresh()
    },
    changeColumns (key) {
      // 是否有审核时间
      const isAudit =
        this.columns.findIndex(column => column.dataIndex === 'auditTime') > -1
      // 是否有审核状态
      const isStatus =
        this.columns.findIndex(column => column.dataIndex === 'statusv') > -1
      if (key === '1') {
        isStatus && this.columns.shift()
        !isAudit && this.columns.unshift(...checkTimec)
      } else if (key === '0') {
        isAudit && this.columns.shift()
        !isStatus && this.columns.unshift(...checkStatusC)
      } else {
        isAudit && this.columns.shift()
        isStatus && this.columns.shift()
      }
    },
    openCheck ({ id, idv }) {
      if (id) {
        this.checkId = id
        this.idv = idv
      } else if (this.selectedRowKeys.length) {
        this.idv = this.selectedRows.map(data => data.idv).join('，')
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
      getIsAuditSet({
        auditType: 1
      }).then(({ success }) => {
        success &&
          this.$router.push({
            name: 'OrderEdit',
            query: {
              id
            }
          })
      })
    },
    handleRemove ({ id, idv }) {
      const that = this
      this.$confirm({
        title: '删除订单', // 用户名
        content: `确认删除 "${idv}" 吗？`,
        icon: () =>
          this.$createElement('a-icon', {
            props: {
              type: 'exclamation-circle',
              theme: 'filled'
            }
          }),
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
.status-tag {
  position: relative;
  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    margin-top: -2px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: -10px;
  }
}
.success-tag {
  &::before {
    background: @success-color;
  }
  span {
    color: @success-color;
  }
}
.error-tag {
  &::before {
    background: @error-color;
  }
  span {
    color: @error-color;
  }
}
.warning-tag {
  &::before {
    background: @warning-color;
  }
  span {
    color: @warning-color;
  }
}
</style>
