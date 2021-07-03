<template>
  <div :class="wrpCls">
    <message-center style="margin-right: 20px;"></message-center>
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import MessageCenter from './MessageCenter.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    MessageCenter
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showMenu: true,
      showMessage: false,
      currentUser: {}
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    },
    ...mapGetters(['userInfo'])
  },
  mounted () {
    this.setCurrentUser()
  },
  methods: {
    setCurrentUser () {
      const account = (this.userInfo && this.userInfo.account) || '昵称'
      const avatar = (this.userInfo && this.userInfo.avatar) || ''
      this.currentUser = {
        name: account,
        avatar: avatar
      }
    }
  },
  watch: {
    userInfo () {
      this.setCurrentUser()
    }
  }
}
</script>
