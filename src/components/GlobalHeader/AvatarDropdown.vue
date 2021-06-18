<template>
  <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar size="small" src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" class="antd-pro-global-header-index-avatar" />
      <span>{{ currentUser.name }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <!-- <a-menu-item v-if="menu" key="center" @click="handleToCenter">
          <a-icon type="user" />
          个人中心
        </a-menu-item>
        <a-menu-item v-if="menu" key="settings" @click="handleToSettings">
          <a-icon type="setting" />
          个人设置
        </a-menu-item> -->
        <!-- <a-menu-divider v-if="menu" /> -->
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { logout } from '@/api/login'
export default {
  name: 'AvatarDropdown',
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },

  // mounted () {
  //   let beginTime = 0 // 开始时间
  //   let differTime = 0 // 时间差
  //   window.onunload = function () {
  //     differTime = new Date().getTime() - beginTime
  //     if (differTime <= 5) {
  //       console.log('这是关闭')
  //       window.localStorage.removeItem('access_token')
  //       window.localStorage.setItem('toLogout', true)
  //       // 退出登录跳到首页
  //       this.$router.push({ name: 'login' })
  //     } else {
  //       console.log('这是刷新')
  //     }
  //   }
  //   window.onbeforeunload = function () {
  //     beginTime = new Date().getTime()
  //   }
  // },
  methods: {
    // handleToCenter () {
    //   this.$router.push({ path: '/account/center' })
    // },
    // handleToSettings () {
    //   this.$router.push({ path: '/account/settings' })
    // },
    handleLogout (e) {
      Modal.confirm({
        title: '提示',
        content: '是否退出登录？',
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          logout().then(() => {
            window.localStorage.removeItem('access_token')
            window.localStorage.setItem('toLogout', true)
            this.$message.success('退出登录成功')
            this.$router.push({ name: 'login' })
          })
        },
        onCancel () {}
      })
    }
  }

}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
