<template>
  <page-header-wrapper
    :title="title"
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    @tabChange="handleTabChange"
  >
    <template v-slot:content>
      <a-descriptions size="small" :column="isMobile ? 1 : 2">
        <a-descriptions-item label="所属项目">曲丽丽</a-descriptions-item>
        <a-descriptions-item label="创建人">XX 服务</a-descriptions-item>
        <a-descriptions-item label="所属公司">2017-07-07</a-descriptions-item>
      </a-descriptions>
    </template>

    <template v-slot:extraContent>
      <a-row class="status-list">
        <a-col :xs="8" :sm="8">
          <div class="text">状态</div>
          <div class="heading">待审批</div>
        </a-col>
        <a-col :xs="8" :sm="8">
          <div class="text">合同金额</div>
          <div class="heading">￥100000</div>
        </a-col>
        <a-col :xs="8" :sm="8">
          <div class="text">合同总量</div>
          <div class="heading">1000</div>
        </a-col>
      </a-row>
    </template>

    <a-card v-show="tabActiveKey !== '2'" style="margin-top: 24px" :bordered="false">
      <a-row type="flex">
        <a-col flex="1">
          <info title="订单（5个）" value="￥5000" :bordered="true" />
        </a-col>
        <a-col flex="1">
          <info title="已付款（2）" value="￥5000" :bordered="true" />
        </a-col>
        <a-col flex="1">
          <info title="未付款（2）" value="￥5000" :bordered="true" />
        </a-col>
        <a-col flex="1">
          <info title="已收票（2）" value="￥5000" :bordered="true" />
        </a-col>
        <a-col flex="1">
          <info title="未收票付款（2）" value="￥5000" />
        </a-col>
      </a-row>
    </a-card>

    <info-tab v-show="tabActiveKey === '0'"></info-tab>
    <order-tab  v-show="tabActiveKey === '1'" type="1"></order-tab>
    <check-tab v-show="tabActiveKey === '2'"></check-tab>
  </page-header-wrapper>
</template>

<script>
import Info from '../project/components/Info'
import InfoTab from './components/InfoTab'
import OrderTab from '@/views/project/components/OrderTab'
import CheckTab from './components/CheckTab'

export default {
  name: 'Advanced',
  components: {
    Info,
    InfoTab,
    OrderTab,
    CheckTab
  },
  data () {
    return {
      title: '',
      isMobile: false,
      tabList: [
        { key: '0', tab: '资料' },
        { key: '1', tab: '订单' },
        { key: '2', tab: '审批' }
      ],
      tabActiveKey: '0'
    }
  },
  methods: {
    handleTabChange (key) {
      this.tabActiveKey = key
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
  .text {
  }
  .status-list {
    text-align: left;
  }
}
</style>
