<template>
  <page-header-wrapper
    :title="projectInfo.projectName"
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    @tabChange="handleTabChange"
  >
    <template v-slot:content>
      <a-descriptions size="small" :column="2">
        <a-descriptions-item label="项目工期">
          {{ projectInfo.startDate }}~{{ projectInfo.endDate }}
        </a-descriptions-item>
        <a-descriptions-item label="项目ID">
          {{ projectInfo.id }}
        </a-descriptions-item>
        <a-descriptions-item label="项目负责">
          {{ projectInfo.manage }} {{ projectInfo.manageMobile }}
        </a-descriptions-item>
        <a-descriptions-item label="项目采购">
          <template v-if="projectInfo.buyer && projectInfo.buyerMobile">
            {{ projectInfo.buyer }} {{ projectInfo.buyerMobile }}
          </template>
          <template v-else>无</template>
        </a-descriptions-item>
        <a-descriptions-item label="技术负责">
          <template v-if="projectInfo.technician && projectInfo.technicianMobile">
            {{ projectInfo.technician }} {{ projectInfo.technicianMobile }}
          </template>
          <template v-else>无</template>
        </a-descriptions-item>
        <a-descriptions-item label="施工许可证">
          {{ projectInfo.licenceNum }}张
          <a-button
            v-if="projectInfo.licence && projectInfo.licence.length"
            type="link"
            @click="previewLicence"
          >
            查看
          </a-button>
        </a-descriptions-item>
        <a-descriptions-item label="创建人">
          {{ projectInfo.createAdmin }}
        </a-descriptions-item>
        <a-descriptions-item label="参与公司">
          {{ projectInfo.companyNames || '无' }}
        </a-descriptions-item>
      </a-descriptions>
    </template>

    <template v-slot:extraContent>
      <a-row class="status-list">
        <a-col :xs="12" :sm="12">
          <div class="text">阶段</div>
          <div class="heading">{{ projectInfo.stage || "无" }}</div>
        </a-col>
        <a-col :xs="12" :sm="12">
          <div class="text">参与公司</div>
          <div class="heading">{{ projectInfo.relationCompanyNum || 0 }}家</div>
        </a-col>
      </a-row>
    </template>
    <a-card style="margin-top: 24px" :bordered="false">
      <a-row>
        <a-col :sm="6" :xs="24">
          <info
            :title="`合同（${projectInfo.relationContractNum || 0}个）`"
            :value="`￥${projectInfo.relationContractMoneys || 0}`"
            :bordered="true"
          />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info
            :title="`订单（${projectInfo.relationOrderNum || 0}个）`"
            :value="`￥${projectInfo.relationOrderMoneys || 0}`"
            :bordered="true"
          />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info
            title="供应商"
            :value="`${projectInfo.relationSupplierNum || 0}个`"
            :bordered="true"
          />
        </a-col>
        <a-col :sm="6" :xs="24">
          <info
            :title="`物料（${projectInfo.relationMaterialNum || 0}种）`"
            :value="`${projectInfo.relationMaterialTotal || 0}个`"
          />
        </a-col>
      </a-row>
    </a-card>

    <template v-if="tabActiveKey === '0'">
      <contract-tab :projectId="id"></contract-tab>
    </template>
    <template v-if="tabActiveKey === '1'">
      <order-tab :projectId="id"></order-tab>
    </template>
  </page-header-wrapper>
</template>

<script>
import Info from './components/Info'
import contractTab from './components/contractTab'
import OrderTab from './components/OrderTab.vue'
import { getProjectInfo } from '@/api/project'
export default {
  name: 'projectDetail',
  components: {
    Info,
    contractTab,
    OrderTab
  },
  data () {
    return {
      id: '',
      tabList: [
        { key: '0', tab: '合同' },
        { key: '1', tab: '订单' }
      ],
      tabActiveKey: '0',
      projectInfo: {
        licence: []
      }
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getProjectInfo()
  },
  methods: {
    getProjectInfo () {
      getProjectInfo({
        id: this.id
      }).then(({ data }) => {
        this.projectInfo = data
      })
    },
    // 查看施工许可证
    previewLicence () {
      this.$viewerApi({
        images: this.projectInfo.licence
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
