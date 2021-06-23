<template>
  <page-header-wrapper>
    <template v-slot:content>
      订单审核通过则自动入库；出库需填出库单，创建出库单则自动出库。
    </template>
    <template v-slot:extraContent>
      <a-row class="status-list">
        <a-col :xs="24" :sm="24">
          <div class="text">现有库存</div>
          <div class="heading">1000个</div>
        </a-col>
      </a-row>
    </template>
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form ref="form" layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="所属项目">
                <a-select v-model="queryParam.projectId" placeholder="请选择">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="所属公司">
                <a-select v-model="queryParam.system" placeholder="请选择">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
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
                <a-form-item label="备注">
                  <a-input
                    v-model="queryParam.bz"
                    placeholder="请输入"
                  ></a-input>
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
                <a-form-item label="订单">
                  <a-input v-model="queryParam.gys" placeholder="ID"></a-input>
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
        <a-button @click="openAdd">新增规格型号</a-button>
      </div>

      <a-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data-source="tableData"
        showPagination="auto"
      >
        <template slot="init" slot-scope="text, record">
          <a-input-number v-if="record.editable" v-model="record.status2" />
          <template v-else>
            {{ text }}
          </template>
        </template>
        <template slot="desc" slot-scope="text, record">
          <a-input v-if="record.editable" v-model="record.updatedAt13" />
          <template v-else>
            {{ text }}
          </template>
        </template>

        <template slot="action" slot-scope="text, record, index">
          <span v-if="record.editable">
            <a @click="save(index)">保存</a>
            <a-popconfirm title="是否取消？" @confirm="cancel(index)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="goDetail(record)">查看</a>
            <a @click="handleEdit(index)">编辑</a>
            <a @click="handleRemove(record)">删除</a>
          </span>
        </template>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
// import moment from 'moment'
import { getPermissions } from '@/api/manage'
import cloneDeep from 'lodash.clonedeep'

const columns = [
  {
    title: '库存ID',
    dataIndex: 'no'
  },
  {
    title: '所属项目',
    dataIndex: 'no1'
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
    title: '现有库存',
    dataIndex: 'status',
    sort: true
  },
  {
    title: '期初库存',
    dataIndex: 'status2',
    sort: true,
    scopedSlots: { customRender: 'init' }
  },
  {
    title: '总入库',
    dataIndex: 'updatedAt',
    sorter: true
  },
  {
    title: '总出库',
    dataIndex: 'updatedAt1',
    sorter: true
  },
  {
    title: '备注',
    dataIndex: 'updatedAt13',
    scopedSlots: { customRender: 'desc' }
  },
  {
    title: '操作',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'TableList',
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
      tableData: [
        {
          key: 1,
          no: 1,
          no1: 1,
          callNo: 1,
          callNo1: 1,
          callNo2: 1,
          status: 1,
          status2: 1,
          updatedAt: 1,
          updatedAt1: 1,
          updatedAt13: 1,
          editable: false
        }
      ],
      cacheData: []
    }
  },
  created () {
    this.cacheData = cloneDeep(this.tableData)
  },
  methods: {
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    search () {},
    reset () {
      this.$refs.form.resetFields()
      // this.form = cloneDeep(initialForm)
    },
    openAdd () {
      this.visible = true
    },
    handleRemove ({ id }) {
      const that = this
      this.$confirm({
        content: '是否删除该库存？',
        onOk () {
          getPermissions({
            id
          }).then(({ data }) => {
            that.$message.success('删除库存成功')
          })
        }
      })
    },
    handleEdit (index) {
      const target = this.tableData[index]
      if (target) {
        target.editable = true
      }
    },
    save (index) {
      this.tableData[index].editable = false
      this.cacheData = cloneDeep(this.tableData)
    },
    cancel (index) {
      this.$set(this.tableData, index, this.cacheData[index])
      this.tableData[index].editable = false
    },
    goDetail () {
      this.$router.push({
        name: 'InventoryDetail'
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
