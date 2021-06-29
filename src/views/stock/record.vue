<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="handleTabChange"
  >
    <a-card style="margin-top: 24px" :bordered="false">
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
                <company-select
                    v-model="queryParam.companyId"
                  ></company-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="出入库时间">
                  <a-range-picker v-model="queryParam.time" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="类型">
                  <a-select v-model="queryParam.type" placeholder="请选择">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="物料">
                  <a-input
                    v-model="queryParam.contract"
                    placeholder="编码、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="规格型号">
                  <a-input
                    v-model="queryParam.contract"
                    placeholder="请输入"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="物料品牌">
                  <a-input
                    v-model="queryParam.gys"
                    placeholder="请输入"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="订单">
                  <a-input v-model="queryParam.gys" placeholder="ID"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="供应商">
                  <a-input
                    v-model="queryParam.gys"
                    placeholder="ID、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="物料用途">
                  <a-input
                    v-model="queryParam.gys"
                    placeholder="请输入"
                  ></a-input>
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
                <a-button type="primary" @click="search">查询</a-button>
                <a-button style="margin-left: 8px" @click="reset"
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
        <a-button type="primary" @click="goAdd">新增出库单</a-button>
        <a-button @click="print">打印出库单</a-button>
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
          </template>
        </span>
      </s-table>
    </a-card>
    <record-detail-modal v-model="visible"></record-detail-modal>
  </page-header-wrapper>
</template>

<script>
// import moment from 'moment'
import { STable } from '@/components'
import { getPermissions } from '@/api/manage'
import RecordDetailModal from './components/RecordDetail'

const columns = [
  {
    title: '记录ID',
    dataIndex: 'no',
    scopedSlots: { customRender: 'checkTime' }
  },
  {
    title: '类型',
    dataIndex: 'no1'
  },
  {
    title: '所属项目',
    dataIndex: 'description'
  },
  {
    title: '物料名称',
    dataIndex: 'callNo'
  },
  {
    title: '物料品牌',
    dataIndex: 'callNo1'
  },
  {
    title: '规格型号',
    dataIndex: 'callNo2'
  },
  {
    title: '数量',
    dataIndex: 'status',
    sort: true
  },
  {
    title: '物料用途',
    dataIndex: 'status1'
  },
  {
    title: '出入库人',
    dataIndex: 'updatedAt',
    sorter: true
  },
  {
    title: '出入库时间',
    dataIndex: 'updatedAt1',
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
    RecordDetailModal
  },
  data () {
    this.columns = columns
    return {
      tabList: [
        { key: '1', tab: '全部' },
        { key: '2', tab: '入库' },
        { key: '3', tab: '出库' }
      ],
      tabActiveKey: '1',
      // 审核弹窗
      visible: false,
      type: 1,
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
    search () {},
    reset () {
      this.$refs.form.resetFields()
      // this.form = cloneDeep(initialForm)
    },
    goAdd () {
      this.$router.push({
        name: ''
      })
    },
    print () {},
    handleRemove ({ id }) {
      const that = this
      this.$confirm({
        content: '是否删除该记录？',
        onOk () {
          getPermissions({
            id
          }).then(({ data }) => {
            that.$message.success('删除记录成功')
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
      this.visible = true
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
