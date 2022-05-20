<template>
  <div>
    <a-card title="订单信息" style="margin-top: 24px">
      <div class="table-page-search-wrapper table-page-fw-search-wrapper">
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
              :showAdvanced="false"
              :md="isParentCompany ? 8 : 24"
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
        <span slot="idv" slot-scope="text, record">
          <router-link
            :to="{ name: 'OrderDetail', query: { id: record.id } }"
            target="_blank"
            >{{ text }}</router-link
          >
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import {
  STable,
  CompanySelect,
  AdvancedForm
} from '@/components'
import { getProjectOrderList } from '@/api/project'
export default {
  name: 'contractTab',
  components: {
    STable,
    CompanySelect,
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
          sorter: true,
          customRender (text) {
            return `￥${text}`
          }
        },
        {
          title: '创建时间',
          dataIndex: 'ctime'
        }
      ],
      orderLoadData: parameter => {
        return getProjectOrderList(
          Object.assign(parameter, this.queryParam, {
            projectId: this.projectId
          })
        )
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
    }
  }
}
</script>
