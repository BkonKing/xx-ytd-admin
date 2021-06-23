<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="handleTabChange"
  >
    <a-card style="margin-top: 24px" :bordered="false">
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
                    >{{ option.tab }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="关联项目">
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
              <a-col :md="8" :sm="24">
                <a-form-item label="供应物料">
                  <a-select v-model="queryParam.material" placeholder="请选择">
                    <a-select-option
                      v-for="option in materialOptions"
                      :value="option.id"
                      :key="option.id"
                      >{{ option.projectName }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="创建时间">
                  <a-range-picker @change="changeCreationTime" />
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
        <a-button type="primary" :disabled="!selectedRowKeys.length" @click="openCheck">审核</a-button>
        <a-button @click="handleAdd">新增</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="auditTime" slot-scope="text, record, index">
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="goDetail(record)">查看</a>
            <a @click="goEdit(record)">编辑</a>
            <a @click="handleRemove(record)">删除</a>
            <a @click="openCheck(record)">审核</a>
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
        :selectedRowKeys="selectedRowKeys"
      ></check-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import {
  STable,
  CheckForm,
  ProjectSelect,
  CompanySelect,
  SupplierTypeSelect
} from '@/components'
import { getSupplierList, removeSupplier, auditSupp } from '@/api/supplier'

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
    title: '供应商ID',
    dataIndex: 'id'
  },
  {
    title: '供应商',
    dataIndex: 'supplierName'
  },
  {
    title: '类型',
    dataIndex: 'supplierTypeName'
  },
  {
    title: '供应物料',
    dataIndex: 'materialCount',
    sorter: true
  },
  {
    title: '合同',
    dataIndex: 'contractCount',
    sorter: true
  },
  {
    title: '创建时间',
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
  name: 'SupplierIndex',
  components: {
    STable,
    CheckForm,
    ProjectSelect,
    CompanySelect,
    SupplierTypeSelect
  },
  data () {
    this.columns = columns
    return {
      tabList: [
        { key: '0', tab: '全部' },
        { key: '1', tab: '待审核' },
        { key: '2', tab: '已通过' },
        { key: '3', tab: '未通过' }
      ],
      tabActiveKey: '0',
      // create model
      visible: false,
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      projectOptions: [],
      companyOptions: [],
      supplierTypeOptions: [], // todo：缺少接口
      materialOptions: [], // todo：缺少接口
      // 查询参数
      queryParam: {
        projectId: '',
        companyId: '',
        supplierType: '',
        searchText: '',
        material: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getSupplierList(requestParameters)
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    // getSupplierList({ t: new Date() })
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
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 创建时间更改事件
    changeCreationTime (value) {
      this.queryParam.startDate = moment(value[0]).format('YYYY-MM-DD')
      this.queryParam.endDate = moment(value[1]).format('YYYY-MM-DD')
    },
    openCheck () {
      this.visible = true
      this.$refs.CheckForm && this.$refs.CheckForm.resetFields()
    },
    handleCheckOk () {
      this.confirmLoading = true
      this.$refs.CheckForm.handleSubmit()
        .then(value => {
          auditSupp().then(({ data }) => {
            this.visible = false
          })
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    handleCheckCancel () {
      this.visible = false
    },
    handleAdd () {
      this.$router.push({
        name: 'SupplierEdit'
      })
    },
    handleRemove ({ id }) {
      const that = this
      this.$confirm({
        content: '是否删除该供应商？',
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
      this.$router.push({
        name: 'SupplierEdit',
        query: {
          id
        }
      })
    },
    goDetail () {
      this.$router.push({
        name: 'SupplierDetail'
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
