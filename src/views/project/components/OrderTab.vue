<template>
  <div>
    <a-card title="订单信息" style="margin-top: 24px">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="所属公司">
                <company-select v-model="queryParam.companyId"></company-select>
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
            <template v-if="advanced">
              <a-col v-if="type === '0'" :md="8" :sm="24">
                <a-form-item label="合同">
                  <a-input
                    v-model="queryParam.serachContractText"
                    placeholder="编号、名称"
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
                <a-form-item label="付款情况">
                  <a-select
                    v-model="queryParam.payStatus"
                    placeholder="请选择"
                    default-value="0"
                  >
                    <a-select-option
                      v-for="option in payStatusOptions"
                      :value="option.value"
                      :key="option.value"
                    >
                      {{ option.text }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="开票情况">
                  <a-select v-model="queryParam.kpStatus" placeholder="请选择">
                    <a-select-option
                      v-for="option in kpStatusOptions"
                      :value="option.value"
                      :key="option.value"
                    >
                      {{ option.text }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="物料">
                  <a-input
                    v-model="queryParam.serachMaterialText"
                    placeholder="ID、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="(!advanced && 8) || md" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="
                  (advanced && { float: 'right', overflow: 'hidden' }) || {}
                "
              >
                <a-button type="primary" @click="$refs.orderTable.refresh(true)"
                  >查询</a-button
                >
                <a-button
                  style="margin-left: 8px"
                  @click="() => (this.queryParam = {})"
                  >重置</a-button
                >
                <a @click="advanced = !advanced" style="margin-left: 8px">
                  {{ advanced ? "收起" : "展开" }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="orderTable"
        size="default"
        rowKey="id"
        :columns="orderColumns"
        :data="orderLoadData"
        showPagination="auto"
      >
        <span slot="paid" slot-scope="text, record">
          <div v-if="+text">已付￥{{ text }}</div>
          <div v-if="+record.unpaid">未付￥{{ record.unpaid }}</div>
          <div></div>
        </span>
        <span slot="action" slot-scope="text">
          <a-button type="link" @click="goOrderDetail(text)">查看</a-button>
        </span>
      </s-table>
    </a-card>
    <a-card title="付款信息" style="margin-top: 24px" :bordered="false">
      <s-table ref="table" size="default" :columns="columns" :data="loadData">
        <span slot="index" slot-scope="text, record, index">
          {{ payData.records.length - index }}
        </span>
        <span slot="payPz" slot-scope="text, record">
          <a v-if="text" @click="previewImage(record.payPz)">
            {{text}}张
          </a>
          <template v-else>--</template>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button type="link" @click="goOrderDetail(record.id)">查看</a-button>
        </span>
      </s-table>
      <a-row v-if="payData.allMoney" class="table-total" type="flex" align="middle">
        <a-col flex="1">
          总计({{ `${payData.unKpNum + payData.kpNum}` }})
        </a-col>
        <a-col flex="1">￥{{payData.allMoney}}</a-col>
        <a-col flex="1">
          已开{{payData.kpNum}} (￥{{payData.kpMoney}})
          未开{{payData.unKpNum}} (￥{{payData.unKpMoney}})
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { STable, CompanySelect } from '@/components'
import { getOrderList, getOrderPayByContId } from '@/api/contract'
export default {
  name: 'contractTab',
  components: {
    STable,
    CompanySelect
  },
  props: {
    type: {
      type: String,
      default: '0' // 0：项目下的订单、1：合同下的订单
    },
    contractId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 展开后的展开占比
      md: 16,
      // 查询参数
      queryParam: {},
      // 付款情况：0=全部、1=全部已付、2=全部未付、3=部分已付/未付
      payStatusOptions: [
        {
          text: '全部',
          value: '0'
        },
        {
          text: '全部已付',
          value: '1'
        },
        {
          text: '全部未付',
          value: '2'
        },
        {
          text: '部分已付/未付',
          value: '3'
        }
      ],
      // 开票情况：0=全部、1=全部已开、2=全部未开、3=部分已开/未开
      kpStatusOptions: [
        {
          text: '全部',
          value: '0'
        },
        {
          text: '全部已开',
          value: '1'
        },
        {
          text: '全部未开',
          value: '2'
        },
        {
          text: '部分已开/未开',
          value: '3'
        }
      ],
      advanced: false,
      orderColumns: [
        // {
        //   title: '审核时间',
        //   dataIndex: 'no',
        //   scopedSlots: { customRender: 'checkTime' }
        // },
        {
          title: '审核状态',
          dataIndex: 'statusv'
        },
        {
          title: '所属公司',
          dataIndex: 'companyName'
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
        }
      ],
      orderLoadData: parameter => {
        return getOrderList(Object.assign(parameter, this.queryParam))
      },
      payData: {},
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'index' }
        },
        {
          title: '付款时间',
          dataIndex: 'payTime'
        },
        {
          title: '付款ID',
          dataIndex: 'id'
        },
        {
          title: '付款方式',
          dataIndex: 'payTypeName'
        },
        {
          title: '付款金额',
          dataIndex: 'paid'
        },
        {
          title: '付款凭证',
          dataIndex: 'payPzNum',
          scopedSlots: { customRender: 'payPz' }
        },
        {
          title: '开票情况',
          dataIndex: 'isKpName'
        },
        {
          title: '创建时间',
          dataIndex: 'ctime'
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
      }
    }
  },
  created () {
    if (this.type === '1') {
      this.md = 24
      this.orderColumns.push({
        title: '操作',
        dataIndex: 'id',
        scopedSlots: { customRender: 'action' }
      })
      this.columns.push({
        title: '操作',
        scopedSlots: { customRender: 'action' }
      })
    }
  },
  methods: {
    goOrderDetail ({ id }) {
      this.$router.push({
        name: 'OrderDetail',
        query: {
          id
        }
      })
    },
    previewImage (images) {
      this.$viewerApi({
        images: images
      })
    }
  }
}
</script>
