<template>
  <a-card
    v-if="data && data.length"
    :bordered="false"
    title="审批信息"
    style="margin-top: 24px;"
  >
    <a-descriptions
      v-for="(checkInfo, index) in data"
      :key="index"
      :title="checkInfo.leve"
      class="step-description"
    >
      <a-descriptions-item label="审核时间">{{
        checkInfo.leveTime
      }}</a-descriptions-item>
      <a-descriptions-item label="审核状态">{{
        checkInfo.status === 1 ? "已通过" : "未通过"
      }}</a-descriptions-item>
      <a-descriptions-item label="审核人">{{
        checkInfo.realname
      }}</a-descriptions-item>
      <a-descriptions-item label="审核说明" :span="3">
        <div>{{ checkInfo.describe || "--" }}</div>
        <div
          v-if="checkInfo.annex && checkInfo.annex.length"
          style="margin-top: 10px;"
        >
          <t-image :images="checkInfo.annex"></t-image>
        </div>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>

<script>
import { TImage } from '@/components'
export default {
  name: 'OrderInfo',
  components: {
    TImage
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-descriptions-item > span{
  vertical-align: top;
  .image-box {
    margin-left: 0;
  }
}
/deep/ .ant-descriptions-view tbody > tr:last-child .ant-descriptions-item-content {
  width: calc(100% - 70px);
}
.step-description + .step-description {
  margin-top: 16px;
  padding-top: 28px;
  border-top: 1px solid #eee;
}
</style>
