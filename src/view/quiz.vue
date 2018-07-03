<template>
  <div class="quiz-page">
    <div :class="[isMessage ? 'quiz-hd__chat':'quiz-hd']">
      <div class="quiz-tag">
        <div class="quiz-tag__item">
          <div class="quiz-tag__reuse">
            复活卡 <span>x {{myCard}}</span>
          </div>
        </div>
        <div class="quiz-time__over" v-if="cTime === 0&&!isMessage" >时间到</div>
        <div :class="[cTime/1000 < 4 ? 'quiz-time__warn':'quiz-time']"  v-if="cTime/1000 > 0 && !isMessage">{{cTime/1000}}</div>
        <div class="quiz-tag__item">
          <div class="quiz-tag__num">
            <span>人数</span> <span style="margin-left: 3px;">{{people}}</span>
          </div>
        </div>
      </div>
      <div class="quiz-contain">
        <div class="quiz-wrap" v-if="isMessage">
          <div class="quiz-box">
            <li v-for="item in messageList" :key="item">
              <p><span>主持人：</span>{{item}}</p>
            </li>
          </div>
        </div>
        <div class="quiz-wrap" v-else>
          <div class="quiz-card">
            <p class="quiz-question" v-if="question.length>0">{{currentQue}}、{{question}}</p>
            <div class="quiz-answer" v-if="options.length>0">
              <ul>
                <li v-for="(item, index) in options"
                  :key="index" @click="chooseOption(index)">
                  <div v-if="isOk" :class="[item.correct ?'quiz-answer__correct': 'quiz-answer__null', !item.correct&&item.isSelect ?'quiz-answer__error': 'quiz-answer__null']"><p>{{item.value}}</p></div>
                  <div v-else :class="[item.isSelect ? 'quiz-answer__checked':'quiz-answer__null']">
                    <p>{{item.value}}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="quiz-foot">
      <ul>
        <li v-for="(item, index) in commentList" :key="index">
          <img :src="item.image" alt="">
          <span style="color: #383497">{{item.nickname}}:</span>
          <p>{{item.content}}</p>
        </li>
      </ul>
    </div>
    <div class="quiz-btn">
      <button @click="publishComment = true"></button>
    </div>
    <div class="mask" v-if="ismask" @touchmove.prevent>
      <div class="share-mask" @click="ismask = false, isShare = false" v-if="isShare">
        <img src="../assets/img/share.png" alt="">
        <p>点击的右上角分享~</p>
        <div class="share-wrap">
          <div class="share-code"><span>{{shareCode}}</span></div>
          <span class="share-info">点击右上角...邀请好友填写邀请码，获得复活卡</span>
        </div>
      </div>
      <div class="mask-wrap mask-wrap__result" v-if="isSuccess">
        <button class="mask-close" @click="isSuccess=false, ismask=false"></button>
        <p class="mask-title" >恭喜你闯关成功</p>
        <img :src="avatar" alt="" class="avatar">
        <span>{{nickname}}</span>
        <div class="mask-txt">
          <p style="font-size: 17px">{{bonus}}积分</p>
          <p style="font-size: 13px">请进入我的积分进行兑换</p>
        </div>
        <div class="mask-btn">
          <button @click="toShare">分享</button>
        </div>
      </div>
      <div class="mask-wrap mask-wrap__reuse"  v-if="isResurgence">
        <button class="mask-close" @click="ismask = false, isResurgence = false"></button>
        <p class="mask-title" >已为你自动复活</p>
        <div class="mask-content">
          <img src="../assets/img/heart.png" alt="">
          <img src="../assets/img/add.png" alt="">
          <span style="font-size: 30px;">{{resurrectionCard}}</span>
        </div>
        <div class="mask-txt" style="font-size: 17px;">
          <p>已使用掉你的一张复活卡，剩余{{resurrectionCard}}张</p>
          <p>你可以继续进行答题</p>
        </div>
      </div>
      <div class="mask-wrap mask-wrap__failed" v-if="isFailed">
        <h6 class="mask-failed__title">答题失败</h6>
        <img src="../assets/img/break.png" alt="">
        <p>{{failedReason.reason}}</p>
        <p>{{failedReason.text}}</p>
        <button @click="isFailed = false, ismask = false">确定</button>
      </div>
      <!-- <div class="mask-wrap mask-wrap__sum" v-if="isSum">
        <button class="mask-close" @click="isSum=false, ismask=false"></button>
        <div class="mask-sum__title">
          <p>答题结束</p>
        </div>
        <div class="mask-sum__correct">
          <p>答对人数：{{correctSum}}人</p>
        </div>
        <div class="mask-sum__error">
          <p>答错人数：{{errorSum}}人</p>
        </div>
      </div> -->
    </div>
    <div class="mask-bg" v-if="ismask" @touchmove.prevent @click="ismask = false, initMask()"></div>
    <mt-popup v-model="publishComment" lockScroll="true" position="bottom" popup-transition="popup-fade">
      <div class="mask-wrap__input">
        <input class="mask-input" type="text" placeholder="请输入您想发表的评论" v-model="comment.content" @click="scrollTop($event)">
        <button class="mask-interkey" @click.stop="sendComment"></button>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import GameApi from '@/Api/index'
