<template>
  <div class="waiting-page">
    <div class="waiting-hd">
      <div class="waiting-tag">
        <div class="waiting-tag__item">
          <div class="waiting-tag__reuse">
            复活卡 <span>x 10</span>
          </div>
        </div>
        <div class="waiting-tag__item">
          <div class="waiting-tag__num">
            人数 <span>151</span>
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
      <div class="waiting-time">
        <count-down endTime="1528905600000" :callback="callback" endText="已经结束了"></count-down>
      </div>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from 'mint-ui'
import mixin from '@/utils/mixin.js'
import GameApi from '@/Api/index'
import countDown from '@/components/count-down'
export default {
  mixins: [mixin],
  data () {
    return {
      stamp: '',
      time: ''
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
  async created () {
    const { data } = await GameApi.entranceDetail({uniqueId: this.GLOBAL.uniqueId})
    this.stamp = data.remainingTime
    console.log(new Date(data.remainingTime))
    // let oTime = Date.parse(new Date())
    // this.time = this.FormatTime(this.stamp - oTime)
    // let ts = this.time.split(':', 3)
    // let tnums = [parseInt(ts[0]), parseInt(ts[1]), parseInt(ts[2])]
    // let that = this
    // setInterval(function () {
    //   tnums = that.getNextTimeNumber(tnums[0], tnums[1], tnums[2])
    //   that.showNewTime(tnums[0], tnums[1], tnums[2])
    // }, 1000)
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
