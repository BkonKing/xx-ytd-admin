
const login = {
  state: {
    accountInfo: JSON.parse(window.localStorage.getItem('accountInfo')) || {},
    isAutoLogin: !!window.localStorage.getItem('autoLogin'),
    isLogout: !!window.localStorage.getItem('toLogout')
  },

  mutations: {
    setAccountInfo (state, value) {
      state.accountInfo = value
    },
    setAutoLogin (state, value) {
      console.log(value)
      state.isAutoLogin = value
    },
    setLogout (state, value) {
      state.isLogout = value
    }
  },

  actions: {

  }
}

export default login
