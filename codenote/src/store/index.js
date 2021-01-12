import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    openLogin:false,
    openRegister:false,
    openSetting:false

  },
  getters:{
    openLogin: state => state.openLogin,
    openRegister: state => state.openRegister,
    openSetting: state => state.openSetting
  },
  mutations: {
    showOpenLogin(state,showFlag){
      state.openLogin=showFlag
    },
    showOpenRegister(state,showFlag){
      state.openRegister=showFlag
    },
    showOpenSetting(state,showFlag){
      state.openSetting=showFlag
    }
  },
  actions: {
  },
  modules: {
  }
})
