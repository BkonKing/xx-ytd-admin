<template>
  <a-card :bordered="false" title="审批进度" style="margin-top: 24px;">
    <a-steps class="check-tab-steps" :current="stepList.length - 1" progressDot>
      <a-step v-for="(step, index) in stepList" :key="index">
        <template v-slot:title>
          <span>{{ step.title }}</span>
        </template>
        <template v-slot:description>
          <div v-if="step.status !== 1">
            <div>{{ step.name }}</div>
            <div>{{ step.company }}</div>
            <div>{{ step.time }}</div>
          </div>
        </template>
      </a-step>
    </a-steps>
  </a-card>
</template>

<script>
export default {
  name: 'OrderSteps',
  data () {
    return {
      stepList: [
        {
          title: '创建',
          name: '曲丽丽',
          company: '公司名称',
          time: '2016-12-12 12:32'
        },
        {
          title: '一审',
          name: '曲丽丽',
          company: '公司名称',
          time: '2016-12-12 12:32'
        },
        {
          title: '完成',
          name: '曲丽丽',
          company: '公司名称',
          time: '2016-12-12 12:32',
          status: 1
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.check-tab-steps {
  justify-content: center;
}
</style>
