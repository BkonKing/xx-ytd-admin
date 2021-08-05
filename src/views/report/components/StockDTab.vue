<template>
  <div>
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
                <a-form-item label="规格型号">
                  <a-input
                    v-model="queryParam.serachModelText"
                    placeholder="请输入"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="物料品牌">
                  <a-input
                    v-model="queryParam.serachBrandText"
                    placeholder="请输入"
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
        <a-button v-if="permissions.ExportPermission" @click="exportReport"
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
        <span class="table-action" slot="action" slot-scope="text, record">
          <a @click="goDetail(record)">查看</a>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import {
  STable,
  ProjectSelect,
  CompanySelect,
  AdvancedForm
} from '@/components'
import { changeJSON2QueryString } from '@/utils/util'
import { getStockReport } from '@/api/report'
import setCompanyId from '@/mixins/setCompanyId'

export default {
  name: 'StockTab',
  mixins: [setCompanyId],
  components: {
    STable,
    ProjectSelect,
    CompanySelect,
    AdvancedForm
  },
  data () {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      // 高级搜索 展开/关闭
      advanced: true,
      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '库存ID',
          dataIndex: 'id',
          width: '52px'
        },
        {
          title: '所属项目',
          dataIndex: 'projectName',
          width: '12%',
          customRender: (text) => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '物料名称',
          dataIndex: 'materialName',
          width: '12%',
          customRender: (text) => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '物料品牌',
          dataIndex: 'brand',
          width: '12%',
          customRender: (text) => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '规格型号',
          dataIndex: 'model',
          width: '12%',
          customRender: (text) => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '单位',
          dataIndex: 'unitv',
          width: '50px'
        },
        {
          title: '现有库存',
          dataIndex: 'currentNum',
          sort: true,
          width: '84px'
        },
        {
          title: '期初库存',
          dataIndex: 'originalNum',
          sort: true,
          scopedSlots: { customRender: 'originalNum' },
          width: '84px'
        },
        {
          title: '总入库',
          dataIndex: 'totalLknum',
          sorter: true,
          width: '70px'
        },
        {
          title: '总出库',
          dataIndex: 'totalCknum',
          sorter: true,
          width: '70px'
        },
        {
          title: '备注',
          dataIndex: 'remarks',
          width: '140px',
          scopedSlots: { customRender: 'remarks' }
        },
        {
          title: '操作',
          class: 'nowrap max-width',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getStockReport(requestParameters)
      }
    }
  },
  methods: {
    // 导出
    exportReport () {
      if (!this.queryParam.projectId) {
        this.$message.warning('请选择项目')
      } else {
        const baseUrl =
          process.env.NODE_ENV === 'production'
            ? process.env.VUE_APP_API_BASE_URL
            : '/api'
        location.href = `${baseUrl}/operate/report/stockReportExcel?${changeJSON2QueryString(
          this.queryParam
        )}`
      }
    },
    goDetail ({ id }) {
      this.$router.push({
        name: 'stockDetail',
        query: {
          id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-table-thead > tr > th,
/deep/ .ant-table-tbody > tr > td {
  padding-left: 8px;
  padding-right: 0;
}
/deep/ .max-width {
  max-width: 52px;
  width: 52px;
  padding-right: 8px !important;
}
</style>
