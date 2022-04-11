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
        <span slot="paid" slot-scope="text, record">
          <template v-if="record.status !== '1'">--</template>
          <template v-else>
            <div v-if="+text">已付￥{{ text }}</div>
            <div v-if="+record.unpaid">未付￥{{ record.unpaid }}</div>
          </template>
        </span>
      </s-table>
    </a-card>
    <a-card title="付款信息" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper table-page-fw-search-wrapper">
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
                  <a-select v-model="payParams.kpStatus" placeholder="请选择">
                    <a-select-option
                      v-for="option in kpOptions"
                      :value="option.value"
                      :key="option.value"
                    >
                      {{ option.text }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <advanced-form
              v-model="payAdvanced"
              :md="isParentCompany ? 16 : 24"
              @reset="
                () => {
                  this.payParams = {};
                  this.$refs.table.refresh(true);
                }
              "
              @search="$refs.table.refresh(true)"
            ></advanced-form>
          </a-row>
        </a-form>
      </div>
      <a-row
        v-if="payData.total"
        class="table-total-row"
        type="flex"
        align="middle"
      >
        <div style="width: 55%;">总计({{ payData.total }})</div>
        <div style="width: 10%;">￥{{ payData.allMoney }}</div>
        <div style="width: 35%;">
          已开{{ payData.kpNum }} (￥{{ payData.kpMoney }})， 未开{{
            payData.unKpNum
          }}
          (￥{{ payData.unKpMoney }})
        </div>
      </a-row>
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
      >
        <span slot="index" slot-scope="text, record, index">
          {{ (payData.records && payData.records.length - index) || 0 }}
        </span>
        <span slot="orderIdv" slot-scope="text, record">
          <router-link
            :to="{ name: 'OrderDetail', query: { id: record.orderId } }"
            target="_blank"
            >{{ text }}</router-link
          >
        </span>
        <span slot="payPz" slot-scope="text, record">
          <a v-if="text" @click="previewFile(record.payPz)"> {{ text }}张 </a>
          <template v-else>--</template>
        </span>
      </s-table>
    </a-card>
    <file-list-modal
      v-model="previewVisible"
      title="付款凭证"
      :data="previewFileData"
    ></file-list-modal>
  </div>
</template>

<script>
import {
  STable,
  CompanySelect,
  PayStatusSelect,
  KpStatusSelect,
  AdvancedForm,
  FileListModal
} from '@/components'
import { getOrderPayByProjectId, getProjectOrderList } from '@/api/project'
export default {
  name: 'contractTab',
  components: {
    STable,
    CompanySelect,
    PayStatusSelect,
    KpStatusSelect,
    AdvancedForm,
    FileListModal
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
          title: '付款情况',
          dataIndex: 'paid',
          scopedSlots: { customRender: 'paid' }
        },
        {
          title: '创建时间',
          dataIndex: 'ctime'
        }
      ],
      // 开票情况：0=全部、1=已开、2=未开
      kpOptions: [
        {
          value: 0,
          text: '全部'
        },
        {
          value: 1,
          text: '全部已开'
        },
        {
          value: 2,
          text: '全部未开'
        },
        {
          value: 3,
          text: '部分已开'
        }
      ],
      orderLoadData: parameter => {
        return getProjectOrderList(
          Object.assign(parameter, this.queryParam, {
            projectId: this.projectId
          })
        )
      },
      payData: {},
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'index' },
          width: '7%'
        },
        {
          title: '付款时间',
          dataIndex: 'payTime',
          width: '12%'
        },
        {
          title: '付款ID',
          dataIndex: 'fkIdv',
          width: '12%'
        },
        {
          title: '订单ID',
          dataIndex: 'orderIdv',
          scopedSlots: { customRender: 'orderIdv' },
          width: '14%'
        },
        {
          title: '付款方式',
          dataIndex: 'payTypeName',
          width: '10%'
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
          dataIndex: 'ctime',
          width: '17%'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getOrderPayByProjectId(
          Object.assign(parameter, {
            ...this.payParams,
            projectId: this.projectId
          })
        ).then(res => {
          this.payData = res.data
          return res
        })
      },
      previewVisible: false,
      previewFileData: []
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
