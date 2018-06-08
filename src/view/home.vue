<template>
  <div class="live-page">
    <div class="hd">
      <div class="hd-banner">
          <img src="../assets/img/banner.png" alt="" >
          <button class="rule-btn">活动规则</button>
      </div>
    </div>
    <div class="bd">
      <div class="bd-tit">准时进场，进行答题</div>
      <div class="bd-card">
        <div class="card-top">
          <div class="card-item">
            <p>奖金</p>
            <span>10000</span>
          </div>
          <div class="card-item">
            <p>今晚</p>
            <span>8：00</span>
          </div>
        </div>
        <div class="card-btn">
          <button>进入答题</button>
          <p>分享得"复活卡"</p>
        </div>
        <p class="card-text">点击右上角...邀请好友填写邀请码，获得复活卡</p>
      </div>
      <div class="bd-btn">
        <div class="bd-btn__item">
          <button class="bd-btn__reuse">复活卡</button>
          <button class="bd-btn__more">获取更多</button>
        </div>
        <div class="bd-btn__item">
        <button class="bd-btn__invite">填写邀请码</button>
        </div>
      </div>
    </div>
    <div class="mask" v-if="inputCode">
      <div class="mask-wrap">
        <input class="mask-input" type="text" placeholder="请输入邀请码">
        <button class="mask-interkey"></button>
      </div>
    </div>
    <div class="mask" v-if="isOpenRule">
      <div class="mask-rule">
        <div class="mask-tit">复活卡规则</div>
        <button class="mask-close" @click="isOpenRule = false"></button>
        <div class="mask-text">
          <div class="mask-line">
            <span class="mask-point point1"></span>
            <p>新用户填写的邀请码参加活动，你和对方均可获得一张复活卡</p>
          </div>
          <div class="mask-line">
            <span class="mask-point point2"></span>
            <p>绑定会员账号，可获得一张复活卡</p>
          </div>
          <div class="mask-line">
            <span class="mask-point point3"></span>
            <p>复活卡在你答题错误后自动使用（不包括最后一题，你可以继续进行答题</p>
          </div>
          <div class="mask-line">
            <span class="mask-point point4"></span>
            <p>每一局答题游戏最多使用一张复活卡</p>
          </div>
          <div class="mask-code"><span>12233444</span></div>
          <p class="mask-intro">点击右上角...邀请好友填写邀请码,获得复活卡</p>
          <div class="mask-foot">
            <div class="mask-foot__item">
              <img src="" alt="">
              <span>朋友圈</span>
            </div>
            <div class="mask-foot__item">
              <img src="" alt="">
              <span>微信好友</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      inputCode: false,
      isOpenRule: false
    }
  }
}
</script>

