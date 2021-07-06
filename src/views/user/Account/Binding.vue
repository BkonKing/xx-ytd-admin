<template>
  <div>
    <a-steps :current="current">
      <a-step v-for="(item, index) in steps" :key="index" :title="item.title" @click.stop="handleClick(index)" />
    </a-steps>
    <div class="steps-content">
      <div v-if="current === 0">
        <QRCode v-if="qrcode" :qrcode="qrcode" style="width:200px;height:200px;"></QRCode>
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
import { getDdCode, getDdStatus } from '@/api/user'
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
      isComplate: false,
      qrcode: '',
      timer: null
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created () {
    this.isComplate = Boolean(this.userInfo.wxOpenid)
    if (this.isComplate) {
      this.current = 2
    } else {
      this.getDdCode()
    }
  },
  methods: {
    // 重新绑定
    reset () {
      this.current = 0
      this.isComplate = false
      this.getDdCode()
    },
    getDdCode () {
      getDdCode().then(res => {
        this.qrcode = res.qrcode
        this.getDdStatus()
      })
    },
    getDdStatus () {
      getDdStatus().then(({ bdStatus }) => {
        switch (bdStatus) {
          case 0:
            this.timer && clearTimeout(this.timer)
            this.timer = setTimeout(() => {
              this.getDdStatus()
            }, 3000)
            break
          case 1:
            if (this.current === 1) {
              this.timer && clearTimeout(this.timer)
              this.timer = setTimeout(() => {
                this.getDdStatus()
              }, 3000)
            } else {
              this.current = 1
              this.getDdStatus()
            }
            break
          case 2:
            this.current = 2
            this.$store.dispatch('GetInfo')
            break
        }
      })
    },
    handleClick (index) {
      console.log(index)
      if (!this.isComplate && index !== 2) {
        this.current = index
        if (this.current === 0) {
          this.getDdCode()
        }
      }
    }
  },
  beforeDestroy () {
    this.timer && clearTimeout(this.timer)
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
