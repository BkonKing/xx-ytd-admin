<template>
  <page-header-wrapper
    :title="info.contractName"
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    @tabChange="handleTabChange"
  >
    <template v-slot:content>
      <a-descriptions size="small" :column="isMobile ? 1 : 2">
        <a-descriptions-item label="所属项目">
          <router-link
            :to="{ name: 'ProjectDetail', query: { id: info.projectId } }"
            >{{ info.projectName || "--" }}</router-link
          >
        </a-descriptions-item>
        <a-descriptions-item label="创建人">
          {{ info.createAdmin }}
        </a-descriptions-item>
        <a-descriptions-item label="所属公司">
          {{ info.companyName }}
        </a-descriptions-item>
      </a-descriptions>
    </template>

    <!-- actions -->
    <template v-slot:extra>
      <a-button v-if="UpdatePermission" @click="goEdit">编辑</a-button>
      <a-button v-if="!isPass && info.auditPermission" type="primary" @click="openCheck"
        >审核</a-button
      >
    </template>

    <template v-slot:extraContent>
      <a-row class="status-list" type="flex">
        <a-col flex="1">
          <div class="text">状态</div>
          <div class="heading">{{ info.statusv }}</div>
        </a-col>
        <a-col flex="1">
          <div class="text">合同金额</div>
          <div class="heading">￥{{ info.contractMoney }}</div>
        </a-col>
        <a-col flex="1">
          <div class="text">合同总量</div>
          <div class="heading">{{ info.contractTotal }}</div>
        </a-col>
      </a-row>
    </template>

    <a-card
      v-show="isPass && tabActiveKey !== '2'"
      style="margin-top: 24px"
      :bordered="false"
    >
      <a-row type="flex">
        <a-col flex="1">
          <info
            :title="`订单（${info.orderNum}个）`"
            :value="`￥${info.orderMoney}`"
            :bordered="true"
          />
        </a-col>
        <a-col flex="1">
          <info
            :title="`已付款（${info.orderPayNum}）`"
            :value="`￥${info.orderPayMoney}`"
            :bordered="true"
          />
        </a-col>
        <a-col flex="1">
          <info
            :title="`未付款（${info.orderUnPayNum}）`"
            :value="`￥${info.orderUnPayMoney}`"
            :bordered="true"
          />
        </a-col>
        <a-col flex="1">
          <info
            :title="`已收票（${info.orderInvoicedNum}）`"
            :value="`￥${info.orderInvoicedMoney}`"
            :bordered="true"
          />
        </a-col>
        <a-col flex="1">
          <info
            :title="`未收票付款（${info.orderUnInvoicedNum}）`"
            :value="`￥${info.orderUnInvoicedMoney}`"
          />
        </a-col>
      </a-row>
    </a-card>

    <c-steps
      v-show="!isPass || tabActiveKey === '2'"
      :data="info.auditLeveArr"
    ></c-steps>
    <basic-info
      v-show="!isPass || tabActiveKey === '0'"
      :data="info"
    ></basic-info>
    <c-steps-info
      v-show="!isPass || tabActiveKey === '2'"
      :data="info.auditLeveLog"
    ></c-steps-info>
    <log-list v-show="!isPass || tabActiveKey === '0'" typeId="20"></log-list>

    <order-tab
      v-show="tabActiveKey === '1'"
      :contractId="id"
      :companyId="info.companyId"
    ></order-tab>

    <a-modal
      title="审核"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleCheckOk"
      @cancel="handleCheckCancel"
    >
      <check-form
        ref="CheckForm"
        label="合同"
        :show-value="info.contractName"
      ></check-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import Info from '../project/components/Info'
import BasicInfo from './components/BasicInfo'
import OrderTab from './components/OrderTab'
import cSteps from '../order/components/Steps.vue'
import cStepsInfo from '../order/components/Info.vue'
import { CheckForm, LogList } from '@/components'
import { appMixin } from '@/store/mixin'
import { getContractInfo, auditCont } from '@/api/contract'
import { getAllots } from '@/api/user'

export default {
  name: 'ContractDetail',
  mixins: [appMixin],
  components: {
    CheckForm,
    Info,
    BasicInfo,
    OrderTab,
    cSteps,
    cStepsInfo,
    LogList
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
    this.getContractInfo()
    this.getAllots()
  },
  methods: {
    // 获取合同详情
    getContractInfo () {
      getContractInfo({
        id: this.id
      }).then(({ data }) => {
        this.info = data
        this.info.id = this.id
        if (data.status === '0') {
          this.tabList = []
        } else {
          this.tabList = [
            { key: '0', tab: '资料' },
            { key: '1', tab: '订单' },
            { key: '2', tab: '审批' }
          ]
        }
      })
    },
    // 获取编辑权限
    getAllots () {
      getAllots({
        limitsPath: '/contract/index'
      }).then(({ data }) => {
        this.UpdatePermission = data.UpdatePermission || data.UpdatePartPermission
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
          this.auditCont(value)
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    auditCont (value) {
      auditCont({
        ...value,
        id: this.id
      }).then(({ message }) => {
        this.$message.success(message)
        this.visible = false
        this.getContractInfo()
      })
    },
    handleCheckCancel () {
      this.visible = false
    },
    goEdit () {
      this.$router.push({
        name: 'ContractEdit',
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
  word-break: break-all;
}

/deep/ .ant-pro-page-header-wrap-main .ant-pro-page-header-wrap-content,
/deep/ .ant-pro-page-header-wrap-main .ant-pro-page-header-wrap-extraContent {
  flex: 1 !important;
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
