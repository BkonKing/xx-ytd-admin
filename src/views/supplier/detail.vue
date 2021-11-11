<template>
  <page-header-wrapper
    class="special-descriptions"
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
          <template v-if="info.projectArr && info.projectArr.length">
            <router-link
              v-for="(item, index) in info.projectArr"
              :key="item.projectId"
              :to="{ name: 'ProjectDetail', query: { id: item.projectId } }"
              target="_blank"
              >{{ item.projectName
              }}{{
                index === info.projectArr.length - 1 ? "" : "，"
              }}</router-link
            >
          </template>
          <span v-else>--</span>
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
        <div v-if="isPass">
          <div class="text">合同金额</div>
          <div class="heading">¥ {{ info.contractMoney }}</div>
        </div>
      </div>
    </template>

    <order-steps
      v-if="info.auditLeveArr && info.auditLeveArr.length"
      v-show="!isPass || tabActiveKey === '2'"
      :data="info.auditLeveArr"
      :id="id"
      type="3"
    ></order-steps>
    <pay-statistics
      v-show="isPass && tabActiveKey === '0'"
      :data="info"
    ></pay-statistics>
    <basic-info
      v-show="!isPass || tabActiveKey === '0'"
      :data="info"
    ></basic-info>
    <order-steps-info
      v-show="!isPass || tabActiveKey === '2'"
      :data="info.auditLeveLog"
    ></order-steps-info>
    <log-list
      ref="log-list"
      v-show="!isPass || tabActiveKey === '0'"
      typeId="40"
      :sourceId="id"
    ></log-list>

    <material-table
      v-if="isPass"
      v-show="tabActiveKey === '1'"
      :supplierId="id"
      :options="info.projectArr"
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
import PayStatistics from './components/PayStatistics.vue'
import { CheckForm, LogList } from '@/components'
import { getSuppInfo, auditSupp } from '@/api/supplier'
import { getAllots } from '@/api/user'

export default {
  name: 'OrderDetail',
  mixins: [appMixin],
  components: {
    OrderSteps,
    OrderStepsInfo,
    MaterialTable,
    LogList,
    BasicInfo,
    CheckForm,
    PayStatistics
  },
  data () {
    return {
      id: '',
      UpdatePermission: 0,
      tabList: [],
      tabActiveKey: '0',
      info: {
        projectArr: []
      },
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
    this.getSuppInfo()
    this.getAllots()
  },
  methods: {
    getSuppInfo () {
      getSuppInfo({
        id: this.id
      }).then(({ data }) => {
        this.info = data
        this.info.id = this.id
        if (data.status !== '1') {
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
    // 获取编辑权限
    getAllots () {
      getAllots({
        limitsPath: '/supplier/index'
      }).then(({ data }) => {
        this.UpdatePermission = data.UpdatePermission
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
        this.$refs['log-list'].refresh()
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

.special-descriptions {
  /deep/ .status-list {
    .heading {
      white-space: nowrap;
    }
  }
  /deep/ .ant-pro-page-header-wrap-extraContent {
    min-width: auto;
  }
}

/deep/ .ant-pro-page-header-wrap-extraContent {
  margin-left: 0;
}
</style>
