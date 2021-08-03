<template>
  <page-header-wrapper>
    <a-card class="search-card" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form ref="form" layout="inline">
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
            <template v-if="!isParentCompany || advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="合同">
                  <a-input
                    v-model="queryParam.serachContractText"
                    placeholder="编号、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
            </template>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="付款情况">
                  <pay-status-select
                    v-model="queryParam.payStatus"
                    type="1"
                  ></pay-status-select>
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
            </template>
            <advanced-form
              v-model="advanced"
              :md="isParentCompany ? 8 : 16"
              @reset="reset"
              @search="$refs.table.refresh(true)"
            ></advanced-form>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="table-operator">
        <a-button v-if="permissions.ExportPermission" @click="openExport"
          >导出</a-button
        >
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <template slot="supplierName" slot-scope="text, record">
          <router-link
            :to="{ name: 'SupplierDetail', query: { id: record.supplierId } }"
            >{{ text }}</router-link
          >
        </template>
        <template slot="contractMoney" slot-scope="text, record">
          <router-link
            v-if="+text"
            :to="{ name: 'ContractDetail', query: { id: record.contractId } }"
            >￥{{ text }}</router-link
          >
          <template v-else>--</template>
        </template>
        <template slot="remarks" slot-scope="text, record">
          <a-input v-if="record.editable" v-model="record.bbBz" />
          <template v-else>
            {{ text }}
          </template>
        </template>

        <template slot="action" slot-scope="text, record, index">
          <span class="table-action" v-if="record.editable">
            <a @click="save(index, record)">保存</a>
            <a-popconfirm title="是否取消？" @confirm="cancel(index)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span class="table-action" v-else>
            <a v-if="permissions.UpdatePermission" @click="handleEdit(index)"
              >备注</a
            >
          </span>
        </template>
      </s-table>
    </a-card>
    <export-type-modal
      v-model="visible"
      eUrl="/operate/report/paidReportExcel"
      wUrl="/operate/report/paidReportWord"
      :params="queryParam"
    ></export-type-modal>
  </page-header-wrapper>
</template>

<script>
import {
  STable,
  ProjectSelect,
  CompanySelect,
  PayStatusSelect,
  AdvancedForm
} from '@/components'
import exportTypeModal from './components/exportTypeModal'
import { getStockList, updatePaidRepBz } from '@/api/report'
import cloneDeep from 'lodash.clonedeep'
import setCompanyId from '@/mixins/setCompanyId'

const columns = [
  {
    title: '所属项目',
    dataIndex: 'projectName',
    width: '9%'
  },
  {
    title: '订单ID',
    dataIndex: 'idv'
  },
  {
    title: '供应商ID',
    dataIndex: 'supplierIdv',
    width: '9%'
  },
  {
    title: '供应商',
    dataIndex: 'supplierName',
    scopedSlots: { customRender: 'supplierName' },
    width: '14%'
  },
  {
    title: '合同金额',
    dataIndex: 'contractMoney',
    scopedSlots: { customRender: 'contractMoney' },
    width: '11%'
  },
  {
    title: '已付款金额',
    dataIndex: 'paid',
    sort: true,
    width: '11%',
    customRender (text) {
      return +text ? `￥${text}` : '--'
    }
  },
  {
    title: '未付款金额',
    dataIndex: 'unpaid',
    sort: true,
    width: '12%',
    customRender (text) {
      return +text ? `￥${text}` : '--'
    }
  },
  {
    title: '备注',
    dataIndex: 'bbBz',
    scopedSlots: { customRender: 'remarks' },
    width: '14%'
  },
  {
    title: '操作',
    width: '90px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'reportPaid',
  mixins: [setCompanyId],
  components: {
    STable,
    ProjectSelect,
    CompanySelect,
    PayStatusSelect,
    exportTypeModal,
    AdvancedForm
  },
  data () {
    this.columns = columns
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      visible: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      tableData: [],
      cacheData: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getStockList(requestParameters).then(res => {
          this.tableData = res.data.records
          this.cacheData = cloneDeep(res.data.records)
          return res
        })
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
      } else if (!this.tableData || !this.tableData.length) {
        this.$message.warning('当前项目有没有数据')
      } else {
        this.visible = true
      }
    },
    handleEdit (index) {
      const target = this.tableData[index]
      if (target) {
        this.setEditable(index, true)
      }
    },
    save (index, { id, bbBz }) {
      updatePaidRepBz({
        id,
        bbBz
      }).then(({ data }) => {
        this.setEditable(index, false)
        this.cacheData = cloneDeep(this.tableData)
      })
    },
    cancel (index) {
      this.$set(this.tableData, index, cloneDeep(this.cacheData[index]))
      this.setEditable(index, false)
    },
    setEditable (index, value) {
      this.$set(this.tableData[index], 'editable', value)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-table-thead > tr > th,
/deep/ .ant-table-tbody > tr > td {
  padding-right: 0;
}
</style>
