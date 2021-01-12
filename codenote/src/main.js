import Vue from 'vue'
import 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import './plugins/iview.js'
import './plugins/element.js'
import db from '@/plugins/datastore' // 取决于你的datastore.js的位置

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
