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
                <a-select
                  v-model="queryParam.status"
                  placeholder="请选择"
                >
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
                <a-select v-model="queryParam.projectId" placeholder="请选择">
                  <a-select-option
                    v-for="option in projectOptions"
                    :value="option.id"
                    :key="option.id"
                    >{{ option.projectName }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="所属公司">
                  <a-select v-model="queryParam.companyId" placeholder="请选择">
                    <a-select-option
                      v-for="option in companyOptions"
                      :value="option.id"
                      :key="option.id"
                      >{{ option.projectName }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="类型">
                  <a-select
                    v-model="queryParam.supplierType"
                    placeholder="请选择"
                  >
                    <a-select-option
                      v-for="option in supplierTypeOptions"
                      :value="option.id"
                      :key="option.id"
                      >{{ option.projectName }}</a-select-option
                    >
                  </a-select>
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
                <a-form-item label="供应材料">
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
        <a-button type="primary" @click="shenhe">审核</a-button>
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
        <span slot="checkTime" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">查看</a>
            <a @click="handleSub(record)">编辑</a>
            <a @click="handleSub(record)">删除</a>
            <a @click="handleSub(record)">审核</a>
          </template>
        </span>
      </s-table>
    </a-card>

    <a-modal
      title="审核"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <check-form></check-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, CheckForm } from '@/components'
import { getSupplierList, removeSupplier } from '@/api/supplier'

const columns = [
  {
    title: '审核时间',
    dataIndex: 'no',
    scopedSlots: { customRender: 'checkTime' }
  },
  {
    title: '合同状态',
    dataIndex: 'no1'
  },
  {
    title: '所属项目',
    dataIndex: 'description'
  },
  {
    title: '合同编号',
    dataIndex: 'callNo'
  },
  {
    title: '合同名称',
    dataIndex: 'status'
  },
  {
    title: '订单',
    dataIndex: 'updatedAt',
    sorter: true
  },
  {
    title: '金额',
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

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'SupplierIndex',
  components: {
    STable,
    CheckForm
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
        console.log('loadData request parameters:', requestParameters)
        return getSupplierList(requestParameters)
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    getSupplierList({ t: new Date() })
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
    // 创建时间更改事件
    changeCreationTime (value) {
      this.queryParam.startDate = moment(value[0]).format('YYYY-MM-DD')
      this.queryParam.endDate = moment(value[1]).format('YYYY-MM-DD')
    },
    shenhe () {
      this.visible = true
    },
    handleAdd () {
      this.$router.push({
        name: 'SupplierEdit'
      })
    },
    handleEdit (record) {
      this.visible = true
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
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
