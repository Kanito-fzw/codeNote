import Vue from 'vue'
import 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import './plugins/iview.js'
import './plugins/element.js'
import db from './utils/js/db'

Vue.prototype.$db=db


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
