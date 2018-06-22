<template>
  <div class="quiz-page">
    <div class="quiz-hd">
      <div class="quiz-tag">
        <div class="quiz-tag__item">
          <div class="quiz-tag__reuse">
            复活卡 <span>x 10</span>
          </div>
        </div>
        <div :class="[cTime/1000 < 4 ? 'quiz-time__warn':'quiz-time']">{{cTime / 1000}}</div>
        <div class="quiz-tag__item">
          <div class="quiz-tag__num">
            人数 <span>151</span>
          </div>
        </div>
      </div>
      <div class="quiz-contain">
        <div class="quiz-wrap" v-if="false">
          <p><span>主持人：</span> 投资需有道，直播答题秒，亲爱的股民朋友们，
            大家晚上好，欢迎进入(XX证券)的答题直播间。</p>
          <p><span>主持人：</span>今天我们的奖金是（奖金金额），只要你能答对
            十道题，就能瓜分（奖金金额），当然，如果你不
            是一位（XX证券）的资深股民那么我们的题目也不
            是那么容易的，毕竟，奖金不是这么好拿的。</p>
        </div>
        <div class="quiz-wrap">
          <div class="quiz-card">
            <p class="quiz-question">{{question}}</p>
            <div class="quiz-answer">
              <ul>
                <li v-for="(item, index) in options"
                  :key="index"
                  :class="[item.isSelect ? 'quiz-answer__checked':'', item.correct ?'quiz-answer__correct': '','quiz-answer__null']"
                  @click="chooseOption(index)"><p>{{item.value}}</p></li>
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
      <button @click="publishComment = true, ismask = true"></button>
    </div>
    <div class="mask" v-if="ismask">
      <div class="mask-wrap mask-wrap__input" v-if="publishComment">
        <input class="mask-input" type="text" placeholder="请输入您想发表的评论" v-model="comment.content">
        <button class="mask-interkey" @click.stop="sendComment"></button>
      </div>
      <div class="mask-wrap mask-wrap__result" v-if="false">
        <button class="mask-close"></button>
        <p class="mask-title" >恭喜你闯关成功</p>
        <img src="" alt="" class="avatar">
        <span>哈尼</span>
        <div class="mask-txt">
          <p style="font-size: 17px">512积分</p>
          <p style="font-size: 13px">请进入我的积分进行兑换</p>
        </div>
        <div class="mask-btn">
          <button>分享</button>
        </div>
      </div>
      <div class="mask-wrap mask-wrap__reuse"  v-if="isResurgence">
        <button class="mask-close"></button>
        <p class="mask-title" >已为你自动复活</p>
        <div class="mask-content">
          <img src="../assets/img/heart.png" alt="">
          <img src="../assets/img/add.png" alt="">
          <span style="font-size: 45px;">{{resurrectionCard}}</span>
        </div>
        <div class="mask-txt" style="font-size: 17px;">
          <p>已使用掉你的一张复活卡，剩余{{resurrectionCard}}张</p>
          <p>你可以继续进行答题</p>
        </div>
      </div>
      <div class="mask-wrap mask-wrap__failed" v-if="isFailed">
        <h6 class="mask-failed__title">答题失败</h6>
        <img src="../assets/img/break.png" alt="">
        <p>已使用过复活卡</p>
        <p>请准时参与安信证券的下一次答题活动</p>
        <button @click="isFailed = false, ismask = false">确定</button>
      </div>
    </div>
    <div class="mask-bg" v-if="ismask" @click="ismask = false"></div>
  </div>
</template>

