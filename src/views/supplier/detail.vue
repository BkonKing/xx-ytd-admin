<template>
  <page-header-wrapper
    :title="info.supplierName"
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    @tabChange="handleTabChange"
  >
    <template v-slot:content>
      <a-descriptions size="small" :column="isMobile ? 1 : 2">
        <a-descriptions-item label="所属公司">
          {{ info.companyName }}
        </a-descriptions-item>
        <a-descriptions-item label="关联项目">
          {{ info.projectName || "--" }}
        </a-descriptions-item>
        <a-descriptions-item label="类型">
          {{ info.supplierTypeName }}
        </a-descriptions-item>
        <a-descriptions-item label="创建人">
          {{ info.createAdmin }}
        </a-descriptions-item>
        <a-descriptions-item label="供应物料">
          {{ info.materialName }}
        </a-descriptions-item>
      </a-descriptions>
    </template>

    <!-- actions -->
    <template v-if="!isPass" v-slot:extra>
      <a-button @click="goEdit">编辑</a-button>
      <a-button type="primary" @click="openCheck">审核</a-button>
    </template>

    <template v-slot:extraContent>
      <a-row class="status-list" type="flex">
        <a-col flex="1">
          <div class="text">状态</div>
          <div class="heading">{{ info.statusv }}</div>
        </a-col>
        <a-col v-if="isPass" flex="1">
          <div class="text">合同金额</div>
          <div class="heading">¥ {{ info.contractMoney }}</div>
        </a-col>
      </a-row>
    </template>

    <order-steps
      v-show="!isPass || tabActiveKey === '2'"
      :data="info.auditLeveArr"
    ></order-steps>
    <basic-info
      v-show="!isPass || tabActiveKey === '0'"
      :data="info"
    ></basic-info>
    <order-steps-info
      v-show="!isPass || tabActiveKey === '2'"
      :data="info.auditLeveLog"
    ></order-steps-info>
    <log-list v-show="!isPass || tabActiveKey === '0'" typeId="40"></log-list>

    <material-table
      v-if="isPass"
      v-show="tabActiveKey === '1'"
    ></material-table>

    <a-modal
      title="审核"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleCheckOk"
      @cancel="handleCheckCancel"
    >
      <check-form
        ref="CheckForm"
        label="供应商"
        :show-value="info.supplierName"
      ></check-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import { appMixin } from '@/store/mixin'
import OrderSteps from '../order/components/Steps.vue'
import OrderStepsInfo from '../order/components/Info.vue'
import MaterialTable from './components/material.vue'
import BasicInfo from './components/basicInfo.vue'
import { CheckForm, LogList } from '@/components'
import { getSuppInfo, auditSupp } from '@/api/supplier'
export default {
  name: 'OrderDetail',
  mixins: [appMixin],
  components: {
    OrderSteps,
    OrderStepsInfo,
    MaterialTable,
    LogList,
    BasicInfo,
    CheckForm
  },
  data () {
    return {
      id: '',
      tabList: [],
      tabActiveKey: '0',
      info: {},
      visible: false
    }
  },
  computed: {
    isPass () {
      return this.info.status === '1'
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getSuppInfo()
  },
  methods: {
    getSuppInfo () {
      getSuppInfo({
        id: this.id
      }).then(({ data }) => {
        this.info = data
        this.info.id = this.id
        if (data.status === '0') {
          this.tabList = []
        } else {
          this.tabList = [
            { key: '0', tab: '资料' },
            { key: '1', tab: '物料' },
            { key: '2', tab: '审批' }
          ]
        }
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
          this.auditSupp(value)
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    auditSupp (value) {
      auditSupp({
        ...value,
        id: this.id
      }).then(({ message }) => {
        this.$message.success(message)
        this.visible = false
        this.getSuppInfo()
      })
    },
    handleCheckCancel () {
      this.visible = false
    },
    goEdit () {
      this.$router.push({
        name: 'SupplierEdit',
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
</style>
