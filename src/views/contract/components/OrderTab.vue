<template>
  <a-card title="订单信息" style="margin-top: 24px">
    <div class="table-page-search-wrapper table-page-fw-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="订单">
              <a-input v-model="queryParam.orderId" placeholder="ID"></a-input>
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
            <a-form-item label="物料">
              <a-input
                v-model="queryParam.serachMaterialText"
                placeholder="ID、名称"
              ></a-input>
            </a-form-item>
          </a-col>
          <advanced-form
            :showAdvanced="false"
            :md="24"
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
</template>

<script>
import {
  STable,
  AdvancedForm
} from '@/components'
import { getContOrderList } from '@/api/contract'
export default {
  name: 'contractTab',
  components: {
    STable,
    AdvancedForm
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
          sorter: true,
          customRender (text) {
            return `￥${text}`
          }
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
