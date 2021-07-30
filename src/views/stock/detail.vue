<template>
  <page-header-wrapper :title="title">
    <template v-slot:content>
      <a-descriptions size="small" :column="2">
        <a-descriptions-item label="所属项目">
          <router-link
            :to="{ name: 'ProjectDetail', query: { id: info.projectId } }"
            target="_blank"
            >{{ info.projectName || "--" }}</router-link
          >
        </a-descriptions-item>
        <a-descriptions-item label="所属公司">
          {{ info.companyName }}
        </a-descriptions-item>
        <a-descriptions-item label="备注">
          {{ info.remarks || "--"
          }}<a-button v-if="UpdatePermission" type="link" @click="openEditInfo"
            >编辑</a-button
          >
        </a-descriptions-item>
      </a-descriptions>
    </template>
    <a-card style="margin-top: 24px" :bordered="false">
      <a-row>
        <a-col :sm="6" :xs="24">
          <info
            title="现有库存"
            :value="`${info.currentNum || 0}件`"
            :bordered="true"
          />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="期初库存" :bordered="true">
            {{ info.originalNum || 0 }}件<a-button
              v-if="UpdatePermission"
              type="link"
              @click="openEditInfo"
              >调整</a-button
            >
          </info>
        </a-col>
        <a-col :sm="6" :xs="24">
          <info
            title="总入库"
            :value="`${info.totalLknum || 0}件`"
            :bordered="true"
          />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="总出库" :value="`${info.totalCknum || 0}件`" />
        </a-col>
      </a-row>
    </a-card>

    <a-card title="出入库记录" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form ref="form" layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="类型">
                <a-select v-model="queryParam.stockType" placeholder="请选择">
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
              <a-form-item label="出入库时间">
                <a-range-picker
                  v-model="queryParam.time"
                  valueFormat="YYYY-MM-DD"
                  style="width: 100%;"
                />
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="物料用途">
                  <a-input
                    v-model="queryParam.serachRemarksText"
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
              :md="24"
              @search="$refs.table.refresh(true)"
              @reset="
                () => {
                  this.queryParam = {};
                  this.$refs.table.refresh(true);
                }
              "
            ></advanced-form>
          </a-row>
        </a-form>
      </div>

      <s-table
        v-if="info.projectId"
        ref="table"
        size="default"
        rowKey="clkId"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span class="table-action" slot="action" slot-scope="text, record">
          <template>
            <a @click="openDetail(record)">查看</a>
          </template>
        </span>
      </s-table>

      <record-detail-modal
        v-model="visible"
        :data="activeRecord"
      ></record-detail-modal>
    </a-card>

    <log-list typeId="45" :sourceId="id"></log-list>

    <a-modal
      title="编辑"
      :visible="editVisible"
      :confirm-loading="confirmLoading"
      :width="640"
      :maskClosable="false"
      :keyboard="false"
      @ok="handleOk"
      @cancel="editVisible = false"
    >
      <a-form-model
        ref="editForm"
        :model="form"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-model-item label="期初库存" prop="originalNum">
          <a-input-number
            v-model="form.originalNum"
            :min="0"
            style="margin-right: 10px;"
          />件
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remarks">
          <a-textarea
            v-model="form.remarks"
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
import { STable, LogList, AdvancedForm } from '@/components'
import { getStockInfo, updateStock, getAllStockClkList } from '@/api/stock'
import Info from '../project/components/Info.vue'
import RecordDetailModal from './components/RecordDetail'
import { getAllots } from '@/api/user'
export default {
  name: 'projectDetail',
  components: {
    STable,
    LogList,
    Info,
    RecordDetailModal,
    AdvancedForm
  },
  data () {
    return {
      id: '',
      UpdatePermission: 0,
      info: {
        materialNo: '',
        materialName: '',
        brand: '',
        model: ''
      },
      advanced: false,
      queryParam: {},
      columns: [
        {
          title: '记录ID',
          dataIndex: 'clkId'
        },
        {
          title: '类型',
          dataIndex: 'stockTypeV'
        },
        {
          title: '数量',
          dataIndex: 'materiaNum',
          sorter: true
        },
        {
          title: '领料部门',
          dataIndex: 'department',
          customRender (text) {
            return text || '--'
          }
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
          width: '80px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const time = this.queryParam.time
        let startDate = ''
        let endDate = ''
        if (time && time.length) {
          startDate = time[0]
          endDate = time[1]
        }
        this.queryParam.startDate = startDate
        this.queryParam.endDate = endDate
        this.queryParam.stockId = this.id
        return getAllStockClkList(Object.assign(parameter, this.queryParam))
      },
      visible: false,
      editVisible: false,
      confirmLoading: false,
      form: {},
      tabList: [
        { key: '0', tab: '全部' },
        { key: '1', tab: '入库' },
        { key: '2', tab: '出库' }
      ],
      activeRecord: {}
    }
  },
  computed: {
    title () {
      const { materialNo, materialName, brand, model } = this.info
      return `${materialNo} ${materialName} - ${brand} - ${model}`
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getStockInfo()
    this.getAllots()
  },
  methods: {
    getStockInfo () {
      getStockInfo({
        id: this.id
      }).then(({ data }) => {
        this.info = data
      })
    },
    // 获取编辑权限
    getAllots () {
      getAllots({
        limitsPath: '/stock/index'
      }).then(({ data }) => {
        this.UpdatePermission = data.UpdatePermission
      })
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    openEditInfo () {
      this.editVisible = true
      this.form = {
        id: this.info.id,
        originalNum: this.info.originalNum,
        remarks: this.info.remarks
      }
    },
    openDetail (record) {
      this.activeRecord = record
      this.visible = true
    },
    handleOk (e) {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          updateStock(this.form)
            .then(({ data }) => {
              this.editVisible = false
              this.getStockInfo()
            })
            .finally(() => {
              this.confirmLoading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.table-page-search-wrapper {
  /deep/ .ant-form-inline .ant-form-item > .ant-form-item-label {
    width: 92px;
    flex-shrink: 0;
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
