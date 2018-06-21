import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/view/home'
import Rule from '@/view/rule'
import Waiting from '@/view/waiting.vue'
import Quiz from '@/view/quiz.vue'
import Wallet from '@/view/wallet.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/rule',
      name: 'rule',
      component: Rule
    },
    {
      path: '/waiting',
      name: 'waiting',
      component: Waiting
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: Quiz
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: Wallet
    }
  ]
})
