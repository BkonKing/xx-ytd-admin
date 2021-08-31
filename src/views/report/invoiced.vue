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
                <a-form-item label="开票情况">
                  <kp-status-select
                    v-model="queryParam.kpStatus"
                    type="1"
                  ></kp-status-select>
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
        table-layout="fixed"
        :columns="columns"
        :data="loadData"
        :showPagination="true"
      >
        <template slot="supplierName" slot-scope="text, record">
          <router-link
            class="two-Multi"
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
            <a @click="cancel(index)">取消</a>
          </span>
          <span class="table-action" v-else>
            <a v-if="permissions.UpdatePermission" @click="handleEdit(index)"
              >备注</a
            >
          </span>
        </template>

        <template slot="footer">
          <a-table
            v-if="footerData && footerData.length"
            class="table-footer"
            size="default"
            rowKey="id"
            :columns="columns"
            :dataSource="footerData"
            :pagination="false"
            :showHeader="false"
          >
            <template slot="contractMoney" slot-scope="text">
              {{+text ? `￥${text}` : '--' }}
            </template></a-table
          >
        </template>
      </s-table>
    </a-card>
    <export-type-modal
      v-model="visible"
      eUrl="/operate/report/invoicedReportExcel"
      wUrl="/operate/report/invoicedReportWord"
      :params="queryParam"
    ></export-type-modal>
  </page-header-wrapper>
</template>

<script>
import {
  STable,
  ProjectSelect,
  CompanySelect,
  KpStatusSelect,
  AdvancedForm
} from '@/components'
import exportTypeModal from './components/exportTypeModal'
import { getInvoicedReport, updateInvoicedRepBz } from '@/api/report'
import cloneDeep from 'lodash.clonedeep'
import setCompanyId from '@/mixins/setCompanyId'

export default {
  name: 'reportInvoiced',
  mixins: [setCompanyId],
  components: {
    STable,
    ProjectSelect,
    CompanySelect,
    KpStatusSelect,
    exportTypeModal,
    AdvancedForm
  },
  data () {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      visible: false,
      // 高级搜索 展开/关闭
      advanced: true,
      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '所属项目',
          dataIndex: 'projectName',
          width: '15%',
          customRender: (text) => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '开票日期',
          dataIndex: 'kpDate'
        },
        {
          title: '订单ID',
          dataIndex: 'idv'
        },
        {
          title: '供应商ID',
          dataIndex: 'supplierIdv'
        },
        {
          title: '供应商',
          dataIndex: 'supplierName',
          scopedSlots: { customRender: 'supplierName' }
        },
        {
          title: '合同金额',
          dataIndex: 'contractMoney',
          scopedSlots: { customRender: 'contractMoney' }
        },
        {
          title: '订单总额',
          dataIndex: 'orderPrice',
          customRender (text) {
            return +text ? `￥${text}` : '--'
          }
        },
        {
          title: '已开票金额',
          dataIndex: 'invoiced',
          sort: true,
          customRender (text) {
            return +text ? `￥${text}` : '--'
          }
        },
        {
          title: '未开票金额',
          dataIndex: 'notInvoiced',
          sort: true,
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
      ],
      tableData: [],
      cacheData: [],
      footerData: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getInvoicedReport(requestParameters).then(res => {
          this.tableData = res.data.records
          this.cacheData = cloneDeep(res.data.records)
          this.footerData = [
            {
              id: 'total',
              projectName: '合计',
              contractMoney: res.data.allContractMoney,
              orderPrice: res.data.allPrice,
              invoiced: res.data.allInvoiced,
              notInvoiced: res.data.allNotInvoiced
            }
          ]
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
      this.visible = true
    },
    exportReport () {},
    handleEdit (index) {
      const target = this.tableData[index]
      if (target) {
        this.setEditable(index, true)
      }
    },
    save (index, { id, bbBz }) {
      updateInvoicedRepBz({
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
/deep/ .ant-table-footer {
  background: #fff;
  padding: 0;
  .table-footer {
    font-weight: bold;
  }
}
</style>
