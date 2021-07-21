<template>
  <a-popover
    v-model="visible"
    :arrowPointAtCenter="true"
    trigger="click"
    placement="bottomRight"
    overlayClassName="message-popover"
  >
    <template v-slot:content v-if="shortInfo !== ''">
      <div class="message-container">
        <div class="message-list">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1">
              <template slot="tab">
                <div>
                  通知
                  <span v-if="+shortInfo.tz.count > 0"
                    >({{ shortInfo.tz.count }})</span
                  >
                  <span v-else-if="+shortInfo.tz.count > 99">99+</span>
                </div>
              </template>
              <a-row
                v-for="(item, index) in shortInfo.tz.list"
                :key="index"
                class="message-item"
                type="flex"
                :class="{ 'is-read-message-item': item.isRead === '1' }"
              >
                <a-col flex="1" @click="openPage(item)">
                  <div class="message-item-title">{{ item.title }}</div>
                  <div class="message-item-content">{{ item.content }}</div>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="2">
              <template slot="tab">
                <div>
                  消息
                  <span v-if="+shortInfo.xx.count > 0"
                    >({{ shortInfo.xx.count }})</span
                  >
                  <span v-else-if="+shortInfo.xx.count > 99">99+</span>
                </div>
              </template>
              <a-row
                v-for="(item, index) in shortInfo.xx.list"
                :key="index"
                class="message-item"
                type="flex"
                :class="{ 'is-read-message-item': item.isRead === '1' }"
              >
                <a-col
                  v-if="false"
                  flex="32px"
                  style="margin-right: 10px;"
                  @click="openPage(item)"
                ></a-col>
                <a-col flex="1" @click="openPage(item)">
                  <div class="message-item-title">{{ item.title }}</div>
                  <div class="message-item-content">{{ item.content }}</div>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="3">
              <template slot="tab">
                <div>
                  待办
                  <span v-if="+shortInfo.db.count > 0"
                    >({{ shortInfo.db.count }})</span
                  >
                  <span v-else-if="+shortInfo.db.count > 99">99+</span>
                </div>
              </template>
              <a-row
                v-for="(item, index) in shortInfo.db.list"
                :key="index"
                class="message-item"
                type="flex"
                :class="{ 'is-read-message-item': item.isRead === '1' }"
              >
                <a-col flex="1" @click="openPage(item)">
                  <div class="message-item-title">{{ item.title }}</div>
                  <div class="message-item-content">{{ item.content }}</div>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </div>
        <a-row class="message-btn-box" type="flex">
          <a-col class="message-btn" :span="12" @click="clear">清除通知</a-col>
          <a-col class="message-btn" :span="12" @click="viewMore"
            >查看更多</a-col
          >
        </a-row>
      </div>
    </template>
    <a-badge :count="count">
      <a-icon type="bell" style="font-size: 22px;" />
    </a-badge>
  </a-popover>
</template>

<script>
import {
  toGetShortMessage,
  toClearMessage,
  toReadMessageById,
  getMessageCount
} from '@/api/user'
export default {
  name: 'AvatarDropdown',
  props: {
    menu: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      visible: false,
      shortInfo: '',
      count: 0,
      timer: null
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.getData()
      }
    }
  },
  methods: {
    // 获取弹窗消息接口
    getData () {
      toGetShortMessage().then(({ data }) => {
        // console.log('获取弹窗消息', data)
        this.shortInfo = data
      })
    },
    // 获取弹窗数量接口
    getMessageCount () {
      this.timer = clearTimeout(this.timer)
      getMessageCount().then(({ data }) => {
        this.count = data || 0
        setTimeout(() => {
          this.getMessageCount()
        }, 60000)
      })
    },
    clear () {
      toClearMessage().then(() => {
        this.getData()
        this.getMessageCount()
      })
    },
    viewMore () {
      this.visible = false
      const status = this.$route.name !== 'MessageCenterIndex'
      status &&
        this.$router.push({
          name: 'MessageCenterIndex'
        })
    },
    // 打开新窗口
    openPage (item) {
      toReadMessageById({ messageId: item.id })
      this.getMessageCount()
      this.visible = false
      const paths = {
        1: '/project/detail',
        2: '/contract/detail',
        3: '/supplier/detail',
        4: '/order/detail'
      }
      const path = `${paths[item.sourceType]}?id=${item.sourceId}`
      if (path !== this.$route.fullPath) {
        const href = this.$router.resolve({
          path
        }).href
        window.open(href, '_blank')
      }
    }
  },
  created () {
    this.getData()
    this.getMessageCount()
  },
  beforeDestroy () {
    this.timer = clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped>
.message-container {
  // width: 360px;
  /deep/ .ant-tabs-tab {
    margin-left: 15px;
    margin-right: 0;
  }
  .message-list {
    width: 338px;
  }
  .message-btn-box {
    height: 46px;
  }
  .message-item {
    padding: 10px 24px;
    min-height: 72px;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
    .message-item-title {
      font-size: 14px;
      color: #000000a5;
    }
    .message-item-content {
      font-size: 12px;
      color: #00000072;
    }
  }
  .is-read-message-item {
    .message-item-title {
      font-size: 14px;
      color: #00000072;
    }
    .message-item-content {
      font-size: 12px;
      color: #0000004d;
    }
  }
  .message-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-top: 1px solid #e8e8e8;
  }
  .message-btn + .message-btn {
    border-left: 1px solid #e8e8e8;
  }
}
</style>

<style lang="less">
.message-popover {
  .ant-popover-inner-content {
    padding: 0;
  }
  .ant-tabs-bar {
    margin-bottom: 0;
  }
  .ant-tabs-tabpane {
    height: 316px;
    overflow: auto;
  }
}
</style>
