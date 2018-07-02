// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import global_ from './components/global'
import wxSign from './utils/wx_sign'
import GameApi from '@/Api/index.js'

import Rem from './utils/rem'

Vue.config.productionTip = false
// 引入Rem
Rem(document, window)

Vue.prototype.GLOBAL = global_

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    const url = location.href
    const uniqueId = this.$route.query.uniqueId
    wxSign(url)
    if (!this.GLOBAL.UserInfo) {
      GameApi.getUserInfo({uniqueId: uniqueId}).then((data) => {
        console.log(data.data.data.invitationCode)
        this.GLOBAL.UserInfo = data.data.data
        this.GLOBAL.shareCode = data.data.data.invitationCode
        this.GLOBAL.nickname = data.data.data.nickname
        this.GLOBAL.avatar = data.data.data.image
        this.GLOBAL.uniqueId = uniqueId
        console.log(13, this.GLOBAL)
      })
    }
  }
})
