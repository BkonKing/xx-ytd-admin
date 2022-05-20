<template>
  <div>
    <a-card
      title="合同"
      style="margin-top: 24px"
      :bordered="false"
    >
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="审核状态">
                <a-select v-model="queryParam.status" placeholder="请选择">
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
                    style="width: 100%;"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item>
                  <template v-slot:label>
                    <a-row
                      type="flex"
                      align="middle"
                      style="display: inline-flex;"
                    >
                      <span>合同物料</span>
                      <a-tooltip placement="top">
                        <template slot="title">
                          <span>合同设置的物料</span>
                        </template>
                        <a-icon type="exclamation-circle" />
                      </a-tooltip>
                    </a-row>
                  </template>
                  <a-input
                    v-model="queryParam.serachMaterialText"
                    placeholder="编码、名称"
                  ></a-input>
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

      <combined-table
        ref="table"
        :columns="columns"
        :data="loadData"
        :footerData="footerData"
        :rowClassName="rowClass"
        :showPagination="true"
        :scroll="{ x: 3300 }"
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
          <a @click="goDetail(record)">查看</a>
        </span>
      </combined-table>
    </a-card>
  </div>
</template>

<script>
import {
  CombinedTable,
  TimeWait,
  ProjectSelect,
  CompanySelect,
  ContractTypeSelect,
  PayStatusSelect,
  AdvancedForm
} from '@/components'
import { getSupplierContractList } from '@/api/supplier'
import cloneDeep from 'lodash.clonedeep'

export default {
  name: 'ContractTab',
  props: {
    id: {
      type: [Number, String],
      default: ''
    }
  },
  components: {
    CombinedTable,
    TimeWait,
    ProjectSelect,
    CompanySelect,
    ContractTypeSelect,
    PayStatusSelect,
    AdvancedForm
  },
  data () {
    return {
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
          value: '0',
          text: '全部'
        },
        {
          value: '1',
          text: '正常'
        },
        {
          value: '2',
          text: '延期'
        },
        {
          value: '3',
          text: '终止'
        }
      ],
      // 查询参数
      queryParam: {
        time: [],
        // signDate: [],
        companyId: undefined,
        status: undefined,
        contractStatus: undefined
      },
      columns: [
        {
          title: '所属项目',
          width: '120px',
          dataIndex: 'projectName',
          customRender: text => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '合同编号',
          width: 160,
          sorter: true,
          dataIndex: 'contractNo'
        },
        {
          title: '合同名称',
          width: '140px',
          dataIndex: 'contractName',
          customRender: text => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '类型',
          width: '140px',
          dataIndex: 'categoryName',
          customRender: text => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '物料',
          width: '140px',
          dataIndex: 'categoryName1',
          customRender: text => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '合同金额',
          class: 'nowrap',
          width: 130,
          dataIndex: 'contractMoney',
          sorter: true,
          customRender (text) {
            return `￥${text}`
          }
        },
        {
          title: '总量',
          class: 'nowrap',
          width: 100,
          dataIndex: 'contractTotal'
        },
        {
          title: '税率',
          width: '80px',
          class: 'nowrap',
          removeFooterCustom: true,
          dataIndex: 'taxRate',
          customRender (text) {
            const number = parseFloat(text)
            return number ? `${number}%` : number
          }
        },
        {
          title: '签订日期',
          width: '120px',
          dataIndex: 'signDate'
        },
        {
          title: '有效期',
          width: '200px',
          removeFooterCustom: true,
          dataIndex: 'startDate',
          customRender (text, row) {
            return `${text}~${row.endDate}`
          }
        },
        {
          title: '结算方式',
          width: '120px',
          dataIndex: 'settleTypeName'
        },
        {
          title: '付款方式',
          width: '100px',
          dataIndex: 'payTypeName'
        },
        {
          title: '订单',
          class: 'nowrap',
          width: 110,
          dataIndex: 'orderNum',
          sorter: true
        },
        {
          title: '订单总额',
          class: 'nowrap',
          width: 130,
          sorter: true,
          dataIndex: 'orderMoney',
          customRender (text) {
            return `￥${text}`
          }
        },
        {
          title: '已付款',
          class: 'nowrap',
          width: 130,
          sorter: true,
          dataIndex: 'paid',
          customRender (text) {
            return text === '--' ? '--' : `￥${text}`
          }
        },
        {
          title: '未付款',
          class: 'nowrap',
          width: 130,
          sorter: true,
          dataIndex: 'unpaid',
          customRender (text) {
            return text === '--' ? '--' : `￥${text}`
          }
        },
        {
          title: '已开票',
          class: 'nowrap',
          width: 130,
          sorter: true,
          dataIndex: 'invoiced',
          customRender (text) {
            return text === '--' ? '--' : `￥${text}`
          }
        },
        {
          title: '未开票',
          class: 'nowrap',
          width: 130,
          sorter: true,
          dataIndex: 'notInvoiced',
          customRender (text) {
            return text === '--' ? '--' : `￥${text}`
          }
        },
        {
          title: '合同状态',
          width: '100px',
          dataIndex: 'contractStatusv'
        },
        {
          title: '审核状态',
          width: '100px',
          dataIndex: 'statusv'
        },
        {
          title: '审核时间',
          dataIndex: 'auditTime',
          width: '130px',
          scopedSlots: { customRender: 'auditTime' }
        },
        {
          title: '备注',
          width: '150px',
          dataIndex: 'remarks',
          customRender: text => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '创建时间',
          width: '110px',
          dataIndex: 'ctime'
        },
        {
          title: '操作',
          fixed: 'right',
          class: 'nowrap',
          width: 45,
          scopedSlots: { customRender: 'action' }
        }
      ],
      footerData: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const params = cloneDeep(this.queryParam)
        const time = params.time
        if (time && time.length) {
          params.startDate = time[0]
          params.endDate = time[1]
        }
        // const signDate = params.signDate
        // if (signDate && signDate.length) {
        //   params.signStartDate = signDate[0]
        //   params.signEndDate = signDate[1]
        // }
        return getSupplierContractList(
          Object.assign(parameter, params, { supplierId: this.id })
        ).then(res => {
          if (+res.data.total) {
            this.footerData = [
              {
                id: 'total',
                projectName: '合计',
                action: '',
                contractMoney: res.data.allContractMoney,
                orderMoney: res.data.allOrderPrice,
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
      rowClass: record => {
        if (+record.contractStatus === 3) {
          return 'termination-row'
        }
      }
    }
  },
  methods: {
    reset () {
      this.queryParam = {
        time: [],
        // signDate: [],
        companyId: undefined,
        status: undefined,
        contractStatus: undefined
      }
      this.$refs.table.refresh(true)
    },
    goDetail ({ id }) {
      const routeUrl = this.$router.resolve({
        name: 'ContractDetail',
        query: {
          id
        }
      })
      window.open(routeUrl.href, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.table-page-search-wrapper
  /deep/
  .ant-form-inline
  .ant-form-item
  > .ant-form-item-label {
  min-width: 92px;
}
/deep/ .ant-table-row-cell-last {
  padding-left: 8px;
  padding-right: 8px;
}
/deep/ .ant-table-fixed-right .nowrap {
  padding-left: 8px;
  padding-right: 8px;
}
/deep/ .termination-row {
  background: #fafafa;
}
</style>
