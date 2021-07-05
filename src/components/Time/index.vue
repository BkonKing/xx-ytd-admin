<template>
  <div>
    <span v-if="!str">{{
      day
        ? dayString + "天" + `${hourString}:${minuteString}`
        : `${hourString}:${minuteString}`
    }}</span>
    <!--计时器-->
    <span v-else>{{ str }}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      /* 计时器 */
      d: 0, // 定义天，时，分，秒，毫秒并初始化为0；
      h: 0,
      m: 0,
      s: 0,
      ms: 0,
      time: 0, // 定时器
      str: '',
      times: '', // 统计共多少秒时间

      day: '',
      hour: '',
      minute: '',
      second: '',
      promiseTimer: '',
      lastTime: 0,
      deviation: 0
    }
  },
  props: {
    remainTime: {
      // 倒计时间总秒数
      default: '2'
    }
  },
  mounted () {
    if (this.remainTime > 0) {
      this.day = Math.floor(this.remainTime / 86400)
      this.hour = Math.floor((this.remainTime / 3600) % 24)
      this.minute = Math.floor((this.remainTime / 60) % 60)
      this.second = Math.floor(this.remainTime % 60)
      this.countDowm()
    } else {
      const time = Math.abs(this.remainTime)
      this.ms = time * 1000
      this.d = Math.floor(time / 86400)
      this.h = Math.floor((time / 3600) % 24)
      this.m = Math.floor((time / 60) % 60)
      this.s = Math.floor(time % 60)
      this.startTimer()
    }
  },
  methods: {
    // 计时器开始
    startTimer () {
      this.time = setInterval(this.timer, 1000)
    },
    timer () {
      const start = new Date().getTime()
      this.deviation && (this.deviation = start - this.lastTime - 1000)
      this.lastTime = start
      // 定义计时函数
      this.ms = this.ms + 1000 - this.deviation // 毫秒
      if (this.ms >= 1000) {
        this.ms = 0
        this.s = this.s + 1 // 秒
      }
      if (this.s >= 60) {
        this.s = 0
        this.m = this.m + 1 // 分钟
      }
      if (this.m >= 60) {
        this.m = 0
        this.h = this.h + 1 // 小时
      }
      if (this.h >= 24) {
        this.h = 0
        this.d = this.d + 1 // 天
      }
      this.str = this.d
        ? this.d + '天' + `${this.toDub(this.h)}:${this.toDub(this.m)}:${this.toDub(this.s)}`
        : `${this.toDub(this.h)}:${this.toDub(this.m)}:${this.toDub(this.s)}`
      // 统计共看了多少秒
      this.times = this.s + this.m * 60 + this.h * 3600 + this.d * 86400
    },
    toDub (n) {
      // 补0操作
      if (n < 10) {
        return '0' + n
      } else {
        return '' + n
      }
    },
    // 倒计时
    countDowm () {
      var self = this
      clearInterval(this.promiseTimer)
      this.promiseTimer = setInterval(() => {
        if (self.hour === 0) {
          if (self.minute !== 0 && self.second === 0) {
            self.second = 59
            self.minute -= 1
          } else if (self.minute === 0 && self.second === 0) {
            self.second = 0
            self.$emit('countDowmEnd', true)
            clearInterval(self.promiseTimer)
            self.startTimer()
          } else {
            self.second -= 1
          }
        } else {
          if (self.minute !== 0 && self.second === 0) {
            self.second = 59
            self.minute -= 1
          } else if (self.minute === 0 && self.second === 0) {
            self.hour -= 1
            self.minute = 59
            self.second = 59
          } else {
            self.second -= 1
          }
        }
      }, 1000)
    },
    formatNum (num) {
      return num < 10 ? '0' + num : '' + num
    }
  },
  computed: {
    dayString () {
      return this.day
    },
    hourString () {
      return this.formatNum(this.hour)
    },
    minuteString () {
      return this.formatNum(this.minute)
    },
    secondString () {
      return this.formatNum(this.second)
    }
  },
  beforeDestroy () {
    this.time && clearTimeout(this.time)
    this.promiseTimer && clearTimeout(this.promiseTimer)
  }
}
</script>
