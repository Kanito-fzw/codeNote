import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    openLogin:false,
    openRegister:false,
    openSetting:false,
    outline:null,
    breadcrumb:[]

  },
  getters:{
    openLogin: state => state.openLogin,
    openRegister: state => state.openRegister,
    openSetting: state => state.openSetting,
    outline: state => state.outline,
    breadcrumb: state => state.breadcrumb
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
    },
    setOutline(state,outline){
      state.outline=outline
    },
    setBreadcrumb(state,breadcrumb){
      state.breadcrumb=breadcrumb
    }
  },
  actions: {
  },
  modules: {
  }
})
