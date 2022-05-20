<template>
  <page-header-wrapper>
    <a-card class="search-card" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
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
            <a-col :md="8" :sm="24">
              <a-form-item label="订单">
                <a-input
                  v-model="queryParam.orderId"
                  placeholder="ID"
                ></a-input>
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
                    type="1"
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
              :md="isParentCompany ? 24 : 8"
              @search="$refs.table.refresh(true)"
              @reset="reset"
            ></advanced-form>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="table-operator">
        <a-button v-if="permissions.ExportPermission" @click="exportReport"
          >导出</a-button
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
        :rowClassName="rowClass"
        :rowSelectionPaging="true"
        :showPagination="true"
      >
        <div slot="orderNum" slot-scope="text" style="min-width: 48px;">
          {{ text }}
        </div>
        <span class="table-action" slot="action" slot-scope="text, record">
          <template>
            <a @click="goDetail(record)">查看</a>
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
  </page-header-wrapper>
</template>

<script>
import {
  STable,
  ProjectSelect,
  CompanySelect,
  ContractTypeSelect,
  PayStatusSelect,
  AdvancedForm
} from '@/components'
import { getContractReport } from '@/api/report'
import { changeJSON2QueryString } from '@/utils/util'
import setCompanyId from '@/mixins/setCompanyId'
import cloneDeep from 'lodash.clonedeep'

export default {
  name: 'reportContract',
  mixins: [setCompanyId],
  components: {
    STable,
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
        contractStatus: undefined,
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
          title: '合同状态',
          dataIndex: 'contractStatusv',
          class: 'nowrap',
          customRender: text => {
            return <div class="contract-statusv">{text}</div>
          }
        },
        {
          title: '所属项目',
          dataIndex: 'projectName',
          width: '15%',
          customRender: text => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '合同编号',
          dataIndex: 'contractNo',
          sorter: true,
          customRender: text => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          customRender: text => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '合同金额',
          dataIndex: 'contractMoney',
          sorter: true,
          customRender (text) {
            return +text ? `￥${text}` : '--'
          }
        },
        {
          title: '订单',
          dataIndex: 'orderNum',
          sorter: true,
          scopedSlots: { customRender: 'orderNum' }
        },
        {
          title: '订单金额',
          dataIndex: 'orderPrice',
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
          width: '64px',
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
        return getContractReport(
          Object.assign(parameter, params)
        ).then(res => {
          this.footerData = [
            {
              id: 'total',
              contractStatusv: '合计',
              contractMoney: res.data.allContractMoney,
              orderPrice: res.data.allOrderPrice
            }
          ]
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      rowClass: (record) => {
        if (+record.contractStatus === 3) {
          return 'termination-row'
        }
      }
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
      const baseUrl =
        process.env.NODE_ENV === 'production'
          ? process.env.VUE_APP_API_BASE_URL
          : '/api'
      const params = {
        ...this.queryParam,
        ids: this.selectedRowKeys.join(',')
      }
      location.href = `${baseUrl}/operate/report/contractReportExcel?${changeJSON2QueryString(
        params
      )}`
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
/deep/ .ant-table-footer {
  background: #fff;
  padding: 0;
  .table-footer {
    font-weight: bold;
    .ant-checkbox {
      display: none;
    }
    .contract-statusv {
      position: absolute;
      left: 22px;
      top: 16px;
    }
  }
}
/deep/ .termination-row {
  background: #FAFAFA;
}
</style>
