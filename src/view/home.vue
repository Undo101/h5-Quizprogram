<template>
  <div class="live-page">
    <div class="hd">
      <div class="hd-banner">
          <img src="../assets/img/banner.png" alt="" >
          <button class="rule-btn" @click="toRule">活动规则</button>
      </div>
    </div>
    <div class="bd">
      <div class="bd-tit">准时进场，进行答题</div>
      <div class="bd-card">
        <div class="card-top">
          <div class="card-item">
            <div v-if="mainDetail.status === 1">
              <p>奖金</p>
              <span>{{mainDetail.bonus}}</span>
            </div>
          </div>
          <div class="card-item">
            <div v-if="mainDetail.status === 1">
              <p>{{mainDetail.timeTag}}</p>
              <span>{{beginTime}}</span>
            </div>
          </div>
        </div>
        <div class="card-btn">
          <button id="btn" :disabled="mainDetail.status !== 1" v-if="mainDetail.status === 1">进入答题</button>
          <button @click="toHint" v-else>敬请期待</button>
          <p>分享得"复活卡"</p>
        </div>
        <p class="card-text">点击右上角...邀请好友填写邀请码，获得复活卡</p>
      </div>
      <div class="bd-btn">
        <div class="bd-btn__item">
          <button class="bd-btn__reuse" @click="isOpenRule = true, ismask = true">复活卡 <span> x{{mainDetail.resurrectionCard}}</span></button>
        </div>
        <div class="bd-btn__item">
          <button class="bd-btn__invite">积分兑换</button>
        </div>
      </div>
      <div class="bd-btn">
        <button class="bd-btn__more" @click="fillCode">填写邀请码</button>
      </div>
    </div>
    <div class="mask" v-if="ismask" @touchmove.prevent>
      <div class="mask-wrap mask-wrap__input" v-if="inputCode">
        <input class="mask-input" type="text" placeholder="请输入邀请码" v-model="invitationCode" @click="scrollTop($event)">
        <button class="mask-interkey" @click="sendCode"></button>
      </div>
      <div class="mask-wrap__rule" v-if="isOpenRule" >
        <div class="mask-tit">复活卡规则</div>
        <button class="mask-close" @click="isOpenRule = false, ismask = false"></button>
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
            <p>复活卡在你答题错误后自动使用（不包括最后一题，你可以继续进行答题）</p>
          </div>
          <div class="mask-line">
            <span class="mask-point point4"></span>
            <p>每一局答题游戏最多使用一张复活卡</p>
          </div>
          <div class="mask-code"><span>{{mainDetail.invitationCode}}</span></div>
          <p class="mask-intro">点击右上角...邀请好友填写邀请码,获得复活卡</p>
        </div>
      </div>
    </div>
    <div class="mask-bg" @touchmove.prevent v-if="ismask" @click="ismask = false"></div>
  </div>
</template>

<script>
import GameApi from '@/Api/index.js'
import mixin from '@/utils/mixin.js'
import shareConf from '@/utils/share.js'
import initGeetest from '../../static/tools/gt'
import { Toast } from 'mint-ui'

