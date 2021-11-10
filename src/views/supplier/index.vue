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
                    >{{ option.text }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
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
            <template v-if="!isParentCompany || advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="供应物料">
                  <material-type-select
                    v-model="queryParam.material"
                  ></material-type-select>
                </a-form-item>
              </a-col>
            </template>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="创建时间">
                  <a-range-picker
                    v-model="queryParam.ctime"
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
        table-layout="fixed"
        class="combined-table"
        :columns="columns"
        :data="loadData"
        :alert="{ clear: true }"
        :rowSelection="rowSelection"
        :showPagination="true"
        :scroll="{ x: 2000 }"
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
                permissions.UpdatePermission &&
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
            table-layout="fixed"
            :columns="footerColumns"
            :rowSelection="{}"
            :dataSource="footerData"
            :pagination="false"
            :showHeader="false"
            :scroll="{ x: 2000 }"
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
        label="供应商"
        :show-value="supplierName"
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
  SupplierTypeSelect,
  MaterialTypeSelect,
  TimeWait,
  AdvancedForm
} from '@/components'
import {
  getSupplierList,
  removeSupplier,
  auditSupp,
  auditBatchSupp
} from '@/api/supplier'
import { getIsAuditSet } from '@/api/common'
import setCompanyId from '@/mixins/setCompanyId'
import beforeRouteLeave from '@/mixins/beforeRouteLeave'

const checkTimec = {
  title: '审核时间',
  dataIndex: 'auditTime',
  scopedSlots: { customRender: 'auditTime' }
}

const checkStatusC = {
  title: '审核状态',
  dataIndex: 'statusv'
}

