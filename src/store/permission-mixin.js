import { mapState } from 'vuex'

const mixin = {
  computed: {
    ...mapState({
      permissions: state => state.user.permissions
    })
  }
}

export default mixin
