<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="handleTabChange"
  >
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
                <a-form-item label="出入库时间">
                  <a-range-picker
                    v-model="queryParam.time"
                    valueFormat="YYYY-MM-DD"
                    style="width: 100%;"
                  />
                </a-form-item>
              </a-col>
            </template>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="类型">
                  <a-select v-model="queryParam.stockType" placeholder="请选择" :disabled="tabActiveKey !== '0'">
                    <a-select-option
                      v-for="item in tabList"
                      :value="item.key"
                      :key="item.key"
                    >
                      {{ item.tab }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
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
                <a-form-item label="物料用途">
                  <a-input
                    v-model="queryParam.serachRemarksText"
                    placeholder="请输入"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="记录ID">
                  <a-input
                    v-model="queryParam.clkId"
                    placeholder="请输入"
                  ></a-input>
                </a-form-item>
              </a-col>
            </template>
            <advanced-form
              v-model="advanced"
              :md="isParentCompany ? 8 : 16"
              @search="$refs.table.refresh(true)"
              @reset="() => (this.queryParam = {})"
            ></advanced-form>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="table-operator">
        <a-button
          v-if="permissions.CreatePermission"
          type="primary"
          @click="goAdd"
          >新增出库单</a-button
        >
        <a-button v-if="permissions.PrintPermission" @click="print"
          >打印出库单</a-button
        >
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="checkTime" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>

        <span class="table-action" slot="action" slot-scope="text, record">
          <template>
            <a @click="goDetail(record)">查看</a>
            <a
              v-if="record.stockType !== '1' && permissions.UpdatePermission"
              @click="goEdit(record)"
              >编辑</a
            >
            <a
              v-if="record.stockType !== '1' && permissions.RemovePermission"
              @click="handleRemove(record)"
              >删除</a
            >
          </template>
        </span>
      </s-table>
    </a-card>
    <record-detail-modal
      v-model="visible"
      :data="activeRecord"
    ></record-detail-modal>
  </page-header-wrapper>
</template>

<script>
// import moment from 'moment'
import {
  STable,
  ProjectSelect,
  CompanySelect,
  AdvancedForm
} from '@/components'
import { getStockClkList, removeStockCk } from '@/api/stock'
import RecordDetailModal from './components/RecordDetail'

const columns = [
  {
    title: '记录ID',
    dataIndex: 'id'
  },
  {
    title: '类型',
    dataIndex: 'stockTypeV'
  },
  {
    title: '所属项目',
    dataIndex: 'projectName'
  },
  {
    title: '物料',
    dataIndex: 'materiaCount',
    sorter: true
  },
  {
    title: '数量',
    dataIndex: 'materiaNum',
    sorter: true
  },
  {
    title: '领料部门',
    dataIndex: 'department'
  },
  {
    title: '出入库人',
    dataIndex: 'clkAdmin',
    sort: true
  },
  {
    title: '出入库时间',
    dataIndex: 'ctime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'TableList',
  components: {
    STable,
    RecordDetailModal,
    ProjectSelect,
    CompanySelect,
    AdvancedForm
  },
  data () {
    this.columns = columns
    return {
      tabList: [
        { key: '0', tab: '全部' },
        { key: '1', tab: '入库' },
        { key: '2', tab: '出库' }
      ],
      tabActiveKey: '0',
      // 审核弹窗
      visible: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        stockType: '',
        startDate: '',
        endDate: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const time = this.queryParam.time
        if (time && time.length) {
          this.queryParam.startDate = time[0]
          this.queryParam.endDate = time[1]
        }
        return getStockClkList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      activeRecord: {}
    }
  },
  computed: {
    rowSelection () {
      if (!this.permissions.PrintPermission) {
        return null
      }
      return {
        selectedRowKeys: this.selectedRowKeys,
        getCheckboxProps: record => ({
          props: {
            disabled: record.stockType === '1'
          }
        }),
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleTabChange (key) {
      this.tabActiveKey = key
      this.queryParam.stockType = key
      this.$refs.table.refresh(true)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    goAdd () {
      this.$router.push({
        name: 'stockEdit'
      })
    },
    print () {
      if (this.selectedRowKeys.length) {
      } else {
        this.$message.warning('请选择出库单')
      }
    },
    handleRemove ({ id }) {
      const that = this
      this.$confirm({
        content: '是否删除该记录？',
        onOk () {
          removeStockCk({
            id
          }).then(({ data }) => {
            that.$message.success('删除记录成功')
          })
        }
      })
    },
    goEdit ({ id }) {
      this.$router.push({
        name: 'stockEdit',
        query: {
          id
        }
      })
    },
    goDetail (record) {
      this.activeRecord = record
      this.visible = true
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log(selectedRowKeys, selectedRows)
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
