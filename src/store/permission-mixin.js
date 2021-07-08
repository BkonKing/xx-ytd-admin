import { mapState, mapGetters } from 'vuex'

const mixin = {
  computed: {
    ...mapState({
      permissions: state => state.user.permissions
    }),
    ...mapGetters(['isParentCompany'])
  }
}

export default mixin
