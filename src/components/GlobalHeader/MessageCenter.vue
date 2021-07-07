<template>
  <a-popover
    v-model="visible"
    :arrowPointAtCenter="true"
    trigger="click"
    placement="bottomRight"
    overlayClassName="message-popover"
  >
    <template v-slot:content>
      <div class="message-container">
        <div class="message-list">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="通知">
              <a-row v-for="i in 3" :key="i" class="message-item" type="flex">
                <a-col
                  v-if="false"
                  flex="32px"
                  style="margin-right: 10px;"
                ></a-col>
                <a-col flex="1">
                  <div class="message-item-title">订单审核完成</div>
                  <div class="message-item-content">订单审核完成</div>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="2" tab="消息">
              <a-row v-for="i in 7" :key="i" class="message-item" type="flex">
                <a-col flex="32px" style="margin-right: 10px;"></a-col>
                <a-col flex="1">
                  <div class="message-item-title">订单审核完成</div>
                  <div class="message-item-content">订单审核完成</div>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="3" tab="待办"> </a-tab-pane>
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
    <a-icon type="bell" style="font-size: 22px;" />
  </a-popover>
</template>

<script>
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
      visible: false
    }
  },
  mounted () {},
  methods: {
    clear () {},
    viewMore () {
      this.visible = false
      const status = this.$route.name !== 'MessageCenterIndex'
      status && this.$router.push({
        name: 'MessageCenterIndex'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.message-container {
  width: 360px;
  /deep/ .ant-tabs-tab {
    margin: 0 30px;
  }
  .message-list {
    min-height: 144px;
    max-height: 360px;
  }
  .message-btn-box {
    height: 46px;
  }
  .message-item {
    padding: 10px 24px;
    min-height: 72px;
    border-bottom: 1px solid #e8e8e8;
    .message-item-title {
      font-size: 14px;
      color: #000000a5;
    }
    .message-item-content {
      font-size: 12px;
      color: #00000072;
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
