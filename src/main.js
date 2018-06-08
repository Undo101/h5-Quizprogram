// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Rem from './utils/rem'

// import VueSocketio from 'vue-socket.io'
// import socketio from 'socket.io-client'
// Vue.use(VueSocketio, socketio('http://localhost:3000'))

Vue.config.productionTip = false
// 引入Rem
Rem(document, window)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
