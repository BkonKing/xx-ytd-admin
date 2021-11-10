<template>
  <page-header-wrapper
    :title="`订单号：${info.idv}`"
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    @tabChange="handleTabChange"
  >
    <template v-slot:content>
      <a-descriptions size="small" :column="isMobile ? 1 : 3">
        <a-descriptions-item label="所属项目">
          <router-link
            :to="{ name: 'ProjectDetail', query: { id: info.projectId } }"
            target="_blank"
            >{{ info.projectName || "--" }}</router-link
          >
        </a-descriptions-item>
        <a-descriptions-item label="供应商" :span="2">
          <router-link
            :to="{ name: 'SupplierDetail', query: { id: info.supplierId } }"
            target="_blank"
            >{{ info.supplierName }}</router-link
          >
        </a-descriptions-item>
        <a-descriptions-item label="所属公司">
          {{ info.companyName }}
        </a-descriptions-item>
        <a-descriptions-item label="订单凭证" :span="2">
          {{ info.orderPzNum }}张<a
            v-if="+info.orderPzNum"
            class="two-blank"
            @click="previewImage(info.orderPz)"
          >
            查看
          </a>
        </a-descriptions-item>
        <a-descriptions-item label="合同名称">
          <router-link
            :to="{ name: 'ContractDetail', query: { id: info.contractId } }"
            target="_blank"
            >{{ info.contractName || "--" }}</router-link
          >
        </a-descriptions-item>
        <a-descriptions-item label="订单日期">
          {{ info.orderDate }}
        </a-descriptions-item>
        <a-descriptions-item label="创建人">
          {{ info.createAdmin }}<span class="two-blank"></span>{{ info.ctime }}
        </a-descriptions-item>
      </a-descriptions>
    </template>

    <!-- actions -->
    <template v-slot:extra>
      <a-button
        v-if="UpdatePermission && userCompanyId == info.companyId"
        @click="goEdit"
        >编辑</a-button
      >
      <a-button
        v-if="info.status === '0' && info.auditPermission"
        type="primary"
        @click="openCheck"
        >审核</a-button
      >
    </template>

    <template v-slot:extraContent>
      <div class="status-list">
        <div style="flex: 0 0 110px;">
          <div class="text">状态</div>
          <div class="heading">{{ info.statusv }}</div>
        </div>
        <div>
          <div class="text">订单金额</div>
          <div class="heading">¥{{ info.orderPrice }}</div>
        </div>
      </div>
    </template>
    <a-card
      v-if="isPass"
      v-show="tabActiveKey === '0'"
      style="margin-top: 24px"
      :bordered="false"
    >
      <a-row type="flex">
        <a-col flex="1">
          <info title="已付款" :value="`￥${info.paid}`" :bordered="true" />
        </a-col>
        <a-col flex="1">
          <info title="未付款" :value="`￥${info.unpaid}`" :bordered="true" />
        </a-col>
        <a-col flex="1">
          <info title="已收票" :value="`￥${info.invoiced}`" :bordered="true" />
        </a-col>
        <a-col flex="1">
          <info title="未收票" :value="`￥${info.notInvoiced}`" />
        </a-col>
      </a-row>
    </a-card>
    <order-steps
      v-show="!isPass || tabActiveKey === '1'"
      :data="info.auditLeveArr"
      :id="id"
      type="1"
    ></order-steps>
    <material-table
      v-show="!isPass || tabActiveKey === '0'"
      :updatePermission="UpdatePermission"
      :data="info.material"
      :number="info.materialNum"
      :money="info.orderPrice"
      :paid="info.paid"
      :unpaid="info.unpaid"
      :id="id"
    ></material-table>
    <payment-table
      v-if="isPass"
      v-show="tabActiveKey === '0'"
      :id="id"
      :material="info.material"
      :unpaid="info.unpaid"
      @changePay="getOrderInfo"
    ></payment-table>
    <order-info
      v-show="!isPass || tabActiveKey === '1'"
      :data="info.auditLeveLog"
    ></order-info>
    <log-list
      ref="log-list"
      v-show="!isPass || tabActiveKey === '0'"
      typeId="30"
      :sourceId="id"
    ></log-list>

    <a-modal
      title="审核"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleCheckOk"
      @cancel="handleCheckCancel"
    >
      <check-form
        ref="CheckForm"
        label="订单"
        :show-value="info.idv"
      ></check-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import { appMixin } from '@/store/mixin'
import OrderSteps from './components/Steps.vue'
import OrderInfo from './components/Info.vue'
import MaterialTable from './components/material.vue'
import PaymentTable from './components/PaymentTable'
import Info from '../project/components/Info'
import { LogList, CheckForm } from '@/components'
import { getOrderInfo, auditOrder } from '@/api/order'
import { getAllots } from '@/api/user'

export default {
  name: 'OrderDetail',
  mixins: [appMixin],
  components: {
    OrderSteps,
    OrderInfo,
    MaterialTable,
    PaymentTable,
    LogList,
    CheckForm,
    Info
  },
  data () {
    return {
      id: '',
      UpdatePermission: 0,
      tabList: [],
      tabActiveKey: '0',
      info: {},
      visible: false,
      confirmLoading: false
    }
  },
  computed: {
    isPass () {
      return this.info.status === '1'
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getOrderInfo()
    this.getAllots()
  },
  methods: {
    getOrderInfo () {
      getOrderInfo({
        id: this.id
      }).then(({ data }) => {
        this.info = data
        this.info.id = this.id
        if (data.status !== '1') {
          this.tabList = []
        } else {
          this.tabList = [
            { key: '0', tab: '详情' },
            { key: '1', tab: '审批' }
          ]
        }
      })
    },
    // 获取编辑权限
    getAllots () {
      getAllots({
        limitsPath: '/order/index'
      }).then(({ data }) => {
        this.UpdatePermission =
          data.UpdatePermission || data.UpdatePartPermission
      })
    },
    handleTabChange (key) {
      this.tabActiveKey = key
    },
    openCheck () {
      this.visible = true
      this.$refs.CheckForm && this.$refs.CheckForm.resetFields()
    },
    handleCheckOk () {
      this.confirmLoading = true
      this.$refs.CheckForm.handleSubmit()
        .then(value => {
          this.auditOrder(value)
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    auditOrder (value) {
      auditOrder({
        ...value,
        id: this.id
      }).then(({ message }) => {
        this.$message.success(message)
        this.visible = false
        this.getOrderInfo()
        this.$refs['log-list'].refresh()
      })
    },
    handleCheckCancel () {
      this.visible = false
    },
    // 查看订单凭证
    previewImage (images) {
      this.$viewerApi({
        images
      })
    },
    goEdit () {
      this.$router.push({
        name: 'OrderEdit',
        query: {
          id: this.id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
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
  .status-list {
    text-align: left;
  }
}
</style>
