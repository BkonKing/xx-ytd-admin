<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="handleTabChange"
  >
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <search-form
          v-model="queryParam"
          ref="contractSearchForm"
          @search="$refs.table.refresh(true)"
        ></search-form>
      </div>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="table-operator">
        <a-button type="primary" @click="openCheck">审核</a-button>
        <a-button @click="goEdit">新增</a-button>
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
        <span slot="checkTime" slot-scope="text, record, index">
          {{ index + 1 }}
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
// import moment from 'moment'
import { STable, CheckForm } from '@/components'
import { getPermissions } from '@/api/manage'
import SearchForm from './components/seachForm.vue'

const columns = [
  {
    title: '审核时间',
    dataIndex: 'no',
    scopedSlots: { customRender: 'checkTime' }
  },
  {
    title: '审核状态',
    dataIndex: 'no1'
  },
  {
    title: '所属项目',
    dataIndex: 'description'
  },
  {
    title: '订单ID',
    dataIndex: 'callNo'
  },
  {
    title: '材料数量',
    dataIndex: 'status'
  },
  {
    title: '金额',
    dataIndex: 'updatedAt',
    sorter: true
  },
  {
    title: '付款情况',
    dataIndex: 'updatedAt1',
    sorter: true
  },
  {
    title: '创建时间',
    dataIndex: 'updatedAt2',
    sorter: true
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
    CheckForm,
    SearchForm
  },
  data () {
    this.columns = columns
    return {
      tabList: [
        { key: '1', tab: '全部' },
        { key: '2', tab: '待审核' },
        { key: '3', tab: '正常' },
        { key: '4', tab: '延期' },
        { key: '5', tab: '终止' },
        { key: '6', tab: '未通过' }
      ],
      tabActiveKey: '1',
      // 审核弹窗
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        status: '',
        projectId: '0',
        system: '',
        type: '',
        contract: '',
        gys: '',
        fk: '',
        time: []
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getPermissions({
          params: Object.assign(parameter, this.queryParam)
        }).then(res => {
          return res.result
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
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
    openCheck () {
      this.visible = true
      this.$refs.CheckForm && this.$refs.CheckForm.resetFields()
    },
    handleCheckOk () {
      this.confirmLoading = true
      this.$refs.CheckForm.handleSubmit().then((value) => {
        console.log(value)
        this.visible = false
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    handleCheckCancel () {
      this.visible = false
    },
    handleRemove ({ id }) {
      const that = this
      this.$confirm({
        content: '是否删除该合同？',
        onOk () {
          getPermissions({
            id
          }).then(({ data }) => {
            that.$message.success('删除合同成功')
            that.getProjectList()
          })
        }
      })
    },
    goEdit () {
      this.$router.push({
        name: 'ContractEdit'
      })
    },
    goDetail () {
      this.$router.push({
        name: 'ContractDetail'
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
