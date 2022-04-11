<template>
  <div>
    <a-card title="订单信息" style="margin-top: 24px">
      <div class="table-page-search-wrapper table-page-fw-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
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
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="物料">
                  <a-input
                    v-model="queryParam.serachMaterialText"
                    placeholder="ID、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="付款情况">
                  <pay-status-select
                    v-model="queryParam.payStatus"
                  ></pay-status-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="开票情况">
                  <kp-status-select
                    v-model="queryParam.kpStatus"
                  ></kp-status-select>
                </a-form-item>
              </a-col>
            </template>
            <advanced-form
              v-model="advanced"
              :md="8"
              @reset="
                () => {
                  this.queryParam = {};
                  this.$refs.orderTable.refresh(true);
                }
              "
              @search="$refs.orderTable.refresh(true)"
            ></advanced-form>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="orderTable"
        size="default"
        rowKey="id"
        :columns="orderColumns"
        :data="orderLoadData"
        :showPagination="true"
      >
        <span slot="paid" slot-scope="text, record">
          <template v-if="record.status !== '1'">--</template>
          <template v-else>
            <div v-if="+text">已付￥{{ text }}</div>
            <div v-if="+record.unpaid">未付￥{{ record.unpaid }}</div>
          </template>
        </span>
        <span slot="action" slot-scope="text">
          <a @click="goOrderDetail(text)">查看</a>
        </span>
      </s-table>
    </a-card>
    <a-card title="付款信息" style="margin-top: 24px" :bordered="false">
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
      >
        <span slot="index" slot-scope="text, record, index">
          {{ payData.data.records.length - index }}
        </span>
        <span slot="payPz" slot-scope="text, record">
          <a v-if="text" @click="previewFile(record.payPz)"> {{ text }}张 </a>
          <template v-else>--</template>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="goOrderDetail(record.orderId)">查看</a>
        </span>
      </s-table>
      <a-row
        v-if="payData.data && payData.data.allMoney"
        class="table-total-row"
        type="flex"
        align="middle"
      >
        <div style="width: 16%;">
          总计({{ `${payData.data.records.length || 0}` }})
        </div>
        <div style="width: 52%;">￥{{ payData.data.allMoney }}</div>
        <div>
          已开{{ payData.data.kpNum }} (￥{{ payData.data.kpMoney }})， 未开{{
            payData.data.unKpNum
          }}
          (￥{{ payData.data.unKpMoney }})
        </div>
      </a-row>
      <file-list-modal
        v-model="previewVisible"
        title="付款凭证"
        :data="previewFileData"
      ></file-list-modal>
    </a-card>
  </div>
</template>

<script>
import {
  STable,
  PayStatusSelect,
  KpStatusSelect,
  AdvancedForm,
  FileListModal
} from '@/components'
import { getContOrderList, getOrderPayByContId } from '@/api/contract'
export default {
  name: 'contractTab',
  components: {
    STable,
    PayStatusSelect,
    KpStatusSelect,
    AdvancedForm,
    FileListModal
  },
  props: {
    companyId: {
      type: [String, Number],
      default: ''
    },
    contractId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      advanced: false,
      orderColumns: [
        {
          title: '审核状态',
          dataIndex: 'statusv'
        },
        {
          title: '所属项目',
          dataIndex: 'projectName'
        },
        {
          title: '订单ID',
          dataIndex: 'idv'
        },
        {
          title: '物料数量',
          dataIndex: 'materialNum',
          sorter: true
        },
        {
          title: '金额',
          dataIndex: 'orderPrice',
          sorter: true
        },
        {
          title: '付款情况',
          dataIndex: 'paid',
          scopedSlots: { customRender: 'paid' }
        },
        {
          title: '创建时间',
          dataIndex: 'ctime'
        },
        {
          title: '操作',
          dataIndex: 'id',
          scopedSlots: { customRender: 'action' }
        }
      ],
      orderLoadData: parameter => {
        this.queryParam.contractId = this.contractId
        return getContOrderList(Object.assign(parameter, this.queryParam))
      },
      payData: {},
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'index' },
          width: '7%'
        },
        {
          title: '付款ID',
          dataIndex: 'id',
          width: '9%'
        },
        {
          title: '付款金额',
          dataIndex: 'paid',
          width: '10%',
          customRender (text) {
            return `￥${text}`
          }
        },
        {
          title: '付款情况',
          dataIndex: 'isPayName',
          width: '10%'
        },
        {
          title: '付款时间',
          dataIndex: 'payTime',
          width: '12%'
        },
        {
          title: '付款方式',
          dataIndex: 'payTypeName',
          width: '10%'
        },
        {
          title: '付款凭证',
          dataIndex: 'payPzNum',
          scopedSlots: { customRender: 'payPz' },
          width: '10%'
        },
        {
          title: '开票情况',
          dataIndex: 'isKpName',
          width: '10%'
        },
        {
          title: '创建时间',
          dataIndex: 'ctime'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          width: '70px'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: () => {
        return getOrderPayByContId({
          contractId: this.contractId
        }).then(res => {
          this.payData = res
          return res
        })
      },
      previewVisible: false,
      previewFileData: []
    }
  },
  methods: {
    goOrderDetail (id) {
      this.$router.push({
        name: 'OrderDetail',
        query: {
          id
        }
      })
    },
    previewFile (files) {
      const isOnlyImage = files.some(obj => !obj.name)
      if (isOnlyImage) {
        this.$viewerApi({
          images: files
        })
        return
      }
      this.previewFileData = files
      this.previewVisible = true
    }
  }
}
</script>
