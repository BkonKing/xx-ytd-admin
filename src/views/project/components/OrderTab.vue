<template>
  <div>
    <a-card title="订单信息" style="margin-top: 24px">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col v-if="isParentCompany" :md="8" :sm="24">
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
            <template v-if="!isParentCompany || advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="合同">
                  <a-input
                    v-model="queryParam.serachContractText"
                    placeholder="编号、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
            </template>
            <template v-if="advanced">
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
              <a-col :md="8" :sm="24">
                <a-form-item label="物料">
                  <a-input
                    v-model="queryParam.serachMaterialText"
                    placeholder="ID、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
            </template>
            <advanced-form
              v-model="advanced"
              :md="isParentCompany ? 16 : 24"
              @reset="this.queryParam = {}"
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
        showPagination="auto"
      >
        <span slot="idv" slot-scope="text, record">
          <router-link
            :to="{ name: 'OrderDetail', query: { id: record.id } }"
            >{{ text }}</router-link
          >
        </span>
        <span slot="paid" slot-scope="text, record">
          <div v-if="+text">已付￥{{ text }}</div>
          <div v-if="+record.unpaid">未付￥{{ record.unpaid }}</div>
        </span>
      </s-table>
    </a-card>
    <a-card title="付款信息" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col v-if="isParentCompany" :md="8" :sm="24">
              <a-form-item label="所属公司">
                <company-select v-model="payParams.companyId"></company-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="合同">
                <a-input
                  v-model="payParams.serachContractText"
                  placeholder="编号、名称"
                ></a-input>
              </a-form-item>
            </a-col>
            <template v-if="!isParentCompany || payAdvanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="供应商">
                  <a-input
                    v-model="payParams.serachSupplierText"
                    placeholder="ID、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
            </template>
            <template v-if="payAdvanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="开票情况">
                  <kp-status-select
                    v-model="payParams.kpStatus"
                  ></kp-status-select>
                </a-form-item>
              </a-col>
            </template>
            <advanced-form
              v-model="payAdvanced"
              :md="isParentCompany ? 16 : 24"
              @reset="this.payParams = {}"
              @search="$refs.table.refresh(true)"
            ></advanced-form>
          </a-row>
        </a-form>
      </div>
      <a-row
        v-if="payData.total"
        class="table-total"
        type="flex"
        align="middle"
      >
        <a-col flex="1"> 总计({{ payData.total }}) </a-col>
        <a-col flex="1">￥{{ payData.paidMoneys }}</a-col>
        <a-col flex="1">
          已开{{ payData.kptotal }} (￥{{ payData.kpMoneys }}) 未开{{
            payData.wkptotal
          }}
          (￥{{ payData.wkpMoneys }})
        </a-col>
      </a-row>
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
      >
        <span slot="index" slot-scope="text, record, index">
          {{ payData.records.length }}
          {{ (payData.records && payData.records.length - index) || 0 }}
        </span>
        <span slot="orderIdv" slot-scope="text, record">
          <router-link
            :to="{ name: 'OrderDetail', query: { id: record.orderId } }"
            >{{ text }}</router-link
          >
        </span>
        <span slot="payPz" slot-scope="text, record">
          <a v-if="text" @click="previewImage(record.payPz)"> {{ text }}张 </a>
          <template v-else>--</template>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import {
  STable,
  CompanySelect,
  PayStatusSelect,
  KpStatusSelect,
  AdvancedForm
} from '@/components'
import { getProOrderPayList } from '@/api/project'
import { getOrderList } from '@/api/contract'
export default {
  name: 'contractTab',
  components: {
    STable,
    CompanySelect,
    PayStatusSelect,
    KpStatusSelect,
    AdvancedForm
  },
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 展开后的展开占比
      // 查询参数
      queryParam: {},
      payParams: {},
      advanced: false,
      payAdvanced: false,
      orderColumns: [
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
          dataIndex: 'idv',
          scopedSlots: { customRender: 'idv' }
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
          title: '订单ID',
          dataIndex: 'orderIdv',
          scopedSlots: { customRender: 'orderIdv' }
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
      loadData: parameter => {
        return getProOrderPayList(
          Object.assign(parameter, {
            ...this.payParams,
            projectId: this.projectId
          })
        ).then(res => {
          this.payData = res.data
          return res
        })
      }
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
