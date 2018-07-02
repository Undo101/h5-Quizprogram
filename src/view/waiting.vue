<template>
  <div class="waiting-page">
    <div class="waiting-hd">
      <div class="waiting-tag">
        <div class="waiting-tag__item">
          <div class="waiting-tag__reuse">
            复活卡 <span>x {{mycard}}</span>
          </div>
        </div>
        <div class="waiting-tag__item">
          <div class="waiting-tag__num">
            人数 <span>{{people}}</span>
          </div>
        </div>
      </div>
      <div class="waiting-swipe">
        <mt-swipe :show-indicators="false">
          <mt-swipe-item>
            <img src="../assets/img/1.png" alt="">
          </mt-swipe-item>
          <mt-swipe-item>
            <img src="../assets/img/2.png" alt="">
          </mt-swipe-item>
          <mt-swipe-item>
            <img src="../assets/img/3.png" alt="">
          </mt-swipe-item>
          <mt-swipe-item>
            <img src="../assets/img/4.png" alt="">
          </mt-swipe-item>
        </mt-swipe>
      </div>
    </div>
    <div class="waiting-wrap">
      <p>活动开启剩余</p>
      <div class="waiting-time" v-if="stamp">
        <count-down :endTime="stamp" :callback="callback" endText="已经结束了"></count-down>
      </div>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from 'mint-ui'
import mixin from '@/utils/mixin.js'
import GameApi from '@/Api/index'
import shareConf from '@/utils/share.js'
import countDown from '@/components/count-down'
export default {
  mixins: [mixin],
  data () {
    return {
      stamp: '',
      time: '',
      people: '',
      mycard: ''
    }
  },
  computed: {
  },
  components: {
    'mt-swipe': Swipe,
    'mt-swipe-item': SwipeItem,
    'count-down': countDown
  },
  methods: {
    callback () {
    }
  },
  created () {
    GameApi.entranceDetail({uniqueId: this.GLOBAL.uniqueId}).then((data) => {
      this.mycard = data.data.data.resurrectionCard
      let people = data.data.data.userCount
      this.people = people + 600 - 100 * Math.floor(people / 500)
      if (data.data.data.status === 1) {
        this.stamp = data.data.data.startedAt - 4000
      }
    })
    shareConf.setShare('all',
      `知识大作战，答题赢积分`,
      location.href,
      '',
      '安信证券冲顶赛等你来瓜分积分'
    )
  }
}
</script>
<style lang="scss" scoped>
.waiting {
  &-hd {
  }
  &-tag {
    display: flex;
    &__item {
      display: flex;
      width: 50%;
      padding-top: .5rem;
    }
    &__reuse {
      background: url(../assets/img/button2.png) no-repeat;
      background-size: 100%;
      width: 7.1rem;
      height: 1.9rem;
      color: #721E16;
      font-size: 13px;
      text-align: center;
      line-height: 1.9rem;
      position: relative;
      margin: 0 auto;
      padding-left: .8rem;
    }
    &__reuse::before {
      content: '';
      background: url(../assets/img/heart.png) no-repeat;
      background-size: 100%;
      height: .9rem;
      width: .9rem;
      position: absolute;
      display: block;
      left: .9rem;
      top: .5rem;
    }
    &__num {
      background: url(../assets/img/button3.png) no-repeat;
      background-size: 100%;
      width: 7.1rem;
      height: 1.9rem;
      font-size: 13px;
      color: #fff;
      text-align: center;
      line-height: 1.9rem;
      position: relative;
      margin: 0 auto;
      padding-left: .8rem;
      span {
        margin-left: .5rem;
      }
    }
    &__num::before {
      content: '';
      background: url(../assets/img/people.png) no-repeat;
      background-size: 100%;
      height: .8rem;
      width: .8rem;
      position: absolute;
      display: block;
      left: 1.4rem;
      top: .5rem;
    }
  }
  &-wrap {
    p {
      text-align: center;
      color: #000;
      font-size: 25px;
      margin-top: 2.75rem;
      margin-bottom: 2.25rem;
    }
  }
  &-time {
    text-align: center;
    font-size: 48px;
    color: #000;
    font-weight: 550;
  }
  &-swipe {
    height: 8.54rem;
    width: 13.6rem;
    margin: 0 auto;
    padding-top: 1.5rem;
    img {
      width: 13.6rem;
      height: 7rem;
    }
  }
}
</style>
