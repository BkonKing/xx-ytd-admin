<template>
  <page-header-wrapper
    :title="title"
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    @tabChange="handleTabChange"
  >
    <template v-slot:content>
      <a-descriptions size="small" :column="2">
        <a-descriptions-item label="项目工期">曲丽丽</a-descriptions-item>
        <a-descriptions-item label="项目ID">XX 服务</a-descriptions-item>
        <a-descriptions-item label="项目负责">2017-07-07</a-descriptions-item>
        <a-descriptions-item label="项目采购">
          12421
        </a-descriptions-item>
        <a-descriptions-item label="技术负责"
          >2017-07-07 ~ 2017-08-08</a-descriptions-item
        >
        <a-descriptions-item label="施工许可证"
          >请于两个工作日内确认<a-button
            v-if="projectInfo.images && projectInfo.images.length"
            type="link"
            @click="previewLicence"
          >
            查看
          </a-button></a-descriptions-item
        >
        <a-descriptions-item label="创建人"
          >2017-07-07 ~ 2017-08-08</a-descriptions-item
        >
        <a-descriptions-item label="参与公司"
          >公司名称，公司名称名称，公司名称，公司名称</a-descriptions-item
        >
      </a-descriptions>
    </template>

    <template v-slot:extraContent>
      <a-row class="status-list">
        <a-col :xs="12" :sm="12">
          <div class="text">阶段</div>
          <div class="heading">竣工验收</div>
        </a-col>
        <a-col :xs="12" :sm="12">
          <div class="text">参与公司</div>
          <div class="heading">4家</div>
        </a-col>
      </a-row>
    </template>
    <a-card style="margin-top: 24px" :bordered="false">
      <a-row>
        <a-col :sm="6" :xs="24">
          <info title="合同（5个）" value="￥5,000.00" :bordered="true" />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="订单（25个）" value="￥3,000.00" :bordered="true" />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="供应商" value="14个" :bordered="true" />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info title="材料（10种）" value="1,000个" />
        </a-col>
      </a-row>
    </a-card>

    <template v-if="tabActiveKey === '0'">
      <contract-tab></contract-tab>
    </template>
    <template v-if="tabActiveKey === '1'">
      <order-tab></order-tab>
    </template>
  </page-header-wrapper>
</template>

<script>
import Info from './components/Info'
import contractTab from './components/contractTab'
import OrderTab from './components/OrderTab.vue'
export default {
  name: 'projectDetail',
  components: {
    Info,
    contractTab,
    OrderTab
  },
  data () {
    return {
      title: '',
      tabList: [
        { key: '0', tab: '合同' },
        { key: '1', tab: '订单' }
      ],
      tabActiveKey: '0',
      projectInfo: {
        images: []
      }
    }
  },
  methods: {
    // 查看施工许可证
    previewLicence () {
      this.$viewerApi({
        images: this.projectInfo.images
      })
    },
    handleTabChange (key) {
      this.tabActiveKey = key
    }
  }
}
</script>

<style lang="less" scoped>
.table-page-search-wrapper {
  /deep/ .ant-form-inline .ant-form-item > .ant-form-item-label {
    width: 80px;
  }
}
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
