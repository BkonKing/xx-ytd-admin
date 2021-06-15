<template>
  <page-header-wrapper
    :title="title"
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    @tabChange="handleTabChange"
  >
    <template v-slot:content>
      <a-descriptions size="small" :column="isMobile ? 1 : 2">
        <a-descriptions-item label="项目工期">曲丽丽</a-descriptions-item>
        <a-descriptions-item label="项目ID">XX 服务</a-descriptions-item>
        <a-descriptions-item label="项目负责">2017-07-07</a-descriptions-item>
        <a-descriptions-item label="项目采购">
          <a href="">12421</a>
        </a-descriptions-item>
        <a-descriptions-item label="技术负责"
          >2017-07-07 ~ 2017-08-08</a-descriptions-item
        >
        <a-descriptions-item label="施工许可证"
          >请于两个工作日内确认</a-descriptions-item
        >
        <a-descriptions-item label="创建人"
          >2017-07-07 ~ 2017-08-08</a-descriptions-item
        >
        <a-descriptions-item label="参与公司"
          >公司名称，公司名称名称，公司名称，公司名称</a-descriptions-item
        >
      </a-descriptions>
    </template>

    <template v-slot:extraContent>
      <a-row class="status-list">
        <a-col :xs="12" :sm="12">
          <div class="text">阶段</div>
          <div class="heading">竣工验收</div>
        </a-col>
        <a-col :xs="12" :sm="12">
          <div class="text">参与公司</div>
          <div class="heading">4家</div>
        </a-col>
      </a-row>
    </template>

    <a-card style="margin-top: 24px" :bordered="false">
      <a-row>
        <a-col :sm="6" :xs="24">
          <info title="合同（5个）" value="￥5,000.00" :bordered="true" />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="订单（25个）" value="￥3,000.00" :bordered="true" />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="供应商" value="14个" :bordered="true" />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="材料（10种）" value="1,000个" />
        </a-col>
      </a-row>
    </a-card>

    <a-card title="合同信息" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="合同状态">
                <a-select
                  mode="multiple"
                  v-model="queryParam.status"
                  placeholder="请选择"
                >
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="所属项目">
                <a-select v-model="queryParam.projectId" placeholder="请选择">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="所属公司">
                  <a-select v-model="queryParam.system" placeholder="请选择">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="合同类型">
                  <a-select v-model="queryParam.type" placeholder="请选择">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="合同">
                  <a-input
                    v-model="queryParam.contract"
                    placeholder="编号、名称"
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
                <a-form-item label="付款情况">
                  <a-select
                    v-model="queryParam.fk"
                    placeholder="请选择"
                    default-value="0"
                  >
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
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

      <s-table ref="table" size="default" :columns="columns" :data="loadData">
        <span slot="contract" slot-scope="text">{{ text }}</span>
      </s-table>
    </a-card>

    <a-card title="操作日志" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="模块">
                <a-select
                  mode="multiple"
                  v-model="queryParam.status"
                  placeholder="请选择"
                >
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="操作员">
                <a-select v-model="queryParam.projectId" placeholder="请选择">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="操作时间">
                  <a-range-picker @change="onChange" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="操作类型">
                  <a-input
                    v-model="queryParam.contract"
                    placeholder="关键字"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="操作说明">
                  <a-input
                    v-model="queryParam.gys"
                    placeholder="关键字"
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

      <s-table ref="table" size="default" :columns="logColumns" :data="logLoadData">
        <span slot="contract" slot-scope="text">{{ text }}</span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import Info from './components/Info'
import { STable } from '@/components'
export default {
  name: 'projectDetail',
  components: {
    STable,
    Info
  },
  data () {
    return {
      title: '',
      isMobile: false,
      queryParam: {
        status: [],
        projectId: '0',
        system: '',
        type: '',
        contract: '',
        gys: '',
        fk: ''
      },
      advanced: false,
      columns: [
        {
          title: '审核状态',
          dataIndex: 'id'
        },
        {
          title: '所属公司',
          dataIndex: 'name'
        },
        {
          title: '合同编号',
          dataIndex: 'name',
          scopedSlots: { customRender: 'contract' }
        },
        {
          title: '合同名称',
          dataIndex: 'name'
        },
        {
          title: '订单',
          dataIndex: 'name'
        },
        {
          title: '金额',
          dataIndex: 'name'
        },
        {
          title: '创建时间',
          dataIndex: 'name'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return this.$http
          .get('/role', {
            params: Object.assign(parameter, this.queryParam)
          })
          .then(res => {
            return res.result
          })
      },
      logColumns: [
        {
          title: 'id',
          dataIndex: 'id'
        },
        {
          title: '操作时间',
          dataIndex: 'name'
        },
        {
          title: '模块',
          dataIndex: 'name',
          scopedSlots: { customRender: 'contract' }
        },
        {
          title: '操作员',
          dataIndex: 'name'
        },
        {
          title: '操作类型',
          dataIndex: 'name'
        },
        {
          title: '操作说明',
          dataIndex: 'name'
        }
      ],
      logLoadData: parameter => {
        return this.$http
          .get('/role', {
            params: Object.assign(parameter, this.queryParam)
          })
          .then(res => {
            return res.result
          })
      }
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        agree: '成功',
        reject: '驳回'
      }
      return statusMap[status]
    },
    statusTypeFilter (type) {
      const statusTypeMap = {
        agree: 'success',
        reject: 'error'
      }
      return statusTypeMap[type]
    }
  },
  methods: {
    handleTabChange (key) {
      console.log('')
      this.tabActiveKey = key
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
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