import shareConf from '@/utils/share.js'
import mixin from '@/utils/mixin.js'
import { Popup } from 'mint-ui'

export default {
  mixins: [mixin],
  data () {
    return {
      shareCode: '',
      isResurgence: false,
      websock: null,
      select: '',
      myCard: '',
      people: 0,
      userCount: '',
      bonus: '',
      avatar: '',
      nickname: '',
      question: '',
      options: [],
      optionsValue: [],
      noLock: true,
      isSpectator: false,
      cTime: 10000,
      isOk: false, // 是否已经验证
      isMessage: true, // 主持人解说
      comment: {
        event: 'comment', // 事件类型，填comment
        uniqueId: '', // 用户唯一id
        content: '' // 用户评论内容，140字以内
      },
      publishComment: false,
      localComment: [],
      localMessage: [],
      commentList: [],
      messageList: [],
      ismask: false,
      isOver: false,
      isShare: false,
      isFailed: false,
      isSuccess: false,
      // isSum: false,
      failedReason: {
        reason: '',
        text: ''
      },
      currentQue: '',
      correctSum: '',
      errorSum: '',
      resurrectionCard: '' // 当前复活卡数
    }
  },
  components: {
    'mt-popup': Popup
  },
  watch: {
    isMessage (n, o) {
      console.log(n)
    },
    localComment (n, o) {
      let that = this
      if (n.length < 10) {
        clearInterval(that._CTimer)
        that._CTimer = setInterval(() => {
          that.commentList = that.commentList.concat(n.slice(0, 4))
          n.splice(0, 5)
          if (n.length === 0) {
            clearInterval(that._CTimer)
          }
        }, 1000)
      }
    },
    commentList (n, o) {
      let that = this
      if (n.length > 120) {
        that.commentList.splice(0, that.commentList.length - 100)
      }
    },
    ismask (n, o) {
      if (!n) {
        this.publishComment = false
        this.isResurgence = false
      }
    },
    cTime (n, o) {
      let that = this
      if (n / 1000 < 1) {
        GameApi.getAnswer({ uniqueId: this.GLOBAL.uniqueId, answer: this.select }).then((data) => {
          that.isOk = true
          that.noLock = false
          const answer = data.data.data
          that.people = answer.userCount
          that.localMessage = []
          that.messageList = []
          that.localMessage = answer.remarks
          if (answer.result) {
            that.options[that.select].correct = true
            if (answer.currentQuestion === 10) {
              that.userCount = answer.userCount
            }
          } else {
            if (this.select !== '' && !this.isSpectator) {
              console.log(1)
              that.options[answer.correctAnswer].correct = true
              switch (answer.resurrectionStatus) {
                case 1:
                  this.resurrectionCard = answer.resurrectionCard
                  this.ismask = true
                  this.isResurgence = true
                  setTimeout(() => {
                    this.ismask = false
                    this.isResurgence = false
                  }, 2000)
                  break
                case 2:
                  this.failedReason.reason = '已使用过复活卡'
                  this.failedReason.text = '请准时参与安信证券的下一次答题活动'
                  this.isFailed = true
                  this.ismask = true
                  this.isSpectator = true
                  break
                case 3:
                  this.failedReason.reason = '没有复活卡，不能继续答题'
                  this.failedReason.text = '赶快去邀请好友一起参与答题你与好友各获得一张复活卡'
                  this.isFailed = true
                  this.ismask = true
                  this.isSpectator = true
                  break
                case 4:
                  this.failedReason.reason = '决胜题限制'
                  this.failedReason.text = '最后一题决胜题无法使用复活卡复活'
                  this.isFailed = true
                  this.ismask = true
                  this.isSpectator = true
              }
            } else if (this.select === '' && !this.isSpectator) {
              that.failedReason.reason = '未选择答案'
              that.failedReason.text = '未选择答案，存在离开情况不消耗复活卡'
              that.isFailed = true
              that.ismask = true
              that.isSpectator = true
            }
          }
          console.log(22, that.isSpectator)
          if (this.localMessage.length > 0) {
            setTimeout(() => {
              that.isMessage = true
              that.pushMessage(this.localMessage)
            }, 1800)
          } else {
            setTimeout(() => {
              that.isMessage = false
              if (this.currentQue === 10) {
                that.isMessage = true
              }
            }, 1800)
          }
        })
      }
    }
  },
  methods: {
    initMask () {
      this.publishComment = false
      this.isResurgence = false
      this.isFailed = false
      this.isShare = false
    },
    CinitWebSocket () { // 初始化weosocket
      // ws地址
      const wsCommenturi = 'ws://139.159.212.187:6660/ws'
      this.Cwebsock = new WebSocket(wsCommenturi)
      this.Cwebsock.onmessage = this.CwebsocketonMessage
      this.Cwebsock.onclose = this.Cwebsocketclose
      this.Cwebsock.onopen = this.websocketonOpen
    },
    MinitWebSocket () {
      const wsMessageuri = 'ws://139.159.212.187:6680/ws'
      this.Mwebsock = new WebSocket(wsMessageuri)
      this.Mwebsock.onmessage = this.MwebsocketonMessage
      this.Mwebsock.onclose = this.Mwebsocketclose
      this.Mwebsock.onopen = this.websocketonOpen
    },
    websocketonOpen (e, pipe) {
      const Login = JSON.stringify({
        event: 'login',
        uniqueId: this.GLOBAL.uniqueId
      })
      this.websocketsend(Login, 'comment')
      this.websocketsend(Login, 'message')
    },
    MwebsocketonMessage (e) { // 数据接收
      const redata = JSON.parse(e.data)
      console.log(redata.event)
      this.handleRes(redata.event, redata.data)
    },
    CwebsocketonMessage (e) { // 数据接收
      const redata = JSON.parse(e.data)
      console.log(redata.event)
      this.handleRes(redata.event, redata.data)
    },
    websocketsend (agentData, pipe) { // 数据发送
      if (pipe === 'comment') {
        console.log(32, agentData)
        if (this.Cwebsock.readyState === this.Cwebsock.OPEN) {
          this.Cwebsock.send(agentData)
        }
      } else if (pipe === 'message') {
        console.log(34, 'message')
        if (this.Mwebsock.readyState === this.Mwebsock.OPEN) {
          this.Mwebsock.send(agentData)
        }
      }
    },
    Cwebsocketclose (e) { // 关闭
      console.log('connection closed (' + e + ')')
      this.CinitWebSocket()
    },
    Mwebsocketclose (e) { // 关闭
      console.log('connection closed (' + e + ')')
    },
    // socket事件类型处理
    handleRes (type, data) {
      switch (type) {
        case 'comment':
          console.log(45, 'comment')
          this.localComment = this.localComment.concat(data)
          break
        case 'realTimeData':
          this.myCard = data.resurrectionCard
          break
        case 'bonusInfo':
          console.log(46, data)
          break
        case 'result':
          console.log('result')
          this.bonus = data.bonus
          this.ismask = true
          this.isSuccess = true
          break
        case 'message':
          if (data.step === 0) {
            this.isMessage = true
            this.question = ''
            this.localMessage = this.localMessage.concat(data.message)
            this.pushMessage(this.localMessage)
          } else if (data.step >= 1 && data.step <= 10) {
            this.question = ''
            this.getQuestion()
            this.isMessage = false
          } else if (data.step === 11) {
            this.isMessage = true
            this.messageList = []
            this.localMessage = this.localMessage.concat(data.message)
            if (this.localMessage.length > 0) {
              this.pushMessage(this.localMessage)
            }
          } else if (data.step === 12) {
            // this.isMessage = true
            // this.correctSum = data.message[0]
            // this.errorSum = data.message[1]
            // this.initMask()
            // this.ismask = true
            // this.isSum = true
          }
          break
      }
    },
    pushMessage (arr) {
      clearInterval(this._Mtimer)
      this._Mtimer = setInterval(() => {
        if (arr.length >= 1) {
          this.messageList.push(arr.shift())
        }
      }, 1000)
    },
    // 获取题目及选项信息
    getQuestion () {
      console.log(this.isSpectator)
      this.question = ''
      this.options = []
      this.select = ''
      GameApi.fetchQuestion({uniqueId: this.GLOBAL.uniqueId}).then((data) => {
        if (data.data.data) {
          this.noLock = !this.isSpectator
          this.isOk = false
          this.question = data.data.data.question
          this.currentQue = data.data.data.currentQuestion
          this.convertAnswer(data.data.data.answers)
          this.cTime = 0
          this.startNewTimer()
        }
      })
    },
    // 选项处理
    convertAnswer (arr) {
      if (arr.length !== 0) {
        this.options = []
        for (let i = 0; i < arr.length; i++) {
          this.options.push({isSelect: false, value: arr[i], correct: false})
        }
      }
    },
    // 选择答案
    chooseOption (index) {
      if (this.noLock && !this.isSpectator) {
        if (this.options[index].isSelect) {
          this.select = ''
          this.options[index].isSelect = false
        } else {
          for (let i = 0; i < this.options.length; i++) {
            this.options[i].isSelect = false
          }
          this.options[index].isSelect = true
          this.select = index
        }
      } else {
        return false
      }
    },
    // 发送评论
    sendComment () {
      this.websocketsend(JSON.stringify(this.comment), 'comment')
      this.ismask = false
      this.publishComment = false
      this.comment.content = ''
    },
    // 开始倒计时
    startNewTimer () {
      this.cTime = 10000
      clearInterval(this._timer)
      this._timer = setInterval(() => {
        this.cTime -= 1000
        if (this.cTime <= 0) {
          clearInterval(this._timer)
          console.log('timerover')
          this.$emit('timeover')
        }
      }, 1000)
    },
    toShare () {
      this.isSuccess = false
      this.isShare = true
      shareConf.setShare('all',
        `${this.GLOBAL.nickname}邀请你参与安信证券冲顶赛，Ta的邀请码是：${this.GLOBAL.shareCode}`,
        location.href,
        '',
        '只要你闯关成功，就不怕没有丰厚的奖励，在安信证券冲顶赛等你'
      )
    }
  },
  async created () {
    this.MinitWebSocket()
    this.CinitWebSocket()
    console.log(33, this.GLOBAL)
    this.myCard = this.$route.query.mycard
    this.avatar = this.GLOBAL.avatar
    this.nickname = this.GLOBAL.nickname
    this.shareCode = this.GLOBAL.shareCode
    this.comment.uniqueId = this.GLOBAL.uniqueId
    const { data } = await GameApi.entranceDetail({uniqueId: this.$route.query.uniqueId})
    this.people = data.data.waitingUserCount
    if (data.data.status === 3) {
      this.isSpectator = true
    }
    this.loadImage('../assets/img/BG4.png')
  }
}
</script>

