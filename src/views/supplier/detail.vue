<template>
  <page-header-wrapper
    :title="title"
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    @tabChange="handleTabChange"
  >
    <template v-slot:content>
      <a-descriptions size="small" :column="isMobile ? 1 : 2">
        <a-descriptions-item label="所属公司">公司名称</a-descriptions-item>
        <a-descriptions-item label="关联项目">项目名称</a-descriptions-item>
        <a-descriptions-item label="类型">XX 服务</a-descriptions-item>
        <a-descriptions-item label="创建人">2017-07-07</a-descriptions-item>
        <a-descriptions-item label="供应物料">
          12421
        </a-descriptions-item>
      </a-descriptions>
    </template>

    <!-- actions -->
    <template v-slot:extra>
      <a-button>编辑</a-button>
      <a-button type="primary">审核</a-button>
    </template>

    <template v-slot:extraContent>
      <a-row class="status-list">
        <a-col :xs="12" :sm="12">
          <div class="text">状态</div>
          <div class="heading">待审批</div>
        </a-col>
        <a-col :xs="12" :sm="12">
          <div class="text">合同金额</div>
          <div class="heading">¥ 568.08</div>
        </a-col>
      </a-row>
    </template>
    <statistics></statistics>
    <basic-info></basic-info>
    <payment-table></payment-table>
    <order-steps></order-steps>
    <material-table></material-table>
    <order-info></order-info>
    <log-list :load="logLoadData"></log-list>
  </page-header-wrapper>
</template>

<script>
import { appMixin } from '@/store/mixin'
import OrderSteps from '../order/components/Steps.vue'
import OrderInfo from '../order/components/Info.vue'
import MaterialTable from '../order/components/material.vue'
import Statistics from '../order/components/statistics'
import PaymentTable from '../order/components/PaymentTable'
import BasicInfo from './components/basicInfo.vue'
import { LogList } from '@/components'
import { getPermissions } from '@/api/manage'
export default {
  name: 'OrderDetail',
  mixins: [appMixin],
  components: {
    OrderSteps,
    OrderInfo,
    MaterialTable,
    Statistics,
    PaymentTable,
    LogList,
    BasicInfo
  },
  data () {
    return {
      title: '',
      tabList: [
        { key: '0', tab: '订单' },
        { key: '1', tab: '审批' }
      ],
      tabActiveKey: '0',
      projectInfo: {},
      logLoadData: getPermissions
    }
  },
  methods: {
    handleTabChange (key) {
      this.tabActiveKey = key
    },
    // 查看订单凭证
    previewLicence () {
      this.$viewerApi({
        images: this.projectInfo.images
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