<script>
import GameApi from '@/Api/index'
export default {
  data () {
    return {
      isResurgence: false,
      websock: null,
      question: '',
      options: [],
      optionsValue: [],
      noLock: true,
      isSpectator: false,
      cTime: 10000,
      comment: {
        event: 'comment', // 事件类型，填comment
        uniqueId: 'xxx1234', // 用户唯一id
        content: '' // 用户评论内容，140字以内
      },
      publishComment: false,
      localComment: [],
      commentList: [],
      ismask: false,
      isOver: false,
      isFailed: false,
      failedReason: {
        reason: '',
        text: ''
      },
      currentQue: '',
      resurrectionCard: '' // 当前复活卡数
    }
  },
  watch: {
    localComment (n, o) {
      let that = this
      if (n.length < 10) {
        const transimit = setInterval(() => {
          that.commentList = that.commentList.concat(n.slice(0, 4))
          n.splice(0, 5)
          console.log(12, n)
          if (n.length === 0) {
            clearInterval(transimit)
          }
        }, 1000)
      }
    },
    commentList (n, o) {
      let that = this
      if (n.length > 20) {
        that.commentList.splice(0, that.commentList.length - 20)
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
        GameApi.getAnswer({ uniqueId: this.GLOBAL.uniqueId }).then((data) => {
          that.options[data.data.data.correctAnswer].correct = true
          if (data.data.data.userType === 2 && !this.isSpectator) {
            this.failedReason.reason = '未选择答案'
            this.failedReason.text = '未选择答案，存在离开情况不消耗复活卡'
            this.isFailed = true
            this.ismask = true
            this.isSpectator = true
          }
          setTimeout(() => {
            that.getQuestion()
          }, 1000)
        })
      }
    }
  },
  methods: {
    initWebSocket () { // 初始化weosocket
      // ws地址
      const wsCommenturi = 'ws://139.159.212.187:6660/ws'
      const wsMessageuri = 'ws://139.159.212.187:6680/ws'
      this.Cwebsock = new WebSocket(wsCommenturi)
      this.Mwebsock = new WebSocket(wsMessageuri)
      this.Cwebsock.onmessage = this.websocketonMessage
      this.Mwebsock.onmessage = this.websocketonMessage
      this.Cwebsock.onclose = this.websocketclose
      this.Mwebsock.onclose = this.websocketclose
      this.Cwebsock.onopen = this.websocketonOpen
      this.Mwebsock.onopen = this.websocketonOpen
    },
    websocketonOpen (e, pipe) {
      const Login = JSON.stringify({
        event: 'login',
        uniqueId: 'xxx1234'
      })
      this.websocketsend(Login, 'message')
      this.websocketsend(Login, 'comment')
    },
    websocketonMessage (e) { // 数据接收
      const redata = JSON.parse(e.data)
      this.handleRes(redata.event, redata.data)
    },
    websocketsend (agentData, pipe) { // 数据发送
      if (pipe === 'comment') {
        if (this.Cwebsock.readyState === this.Cwebsock.OPEN) {
          this.Cwebsock.send(agentData)
        }
      } else if (pipe === 'message') {
        if (this.Mwebsock.readyState === this.Mwebsock.OPEN) {
          this.Mwebsock.send(agentData)
        }
      }
    },
    websocketclose (e) { // 关闭
      console.log('connection closed (' + e.code + ')')
    },
    handleRes (type, data) {
      switch (type) {
        case 'comment':
          this.localComment = this.localComment.concat(data)
          console.log(3, this.localComment)
          break
        case 'realTimeData':
          console.log(45, data)
      }
    },
    getQuestion () {
      this.question = ''
      GameApi.fetchQuestion({uniqueId: this.GLOBAL.uniqueId}).then((data) => {
        if (data.data.data) {
          this.noLock = !this.isSpectator
          this.question = data.data.data.question
          this.convertAnswer(data.data.data.answers)
          this.startNewTimer()
        }
      })
    },
    convertAnswer (arr) {
      if (arr.length !== 0) {
        this.options = []
        for (let i = 0; i < arr.length; i++) {
          this.options.push({isSelect: false, value: arr[i], correct: false})
        }
      }
    },
    chooseOption (index) {
      if (this.noLock) {
        this.options[index].isSelect = true
        this.noLock = false
        let that = this
        setTimeout(() => {
          GameApi.getAnswer({uniqueId: that.GLOBAL.uniqueId, answer: index}).then((data) => {
            const answer = data.data.data
            if (answer.result) {
              that.options[index].correct = true
            } else {
              that.options[answer.correctAnswer].correct = true
              switch (answer.resurrectionStatus) {
                case 1:
                  this.resurrectionCard = answer.resurrectionCard
                  this.isResurgence = true
                  break
                case 2:
                  this.failedReason.reason = '已使用过复活卡'
                  this.failedReason.text = '请准时参与安信证券的下一次答题活动'
                  this.isFailed = true
                  this.ismask = false
                  this.isSpectator = true
                  break
                case 3:
                  this.failedReason.reason = '没有复活卡，不能继续答题'
                  this.failedReason.text = '赶快去邀请好友一起参与答题你与好友各获得一张复活卡'
                  this.isFailed = true
                  this.ismask = false
                  this.isSpectator = true
                  break
                case 4:
                  this.failedReason.reason = '决胜题限制'
                  this.failedReason.text = '最后一题决胜题无法使用复活卡复活'
                  this.isFailed = true
                  this.ismask = false
                  this.isSpectator = true
              }
            }
          })
        }, 500)
      } else {
        return false
      }
    },
    sendComment () {
      this.websocketsend(JSON.stringify(this.comment), 'comment')
      this.ismask = false
      this.publishComment = false
      this.comment = ''
    },
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
    }
  },
  async created () {
    this.initWebSocket()
    const { data } = await GameApi.entranceDetail({uniqueId: this.GLOBAL.uniqueId})
    if (data.data.status === 1) {
      this.getQuestion()
    } else {
      this.getQuestion()
      this.isSpectator = true
    }
  }
}
</script>

<style lang="scss" scoped>
.quiz {
  &-page {
    height: 100%;
  }
  &-hd {
    width: 100%;
    position: fixed;
    background: url(../assets/img/bg.png) no-repeat;
    background-size: 100%;
  }
  &-tag {
    display: flex;
    height: 2.4rem;
    &__item {
      display: flex;
      // width: 50%;
      width: 44%;
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
  &-card{
    border: 2px solid #EC9301;
    border-radius: .2rem;
    height: 14.45rem;
    padding: 1.25rem .8rem;
    overflow-y: scroll;
    background: #fff;
    li {
      width: 16.2rem;
      padding: .8rem;
      border-radius: .2rem;
      margin-bottom: .5rem;
      p {
        margin: 0;
      }
    }
  }
  &-answer__null {
    border: 1px solid #ddd;
  }
  &-answer__checked {
    background: #EF6A94;
    border: 1px solid #B01545;
  }
  &-answer__correct {
    background: #FCC50B;
    border: 1px solid #A46218;
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
    }
    img {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 1rem;
      vertical-align: middle;
      margin-right: .5rem;
    }
  }
  &-btn {
    height: 2.1rem;
    width: 2.1rem;
    border-radius: 1rem;
    background: #fff;
    box-shadow: 3px 0 10px #000;
    background: url(../assets/img/quiz-btn.png) no-repeat;
    background-size: 107%;
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
      width: 15rem;
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
}
</style>
