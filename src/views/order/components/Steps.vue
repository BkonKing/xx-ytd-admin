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
            <a>催一下</a>
          </div>
        </template>
      </a-step>
    </a-steps>
  </a-card>
</template>

<script>
export default {
  name: 'OrderSteps',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    current () {
      return this.data.findIndex(obj => obj.status === 0) - 1
    }
  }
  // data () {
  //   return {
  //     stepList: [
  //       {
  //         title: '创建',
  //         name: '曲丽丽',
  //         company: '公司名称',
  //         time: '2016-12-12 12:32'
  //       },
  //       {
  //         title: '一审',
  //         name: '曲丽丽',
  //         company: '公司名称',
  //         time: '2016-12-12 12:32'
  //       },
  //       {
  //         title: '完成',
  //         name: '曲丽丽',
  //         company: '公司名称',
  //         time: '2016-12-12 12:32',
  //         status: 1
  //       }
  //     ]
  //   }
  // }
}
</script>

<style lang="less" scoped>
.check-tab-steps {
  justify-content: center;
}
</style>
