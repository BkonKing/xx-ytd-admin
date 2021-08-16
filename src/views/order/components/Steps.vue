<template>
  <a-card :bordered="false" title="审批进度" style="margin-top: 24px;">
    <a-steps class="check-tab-steps" :current="current" progressDot>
      <a-step v-for="(step, index) in data" :key="index">
        <template v-slot:title>
          <span>{{ step.leve }}</span>
        </template>
        <template v-slot:description>
          <div v-if="step.realname">
            {{ step.realname }}
          </div>
          <div
            v-else-if="current === index && index !== data.length - 1"
            style="color: #f5222d;"
          >
            暂无审批人员
          </div>
          <div v-else></div>
          <div>{{ step.company }}</div>
          <div>{{ step.leveTime }}</div>
          <div
            v-if="
              !+step.status &&
                current === index &&
                index !== data.length - 1 &&
                step.realname
            "
          >
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
      const index = this.data.findIndex(obj => obj.status === 0)
      return index === -1 ? this.data.length - 1 : index
    }
  },
  methods: {
    // 催一下
    prompt (step) {
      promptMessage({
        id: this.id,
        auditType: this.type
      }).then(res => {
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
  /deep/ .ant-steps-item:last-child {
    margin-right: 67px;
  }
  /deep/ .ant-steps-item-content,
  .ant-steps-dot.ant-steps-small .ant-steps-item-content {
    width: auto;
  }
  /deep/ .ant-steps-item-title {
    margin-bottom: 8px;
  }
  /deep/ .ant-steps-item-content {
    margin-left: 55px;
    text-align: left;
  }
  /deep/
    .ant-steps-item-process
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-title {
    color: rgba(0, 0, 0, 0.45);
  }
  /deep/
    .ant-steps-item-finish
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-description,
  /deep/
    .ant-steps-item-wait
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-description,
  /deep/
    .ant-steps-item-process
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-description {
    color: rgba(0, 0, 0, 0.35);
  }
}
</style>
