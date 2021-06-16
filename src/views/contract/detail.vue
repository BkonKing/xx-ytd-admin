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

    <a-card style="margin-top: 24px" :bordered="false">
      <a-row>
        <a-col :sm="5" :xs="24">
          <info title="订单（5个）" value="￥5000" :bordered="true" />
        </a-col>
        <a-col :sm="5" :xs="24">
          <info title="已付款（2）" value="￥5000" :bordered="true" />
        </a-col>
        <a-col :sm="5" :xs="24">
          <info title="未付款（2）" value="￥5000" :bordered="true" />
        </a-col>
        <a-col :sm="5" :xs="24">
          <info title="已收票（2）" value="￥5000" :bordered="true" />
        </a-col>
        <a-col :sm="4" :xs="24">
          <info title="未收票付款（2）" value="￥5000" />
        </a-col>
      </a-row>
    </a-card>

    <a-card :bordered="false" style="margin-top: 24px;">
      <a-descriptions title="退款申请">
        <a-descriptions-item label="取货单号">1000000000</a-descriptions-item>
        <a-descriptions-item label="状态">已取货</a-descriptions-item>
        <a-descriptions-item label="销售单号">1234123421</a-descriptions-item>
        <a-descriptions-item label="子订单">
          <div>2342341234</div>
          <div>
            <img src="" alt="">
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import Info from '../project/components/Info'
export default {
  name: 'Advanced',
  components: {
    Info
  },
  data () {
    return {
      title: '',
      isMobile: false,
      tabList: [
        { key: 'detail', tab: '资料' },
        { key: 'dingdan', tab: '订单' },
        { key: 'rule', tab: '审批' }
      ],
      tabActiveKey: 'detail'
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        agree: '成功',
        reject: '驳回'
      }
      return statusMap[status]
    },
    statusTypeFilter (type) {
      const statusTypeMap = {
        agree: 'success',
        reject: 'error'
      }
      return statusTypeMap[type]
    }
  },
  methods: {
    handleTabChange (key) {
      console.log('')
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
