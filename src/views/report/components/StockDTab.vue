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
            <a-col :md="8" :sm="24">
              <a-form-item label="所属公司">
                <company-select v-model="queryParam.companyId"></company-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="物料">
                  <a-input
                    v-model="queryParam.serachMaterialText"
                    placeholder="编码、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
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
            <a-col :md="8" :sm="24">
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
        <a-button @click="openExport">导出</a-button>
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
    <export-type-modal
      v-model="visible"
      @select="exportReport"
    ></export-type-modal>
  </div>
</template>

<script>
import { STable, ProjectSelect, CompanySelect } from '@/components'
import exportTypeModal from './exportTypeModal'
import { getStockReport } from '@/api/report'

const columns = [
  {
    title: '库存ID',
    dataIndex: 'id'
  },
  {
    title: '所属项目',
    dataIndex: 'projectName'
  },
  {
    title: '物料名称',
    dataIndex: 'materialName'
  },
  {
    title: '物料品牌',
    dataIndex: 'brand'
  },
  {
    title: '规格型号',
    dataIndex: 'model'
  },
  {
    title: '单位',
    dataIndex: 'unitv'
  },
  {
    title: '现有库存',
    dataIndex: 'currentNum',
    sort: true
  },
  {
    title: '期初库存',
    dataIndex: 'originalNum',
    sort: true,
    scopedSlots: { customRender: 'originalNum' }
  },
  {
    title: '总入库',
    dataIndex: 'totalLknum',
    sorter: true
  },
  {
    title: '总出库',
    dataIndex: 'totalCknum',
    sorter: true
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    scopedSlots: { customRender: 'remarks' }
  },
  {
    title: '操作',
    width: '80px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'StockTab',
  components: {
    STable,
    ProjectSelect,
    CompanySelect,
    exportTypeModal
  },
  data () {
    this.columns = columns
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      // 弹窗
      visible: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getStockReport(requestParameters)
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
      } else {
        this.visible = true
      }
    },
    exportReport () {},
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
.table-page-search-wrapper {
  /deep/ .ant-form-inline .ant-form-item > .ant-form-item-label {
    width: 80px;
  }
}
</style>
