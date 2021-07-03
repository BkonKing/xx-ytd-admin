<template>
  <div>
    <a-steps :current="current">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <div class="steps-content">
    </div>
  </div>
</template>
<script>
import { getDdCode } from '@/api/user'
export default {
  data () {
    return {
      current: 0,
      steps: [
        {
          title: '打开微信扫码'
        },
        {
          title: '微信允许申请'
        },
        {
          title: '完成'
        }
      ]
    }
  },
  created () {
    this.getDdCode()
  },
  methods: {
    getDdCode () {
      getDdCode().then((res) => {
        console.log(res)
      })
    },
    next () {
      this.current++
    },
    prev () {
      this.current--
    }
  }
}
</script>
<style scoped>
.steps-content {
  margin-top: 16px;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}
</style>