<style lang="scss">
.live-page {
  height: 100%;
  background: url(../assets/img/bg.png) repeat;
  background-size: 100%;
  .hd-banner {
    background: #aaa8a8;
    height: 7.5rem;
    width: 100%;
    display: block;
    position: relative;
    overflow: hidden;
    img {
      width: 100%;
    }
    .rule-btn {
      position: absolute;
      top: 5.3rem;
      right: -.5rem;
      background: rgba(0, 0, 0,.6);
      padding: .2rem .8rem .3rem;
      border-radius: .7rem;
      color: #fff;
      font-size: 15px;
    }
  }
  .bd {
    background: url(../assets/img/bg.png) no-repeat;
    background-size: 100%;
    &-tit {
      color: #fff;
      font-size: 1.25rem;
      text-align: center;
      padding: .475rem;
    }
    &-card {
      background: #fff;
      border: 2px solid #EC9301;
      border-radius: .4rem;
      height: 12.5rem;
      width: 17.72rem;
      margin: 0 auto;
      margin-bottom: 1.25rem;
    }
    .card {
      &-top {
        display: flex;
      }
      &-item {
        width: 50%;
        text-align: center;
        padding-top: 1.5rem;
        p {
          font-size: 19px;
          margin-bottom: .2rem;
        }
        span {
          font-size: 23px;
          color: #39369D;
          font-weight: 600;
        }
      }
      &-btn {
        text-align: center;
        margin-top: 1.45rem;
        button {
          background: url(../assets/img/button1.png) no-repeat;
          background-size: 100%;
          width: 11rem;
          height: 2.6rem;
          color: #721E16;
          font-size: 19px;
          font-weight: 550;
          margin-bottom: .3rem;
        }
        p {
          font-size: 17px;
          position: relative;
          padding-left: .5rem;
        }
        p::before {
          content: '';
          position: absolute;
          height: 1rem;
          width: 1.1rem;
          background: url(../assets/img/point.png) no-repeat;
          background-size: 100%;
          left: 4.7rem;
          top: .1rem;
        }
      }
      &-text {
        color: #666;
        font-size: 12px;
        margin-top: .5rem;
        text-align: center;
      }
    }
    &-btn__item {
      width: 50%;
      text-align: center;
    }
    &-btn {
      display: flex;
      button {
        height: 1.8rem;
        width: 7.1rem;
      }
      &__reuse {
        background: url(../assets/img/button2.png) no-repeat;
        background-size: 100%;
        position: relative;
        color: #721E16;
      }
      &__reuse::before {
        content: '';
        background: url(../assets/img/heart.png) no-repeat;
        background-size: 100%;
        position: absolute;
        height: 1rem;
        width: 1rem;
        left: 1.3rem;
      }
      &__more {
        background: transparent;
        color: #fff;
      }
      &__invite {
        background: url(../assets/img/button3.png) no-repeat;
        background-size: 100%;
        color: #fff;
      }
    }
  }
  .mask {
    background: rgba(0, 0, 0, 0.73);
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    &-wrap {
      background: #fff;
      border-radius: 2rem;
      position: absolute;
      top: 20rem;
      right: 0;
      left: 0;
      width: 17.25rem;
      padding-left: 1rem;
      display: flex;
      vertical-align: middle;
      padding: .4rem;
      margin: 0 auto;
    }
    &-input {
      width: 80%;
    }
    &-interkey {
      background: url(../assets/img/interkey.png) no-repeat;
      background-size: 100%;
      height: 1.8rem;
      width: 1.8rem;
      margin-left: 1rem;
    }
    &-rule {
      background: #fff;
      position: absolute;
      bottom: 0rem;
      right: 0;
      left: 0;
      width: 100%;
      padding: 1rem;
      margin: 0 auto;
      p {
        font-size: 15px;
        margin-bottom: .3rem;
      }
    }
    &-tit {
      color: #010101;
      text-align: center;
      font-weight: 550;
      font-size: 19px;
    }
    &-close {
      background: url(../assets/img/close2.png);
      background-size: 100%;
      height: 1rem;
      width: 1rem;
      position: absolute;
      top: .5rem;
      right: .5rem;
    }
    &-line {
      position: relative;
      padding: .2rem .8rem;
    }
    &-point {
      height: .5rem;
      width: .5rem;
      border-radius: .2rem;
      position: absolute;
      left: -.3rem;
      top: 39%;
    }
    .point1 {
      background: #44399F;
    }
    .point2 {
      background: #FF9800;
    }
    .point3 {
      background: #FF4081;
    }
    .point4 {
      background: #36877D;
    }
    &-code {
      text-align: center;
      margin-bottom: 1rem;
      span {
        font-size: 37px;
        color: #fff;
        background: #FCC50B;
        padding: .3rem 1.3rem
      }
    }
    &-intro {
      font-size: 12px;
      color: #666;
      text-align: center;
      margin: 0 auto;
      width: 100%;
    }
    &-foot {
      display: flex;
    }
    &-foot__item {
      width: 50%;
      text-align: center;
      font-size: 13px;
      color: #333;
    }
  }
}

</style>
