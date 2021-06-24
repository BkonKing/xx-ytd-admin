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
    >
      <a-descriptions-item label="审核时间">{{checkInfo.leveTime}}</a-descriptions-item>
      <a-descriptions-item label="审核状态">{{checkInfo.status === 1 ? "已通过" : '未通过' }}</a-descriptions-item>
      <a-descriptions-item label="审核人">{{checkInfo.realname}}</a-descriptions-item>
      <a-descriptions-item label="审核说明" :span="3">
        <div>{{ checkInfo.describe || "无" }}</div>
        <div v-if="checkInfo.annex && checkInfo.annex.length" style="margin-top: 10px;">
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
    return {
    }
  }
}
</script>

<style></style>