export default {
  name: 'SupplierIndex',
  mixins: [setCompanyId, beforeRouteLeave],
  components: {
    STable,
    CheckForm,
    ProjectSelect,
    CompanySelect,
    SupplierTypeSelect,
    MaterialTypeSelect,
    TimeWait,
    AdvancedForm
  },
  data () {
    return {
      tabActiveKey: '0',
      columns: [
        {
          title: '审核状态',
          width: 90,
          dataIndex: 'statusv'
        },
        {
          title: '供应商ID',
          dataIndex: 'idv',
          width: 120,
          customRender: text => {
            return <div class="contract-statusv">{text}</div>
          }
        },
        {
          title: '供应商',
          dataIndex: 'supplierName',
          customRender: text => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '类型',
          dataIndex: 'supplierTypeName',
          customRender: text => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          dataIndex: 'materialCount',
          width: 130,
          sorter: true,
          title: () => {
            return (
              <div>
                供应物料
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>物料的种类</span>
                  </template>
                  <a-icon type="exclamation-circle" />
                </a-tooltip>
              </div>
            )
          }
        },
        {
          title: '合同',
          dataIndex: 'contractCount',
          width: 80,
          sorter: true
        },
        {
          title: '合同金额',
          dataIndex: 'contractMoney',
          customRender (text) {
            return +text ? `￥${text}` : '--'
          }
        },
        {
          title: '订单金额',
          dataIndex: 'orderPrice',
          customRender (text) {
            return +text ? `￥${text}` : '--'
          }
        },
        {
          title: '已付款',
          dataIndex: 'paid',
          sorter: true,
          customRender (text) {
            return +text ? `￥${text}` : '--'
          }
        },
        {
          title: '未付款',
          dataIndex: 'unpaid',
          sorter: true,
          customRender (text) {
            return +text ? `￥${text}` : '--'
          }
        },
        {
          title: '已开票',
          dataIndex: 'invoiced',
          sorter: true,
          customRender (text) {
            return +text ? `￥${text}` : '--'
          }
        },
        {
          title: '未开票',
          dataIndex: 'notInvoiced',
          sorter: true,
          customRender (text) {
            return +text ? `￥${text}` : '--'
          }
        },
        {
          title: '创建时间',
          dataIndex: 'ctime',
          width: 160
        },
        {
          title: '操作',
          fixed: 'right',
          class: 'nowrap',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // create model
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
        status: undefined,
        projectId: '',
        companyId: '',
        supplierType: '',
        searchText: '',
        material: undefined,
        ctime: []
      },
      footerColumns: [
        {
          title: '审核状态',
          class: 'first-td',
          width: 90,
          dataIndex: 'statusv'
        },
        {
          title: '供应商ID',
          dataIndex: 'idv',
          width: 120
        },
        {
          title: '供应商'
        },
        {
          title: '类型'
        },
        {
          dataIndex: 'materialCount',
          width: 130
        },
        {
          title: '合同',
          width: 80
        },
        {
          title: '合同金额',
          dataIndex: 'contractMoney',
          customRender (text) {
            return +text ? `￥${text}` : '--'
          }
        },
        {
          title: '订单金额',
          dataIndex: 'orderPrice',
          customRender (text) {
            return +text ? `￥${text}` : '--'
          }
        },
        {
          title: '已付款',
          dataIndex: 'paid',
          sorter: true,
          customRender (text) {
            return +text ? `￥${text}` : '--'
          }
        },
        {
          title: '未付款',
          dataIndex: 'unpaid',
          sorter: true,
          customRender (text) {
            return +text ? `￥${text}` : '--'
          }
        },
        {
          title: '已开票',
          dataIndex: 'invoiced',
          sorter: true,
          customRender (text) {
            return +text ? `￥${text}` : '--'
          }
        },
        {
          title: '未开票',
          dataIndex: 'notInvoiced',
          sorter: true,
          customRender (text) {
            return +text ? `￥${text}` : '--'
          }
        },
        {
          title: '创建时间',
          width: 160
        },
        {
          title: '操作'
        }
      ],
      footerData: [],
      dsTotal: 0, // 待审核tab数量
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
        const queryParam = {}
        if (this.tabActiveKey !== '0') {
          queryParam.status = this.tabActiveKey
        }
        const requestParameters = Object.assign(
          {},
          parameter,
          this.queryParam,
          queryParam
        )
        return getSupplierList(requestParameters).then(res => {
          this.dsTotal = res.data.dsTotal
          if (+res.data.total) {
            this.footerData = [
              {
                id: '合计',
                idv: ['2', '3'].includes(this.tabActiveKey) ? '合计' : '',
                statusv: '合计',
                auditTime: '合计',
                contractMoney: res.data.allContractMoney,
                orderPrice: res.data.allOrderPrice,
                paid: res.data.allPaid,
                unpaid: res.data.allUnpaid,
                invoiced: res.data.allInvoiced,
                notInvoiced: res.data.allNotInvoiced
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
      supplierName: ''
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
        fixed: true,
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
  watch: {
    footerData (val) {
      if (val && val.length) {
        setTimeout(() => {
          var ele = document.getElementsByClassName('ant-table-body')[1]
          var table = document.getElementsByClassName('ant-table-body')[0]
          ele.addEventListener('scroll', function (e) {
            table.scrollLeft = ele.scrollLeft || 0
          })
        }, 10)
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
      this.footerColumns.find(column => column.dataIndex === 'idv').class = ''
      if (key === '1') {
        if (isStatus) {
          this.columns.shift()
          this.footerColumns.shift()
        }
        if (!isAudit) {
          this.columns.unshift({ ...checkTimec })
          this.footerColumns.unshift({ ...checkTimec, class: 'first-td' })
        }
      } else if (key === '0') {
        if (isAudit) {
          this.columns.shift()
          this.footerColumns.shift()
        }
        if (!isStatus) {
          this.columns.unshift({ ...checkStatusC })
          this.footerColumns.unshift({ ...checkStatusC, class: 'first-td' })
        }
      } else {
        if (isAudit) {
          this.columns.shift()
          this.footerColumns.shift()
        }
        if (isStatus) {
          this.columns.shift()
          this.footerColumns.shift()
        }
        this.footerColumns[0].class = 'first-td'
      }
    },
    openCheck ({ id, supplierName }) {
      if (id) {
        this.checkId = id
        this.supplierName = supplierName
      } else if (this.selectedRowKeys.length) {
        this.supplierName = this.selectedRows
          .map(data => data.supplierName)
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
            this.auditSupp(value)
          } else if (this.selectedRowKeys.length) {
            this.auditBatchSupp(value)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    auditSupp (value) {
      auditSupp({
        ...value,
        id: this.checkId
      }).then(({ message }) => {
        this.checkId = ''
        this.checkCall(message)
      })
    },
    auditBatchSupp (value) {
      auditBatchSupp({
        ...value,
        ids: this.selectedRowKeys
      }).then(({ message }) => {
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
    handleRemove ({ id, supplierName }) {
      const that = this
      this.$confirm({
        title: '删除供应商', // 用户名
        content: `确认删除 "${supplierName}" 吗？`,
        icon: h => <a-icon theme="filled" type="exclamation-circle" />,
        onOk () {
          removeSupplier({
            id
          }).then(({ data }) => {
            that.$message.success('删除供应商成功')
            that.$refs.table.refresh()
          })
        }
      })
    },
    goEdit ({ id }) {
      getIsAuditSet({
        auditType: 3
      }).then(({ success }) => {
        success &&
          this.$router.push({
            name: 'SupplierEdit',
            query: {
              id
            }
          })
      })
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

<style scoped lang="less" src="../../styles/combined-table.less"></style>
