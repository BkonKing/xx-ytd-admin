<template>
  <a-card :bordered="false" title="审批进度" style="margin-top: 24px;">
    <a-steps class="check-tab-steps" :current="current" progressDot>
      <a-step v-for="(step, index) in data" :key="index">
        <template v-slot:title>
          <span>{{ step.leve }}</span>
        </template>
        <template v-slot:description>
          <div>{{ step.realname }}</div>
          <div>{{ step.company }}</div>
          <div>{{ step.leveTime }}</div>
          <div v-if="!step.status && (current + 1) === index">
            <template v-if="step.hurryUp">已催</template>
            <a v-else @click="prompt(step)">催一下</a>
          </div>
        </template>
      </a-step>
    </a-steps>
  </a-card>
</template>

<script>
import { promptMessage } from '@/api/common'
export default {
  name: 'OrderSteps',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    // 1=订单审核、2=合同审核、3=供应商审核
    type: {
      type: String,
      default: '0'
    },
    id: {
      type: [String, Number],
      default: '0'
    }
  },
  computed: {
    current () {
      let index = this.data.findIndex(obj => obj.status === 0)
      index = index === -1 ? this.data.length : index
      return index - 1
    }
  },
  methods: {
    // 催一下
    prompt (step) {
      promptMessage({
        id: this.id,
        auditType: this.type
      }).then((res) => {
        step.hurryUp = 1
        this.$message.success('发送成功')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.check-tab-steps {
  justify-content: center;
}
</style>
