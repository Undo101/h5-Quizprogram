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
      <div class="waiting-wrap">
        <p>活动开启剩余</p>
        <div class="waiting-time">01:13:12</div>
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
</template>

<script>
import { Swipe, SwipeItem } from 'mint-ui'
export default {
  data () {
    return {
    }
  },
  components: {
    'mt-swipe': Swipe,
    'mt-swipe-item': SwipeItem
  }
}
</script>
<style lang="scss" scoped>
.waiting {
  &-hd {
    height: 18.35rem;
    background: url(../assets/img/bg.png) no-repeat;
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
      color: #fff;
      font-size: 25px;
      margin-top: 4.5rem;
      margin-bottom: 2.25rem;
    }
  }
  &-time {
    text-align: center;
    font-size: 48px;
    color: #fff;
  }
  &-swipe {
    height: 9.35rem;
    width: 13.6rem;
    margin: 0 auto;
    padding-top: 1.25rem;
    img {
      width: 13.6rem;
      height: 7rem;
    }
  }
}
</style>
