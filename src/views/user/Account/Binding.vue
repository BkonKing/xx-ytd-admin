<template>
  <div>
    <a-steps :current="current">
      <a-step
        v-for="(item, index) in steps"
        :key="item.title"
        :title="item.title"
        @click="handleClick(index)"
      />
    </a-steps>
    <div class="steps-content">
      <div v-if="current === 0">
        <QRCode :qrcode="qrcode" style="width:200px;height:200px;"></QRCode>
        <div style="margin-top: 10px;">打开微信“扫一扫”，进行扫码</div>
      </div>
      <div v-if="current === 1">
        <img src="@/assets/wx-binding.png" />
      </div>
      <div v-if="current === 2">
        <a-icon
          type="check-circle"
          theme="filled"
          style="font-size: 80px;color: #52C41A;"
        />
        <div class="success-text">绑定成功"{{ userInfo.nickName }}"</div>
        <a-button type="primary" @click="reset">重新绑定</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { QRCode } from '@/components'
import { getDdCode } from '@/api/user'
import { mapGetters } from 'vuex'
export default {
  components: {
    QRCode
  },
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
      ],
      isComplate: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created () {
    this.isComplate = Boolean(this.userInfo.wxOpenid)
    this.isComplate && (this.current = 2)
    this.getDdCode()
  },
  methods: {
    // 重新绑定
    reset () {
      this.current = 0
      this.isComplate = false
    },
    getDdCode () {
      getDdCode().then(res => {
        this.qrcode = res.qrcode
      })
    },
    getStatus () {
      this.$store.dispatch('GetInfo')
    },
    handleClick (index) {
      !this.isComplate && index !== 2 && (this.current = index)
    }
  }
}
</script>
<style scoped>
.steps-content {
  margin-top: 16px;
  min-height: 200px;
  text-align: center;
  padding-top: 40px;
}
.success-text {
  font-size: 24px;
  margin: 30px 0;
  font-weight: bold;
}
</style>
