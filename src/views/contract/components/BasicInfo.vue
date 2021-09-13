<template>
  <a-card title="基础信息" :bordered="false" style="margin-top: 24px;">
    <a-descriptions>
      <a-descriptions-item label="合同单号">
        {{ data.contractNo }}
      </a-descriptions-item>
      <a-descriptions-item label="合同名称">
        {{ data.contractName }}
      </a-descriptions-item>
      <a-descriptions-item label="所属项目">
        {{ data.projectName }}
      </a-descriptions-item>
      <a-descriptions-item label="合同状态">
        {{ data.contractStatusv }}
      </a-descriptions-item>
      <a-descriptions-item label="合同类型">
        {{ data.categoryName }}
      </a-descriptions-item>
      <a-descriptions-item label="所属公司">
        {{ data.companyName }}
      </a-descriptions-item>
      <a-descriptions-item label="合同有效期">
        {{ data.startDate }} ~ {{ data.endDate }}
      </a-descriptions-item>
      <a-descriptions-item label="签订日期">
        {{ data.signDate }}
      </a-descriptions-item>
      <a-descriptions-item label="合同文件">
        {{ data.contractPzNum }}个文件<a
          v-if="data.contractPzNum > 0"
          class="two-blank"
          @click="previewImage"
          >查看</a
        >
      </a-descriptions-item>
      <a-descriptions-item label="合同金额">
        ￥{{ data.contractMoney }}
      </a-descriptions-item>
      <a-descriptions-item label="合同总量">
        {{ data.contractTotal }}
      </a-descriptions-item>
      <a-descriptions-item label="税率">
        {{ data.taxRate }}
      </a-descriptions-item>
      <a-descriptions-item label="供应商">
        {{ data.supplierName }}
      </a-descriptions-item>
      <a-descriptions-item label="结算方式">
        {{ data.settleTypeName }}
      </a-descriptions-item>
      <a-descriptions-item label="付款方式">
        {{ data.payTypeName }}
      </a-descriptions-item>
      <a-descriptions-item label="物料" :span="3">
        {{ data.materialName }}
      </a-descriptions-item>
      <a-descriptions-item label="备注" :span="3">
        {{ data.remarks || "--" }}
      </a-descriptions-item>
    </a-descriptions>
    <file-list-modal
      v-model="previvewVisible"
      :data="data.contractPz"
      title="合同文件"
    ></file-list-modal>
  </a-card>
</template>

<script>
import { FileListModal } from '@/components'
export default {
  name: 'BasicInfo',
  components: {
    FileListModal
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      previvewVisible: false
    }
  },
  methods: {
    previewImage () {
      this.previvewVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.ant-upload-list-item:first-child {
  margin-top: 0;
}
/deep/ .ant-descriptions-item {
  > span {
    vertical-align: top;
  }
}
/deep/ .ant-descriptions-view tbody > tr:last-child {
  .ant-descriptions-item {
    padding-bottom: 0;
    .ant-descriptions-item-content {
      width: calc(100% - 70px);
    }
  }
}
</style>