<style lang="scss" scoped>
.quiz {
  &-page {
    height: 100%;
    position: relative;
  }
  &-hd {
    width: 100%;
    position: fixed;
    background: url(../assets/img/bg.png) no-repeat;
    background-size: 100%;
    animation: slideIn .5s;
    animation-fill-mode: forwards;
  }
  &-hd__chat {
    width: 100%;
    position: fixed;
    background: none;
    background: #fff;
  }
  &-tag {
    display: flex;
    height: 2.4rem;
    justify-content: space-between;
    &__item {
      display: flex;
      width: 38%;
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
  &-time {
    height: 2.2rem;
    width: 2.2rem;
    border-radius: 1.1rem;
    background: #fff;
    line-height: 2.2rem;
    text-align: center;
    margin-top: .3rem;
  }
  &-time__warn {
    height: 2.2rem;
    width: 2.2rem;
    border-radius: 1.1rem;
    line-height: 2.2rem;
    text-align: center;
    margin-top: .3rem;
    background: #F21462;
    box-shadow: 0 0 3px #670024;
    color: #fff;
    animation: countDown 3s;
    font-size: 20px;
    animation-fill-mode: forwards;
  }
  &-time__over {
    height: 2.2rem;
    width: 4.2rem;
    border-radius: 1.1rem;
    line-height: 2.2rem;
    text-align: center;
    margin-top: .3rem;
    background: #EF6B94;
    color: #fff;
  }
  &-contain {
    height: 16rem;
    overflow: hidden;
    padding: .6rem 0rem;
    border-bottom: 1px solid #ccc;
    p {
      margin-bottom: 1rem;
      font-size: 17px;
    }
    span{
      color: #EF6B94;
    }
  }
  &-wrap {
    width: 17.75rem;
    margin: 0 auto;
  }
  &-box {
    overflow-y: scroll;
    height: 15rem;
  }
  &-card{
    border: 2px solid #EC9301;
    border-radius: .2rem;
    height: 14.45rem;
    padding: 1.25rem .8rem;
    overflow-y: scroll;
    background: #fff;
    ul {
      position: absolute;
      animation: moveup .7s;
      animation-fill-mode: forwards;
    }
    li {
      width: 16.2rem;
      border-radius: .2rem;
      margin-bottom: .5rem;
      div {
        padding: .625rem;
      }
      p {
        margin: 0;
      }
    }
  }
  &-question {
    animation: scaleIn .7s ease-out 0s;
  }
  &-answer {
    position: relative;
    p {
      padding-left: 1.2rem;
    }
  }
  &-answer__null {
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: .2rem;

  }
  &-answer__checked {
    background-color: #EF6A94;
    border: 1px solid #B01545;
    color: #fff;
    border-radius: .2rem;
  }
  &-answer__correct {
    background-color: #FCC50B;
    border: 1px solid #A46218;
    background-image: url(../assets/img/correct.png);
    background-size: 7%;
    background-position: 3% 45%;
    background-repeat: no-repeat;
    color: #fff;
    border-radius: .2rem;
  }
  &-answer__error {
    background-color: #EF6A94;
    border: 1px solid #B01545;
    border-radius: .2rem;
    background-image: url(../assets/img/error.png);
    background-size: 7%;
    background-position: 3% 45%;
    background-repeat: no-repeat;
    color: #fff;
  }
  &-foot {
    padding-top: 18.4rem;
    background: #fff;
    li {
      font-size: 0;
      padding: .4rem .5rem;
    }
    span {
      font-size: 15px;
      vertical-align: middle;
      margin-left: 0rem;
    }
    p {
      font-size: 15px;
      display: inline-block;
      vertical-align: top;
      width: 68%;
      margin-left: .2rem;
      word-wrap: break-word;
      margin-top: .2rem;
    }
    img {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 1rem;
      vertical-align: middle;
      margin-right: .5rem;
      display: inline-block;
      background: #ddd;
    }
  }
  &-btn {
    height: 2.1rem;
    width: 2.1rem;
    border-radius: 1rem;
    background: #fff;
    background: url(../assets/img/quiz-btn.png) no-repeat;
    background-size: 100%;
    position: fixed;
    bottom: 4rem;
    left: 15.5rem;
    button {
      height: 100%;
      width: 100%;
      background: transparent;
    }
  }
}
.mask {
  &-bg {
    background: rgba(0, 0, 0, .73);
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 8;
  }
  &-wrap {
    border-radius: 1rem;
    position: absolute;
    top: 5rem;
    right: 0;
    left: 0;
    margin: 0 auto;
    text-align: center;
    z-index: 10;
    &__result {
      color: #fff;
      width: 15rem;
      height: 18.1rem;
      background: url(../assets/img/BG3.png) no-repeat;
      background-size: 100%;
      img {
        height: 3.35rem;
        width: 3.35rem;
        border-radius: 2rem;
        background: #ccc;
        display: block;
        margin: 0 auto;
      }
    }
    &__reuse {
      color: #fff;
      width: 15.5rem;
      height: 15.1rem;
      background: url(../assets/img/BG4.png) no-repeat;
      background-size: 100%;
      img:first-child {
        height: 2.25rem;
        width: 2.5rem;
      }
      img:nth-child(2) {
        height: 1.2rem;
        width: 1.2rem;
        margin-left: 1rem;
        margin-right: 1rem;
      }
    }
    &__failed {
      background: #fff;
      width: 85%;
      padding: 1rem;
      img {
        width: 3rem;
        margin-top: 1rem;
      }
      p:first-of-type {
        color: #413ca7;
        font-size: 15px;
      }
      p:nth-of-type(2) {
        font-size: 19px;
        color: #333;
        margin-top: 1.225rem;
        padding: 0 1.5rem;
      }
      button {
        background: url(../assets/img/button4.png) no-repeat;
        background-size: 100%;
        width: 10rem;
        height: 1.85rem;
        color: #fff;
        font-size: 17px;
        margin-top: 1rem;
      }
    }
    &__sum {
      background: #fff;
      width: 85%;
      height: 14rem;
      padding: 1rem;
    }
    span {
      font-size: 16px;
    }
  }
  &-content {
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 1.5rem;
  }
  &-close {
    background: url(../assets/img/mask-close.png) no-repeat;
    background-size: 100%;
    position: absolute;
    width: 1.3rem;
    height: 1.3rem;
    right: -.3rem;
    top: -.3rem;
  }
  &-title {
    font-size: 1.5rem;
    color: #fff;
    margin-bottom: 1rem;
    padding-top: 1rem;
  }
  &-txt {
    margin-top: 1.5rem;
    p {
      margin-bottom: .8rem;
    }
  }
  &-btn {
    margin-top: 1.3rem;
    button {
      background: url(../assets/img/button1.png) no-repeat;
      background-size: 100%;
      width: 7.1rem;
      height: 1.8rem;
      line-height: 1.6rem;
      color: #721E16;
      font-size: 13px;
    }
  }
  &-wrap__input {
    top: auto;
    bottom: 0;
    border-radius: 0;
    background: #fff;
    display: flex;
    padding: .2rem;
    width: 18.75rem;
  }
  &-input {
    width: 83%;
    padding-left: .5rem;
    outline: none;
  }
  &-interkey {
    background: url(../assets/img/interkey.png) no-repeat;
    background-size: 100%;
    height: 1.8rem;
    width: 1.8rem;
    margin-left: 1rem;
    transform: rotateZ(-90deg);
  }
  &-failed__title {
    font-size: 19px;
    color: #333;
  }
  &-sum__title {
    padding: 1rem;
    p {
      color: #333;
      font-size: 30px;
      font-weight: 550px;
    }
  }
  &-sum__correct {
    background-color: #FCC50B;
    color: #fff;
    width: 9.5rem;
    height: 2.5rem;
    margin: 0 auto;
    margin-bottom: 1rem;
    line-height: 2.5rem;
  }
  &-sum__error {
    background-color: #EF6A94;
    color: #fff;
    width: 9.5rem;
    height: 2.5rem;
    margin: 0 auto;
    line-height: 2.5rem;
  }
}
.share {
  &-code {
    text-align: center;
    margin-bottom: 1rem;
    margin-top: .8rem;
    span {
      font-size: 37px;
      color: #fff;
      background: #FCC50B;
      padding: .3rem 1.3rem
    }
  }
  &-mask {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    color: #fff;
    z-index: 15;
    img {
      display: block;
      margin-left: 6rem;
      margin-top: .3rem;
    }
    p {
      display: block;
      margin: 0 auto;
      text-align: center;
    }
  }
  &-wrap {
    right: 0;
    background: #fff;
    border-radius: 0.5rem;
    width: 96%;
    margin: 0 auto;
    position: fixed;
    left: 0;
    bottom: 0;
    margin-bottom: .3rem;
    height: 6.4rem;
  }
  &-info {
    color: #666;
    font-size: 15px;
    display: block;
    text-align: center;
  }
}
@keyframes moveup {
  from,
  25% {
    opacity: .5;
    top: 14.5rem;
  }
  50% {
    top: 5.5rem;
    opacity: .8;
  }
  to {
    top: 0.5rem;
    opacity: 1;
  }
}
@keyframes scaleIn {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}
@keyframes countDown {
  0% {
    transform: scale(1);
    font-size: 17px;
  }
  20% {
    transform: scale(1.2);
    font-size: 24px;
  }
  40% {
    transform: scale(1);
    font-size: 17px;
  }
  60% {
    transform: scale(1.2);
    font-size: 24px;
  }
  80% {
    transform: scale(1);
    font-size: 17px;
  }
  100% {
    transform: scale(1.2);
    font-size: 24px;
  }
}
@keyframes slideIn {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