export default {
  mixins: [mixin],
  data () {
    return {
      uniqueId: this.GLOBAL.uniqueId,
      inputCode: false,
      isOpenRule: false,
      ismask: false,
      beginTime: '',
      invitationCode: '',
      mainDetail: {}
    }
  },
  components: {
    Toast
  },
  mounted () {
    this.joinGame()
  },
  methods: {
    toRule () {
      this.$router.push('/rule')
    },
    getMore () {
      this.isOpenRule = true
      this.ismask = true
    },
    fillCode () {
      this.inputCode = true
      this.ismask = true
      this.invitationCode = ''
    },
    toHint () {
      // todo
    },
    async sendCode () {
      if (this.invitationCode) {
        let inviteData = {
          uniqueId: this.uniqueId,
          invitationCode: this.invitationCode
        }
        const {data} = await GameApi.sendInviteCode(inviteData)
        Toast(data.msg)
        if (data) {
          this.getMainInfo()
        }
        this.inputCode = false
        this.ismask = false
      } else {
        Toast('请填写邀请码~')
      }
    },
    joinGame () {
      let that = this
      // 加随机数防止缓存
      // this.$axios.get(`${location.origin}/server.php/admin/captcha/getSDK/?=` + (new Date()).getTime())
      GameApi.getLoginSDK({uniqueId: this.GLOBAL.uniqueId}).then(res => {
        var data = res.data
        /* eslint no-undef: 0 */
        initGeetest({
          // 以下 4 个配置参数为必须，不能缺少
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success, // 表示用户后台检测极验服务器是否宕机
          new_captcha: data.new_captcha, // 用于宕机时表示是新验证码的宕机

          product: 'bind', // 产品形式，包括：float，popup, custom
          width: '274px',
          next_width: '260px',
          bg_color: 'black'
        }, handler)
      })
      var handler = function (captchaObj) {
        captchaObj.onReady(function () {
        })
        document.getElementById('btn').addEventListener('touchend', function () {
          captchaObj.verify()
        })
        captchaObj.onSuccess(function () {
          var result = captchaObj.getValidate()
          console.log(result)
          GameApi.sureGeetest({
            geetest_challenge: result.geetest_challenge,
            geetest_validate: result.geetest_validate,
            geetest_seccode: result.geetest_seccode
          }).then(() => {
            GameApi.entranceDetail({uniqueId: that.GLOBAL.uniqueId}).then((data) => {
              console.log(data.data)
              if (data.data.data.status === 1) {
                that.$router.push({path: '/waiting'})
              } else {
                that.$router.push({path: '/quiz', query: {mycard: that.mainDetail.resurrectionCard}})
              }
            })
          })
        })
      }
    },
    getMainInfo () {
      GameApi.getMainInfo({uniqueId: 'xxx1234'}).then((data) => {
        this.mainDetail = data.data.data
        if (this.mainDetail.startedAt) {
          this.beginTime = this.FormatTime(this.mainDetail.startedAt)
        }
        console.log(new Date(this.mainDetail.startedAt))
      })
    }
  },
  async created () {
    this.getMainInfo()
    shareConf.setShare('all',
      `xxx邀请你参与安信证券冲顶赛，Ta的邀请码是：${this.mainDetail.invitationCode}`,
      location.href,
      '',
      '只要你闯关成功，就不怕没有丰厚的奖励，在安信证券冲顶赛等你'
    )
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
        height: 4.8rem;
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
          left: 4.5rem;
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
        height: 1.9rem;
        width: 7.1rem;
        line-height: 1rem;
      }
      &__reuse {
        background: url(../assets/img/button2.png) no-repeat;
        background-size: 100%;
        position: relative;
        color: #721E16;
        padding-left: 1.4rem;
        span {
          margin-left: .3rem;
        }
      }
      &__reuse::before {
        content: '';
        background: url(../assets/img/heart.png) no-repeat;
        background-size: 100%;
        position: absolute;
        height: 1rem;
        width: 1rem;
        left: .7rem;
      }
      &__more {
        background: url(../assets/img/button3.png) no-repeat;
        background-size: 100%;
        color: #fff;
        margin: 0 auto;
        margin-top: .75rem;
        line-height: 1rem;
      }
      &__invite {
        background: url(../assets/img/button2.png) no-repeat;
        background-size: 100%;
        color: #fff;
      }
    }
  }
  .mask {
    &-bg {
      background: rgba(0, 0, 0, 0.73);
      position: fixed;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 8;
    }
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
      z-index: 10;
    }
    &-wrap__input {
      top: auto;
      bottom: 0;
    }
    &-input {
      width: 80%;
      outline: none;
    }
    &-interkey {
      background: url(../assets/img/interkey.png) no-repeat;
      background-size: 100%;
      height: 1.8rem;
      width: 1.8rem;
      margin-left: 1rem;
    }
    &-wrap__rule {
      background: #fff;
      position: absolute;
      bottom: 0rem;
      right: 0;
      left: 0;
      width: 100%;
      padding: 1rem;
      margin: 0 auto;
      z-index: 11;
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
