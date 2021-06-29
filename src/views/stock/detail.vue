<template>
  <page-header-wrapper :title="title">
    <template v-slot:content>
      <a-descriptions size="small" :column="2">
        <a-descriptions-item label="所属项目">
          <router-link to="">项目名称</router-link>
        </a-descriptions-item>
        <a-descriptions-item label="所属公司">
          XX 服务
        </a-descriptions-item>
        <a-descriptions-item label="备注">
          2017-07-07<a-button type="link" @click="openEditInfo">编辑</a-button>
        </a-descriptions-item>
      </a-descriptions>
    </template>
    <a-card style="margin-top: 24px" :bordered="false">
      <a-row>
        <a-col :sm="6" :xs="24">
          <info title="现有库存" value="￥5,000.00" :bordered="true" />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="期初库存" :bordered="true">
            ￥3,000.00<a-button type="link" @click="openEditInfo">调整</a-button>
          </info>
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="总入库" value="14个" :bordered="true" />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="总出库" value="1,000个" />
        </a-col>
      </a-row>
    </a-card>

    <a-card title="出入库记录" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form ref="form" layout="inline">
          <a-row :gutter="48">
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
              <a-form-item label="出入库时间">
                <a-range-picker v-model="queryParam.time1" />
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="物料用途">
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

      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="openDetail(record)">查看</a>
          </template>
        </span>
      </s-table>
    </a-card>

    <log-list :load="logLoadData"></log-list>

    <record-detail-modal v-model="visible" :type="1"></record-detail-modal>

    <a-modal
      title="编辑"
      :visible="editVisible"
      :confirm-loading="confirmLoading"
      :width="640"
      :maskClosable="false"
      :keyboard="false"
      @ok="handleOkProject"
      @cancel="editVisible = false"
    >
      <a-form-model
        ref="projectForm"
        :model="form"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-model-item label="期初库存" prop="projectName">
          <a-input-number v-model="form.projectName" :min="0" style="margin-right: 10px;" />件
        </a-form-model-item>
        <a-form-model-item label="备注" prop="desc">
          <a-textarea
            v-model="form.desc"
            placeholder="请输入"
            rows="4"
            :maxLength="100"
          ></a-textarea>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import { STable, LogList } from '@/components'
import { getPermissions } from '@/api/manage'
import Info from '../project/components/Info.vue'
import RecordDetailModal from './components/RecordDetail'
export default {
  name: 'projectDetail',
  components: {
    STable,
    LogList,
    Info,
    RecordDetailModal
  },
  data () {
    return {
      title: '',
      projectInfo: {
        images: []
      },
      advanced: false,
      queryParam: {},
      columns: [
        {
          title: '记录ID',
          dataIndex: 'no'
        },
        {
          title: '类型',
          dataIndex: 'no1'
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
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getPermissions({
          params: Object.assign(parameter, this.queryParam)
        }).then(res => {
          return res.result
        })
      },
      logLoadData: getPermissions,
      visible: false,
      editVisible: false,
      confirmLoading: false,
      form: {}
    }
  },
  methods: {
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    openEditInfo () {
      this.editVisible = true
    },
    search () {},
    reset () {
      this.$refs.form.resetFields()
      // this.form = cloneDeep(initialForm)
    },
    openDetail () {
      this.visible = true
    },
    handleOkProject (e) {
      this.$refs.projectForm.handleSubmit().then(res => {
        this.confirmLoading = true
        this.updateProject(res)
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
.detail-layout {
  margin-left: 44px;
}
.text {
  color: rgba(0, 0, 0, 0.45);
}

.heading {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
}

.no-data {
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
  line-height: 64px;
  font-size: 16px;

  i {
    font-size: 24px;
    margin-right: 16px;
    position: relative;
    top: 3px;
  }
}

.mobile {
  .detail-layout {
    margin-left: unset;
  }
  .text {
  }
  .status-list {
    text-align: left;
  }
}
</style>
