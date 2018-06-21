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
                  :class="[item.isSelect? 'quiz-answer__checked':'quiz-answer__null']"
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
          <span style="font-size: 45px;">9</span>
        </div>
        <div class="mask-txt" style="font-size: 17px;">
          <p>已使用掉你的一张复活卡，剩余9张</p>
          <p>你可以继续进行答题</p>
        </div>
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
      lock: false,
      cTime: 10000,
      comment: {
        event: 'comment', // 事件类型，填comment
        uniqueId: 'xxx1234', // 用户唯一id
        content: '' // 用户评论内容，140字以内
      },
      publishComment: false,
      localComment: [],
      commentList: [],
      ismask: false
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
    }
  },
  methods: {
    initWebSocket () { // 初始化weosocket
      // ws地址
      const wsCommenturi = 'ws://139.159.212.187:6660/ws'
      this.Cwebsock = new WebSocket(wsCommenturi)
      this.Cwebsock.onmessage = this.websocketonMessage
      this.Cwebsock.onclose = this.websocketclose
      this.Cwebsock.onopen = this.websocketonOpen
    },
    websocketonOpen (e) {
      this.websocketsend(JSON.stringify({
        event: 'login',
        uniqueId: 'xxx1234'
      }))
    },
    websocketonMessage (e) { // 数据接收
      const redata = JSON.parse(e.data)
      this.handleRes(redata.event, redata.data)
    },
    websocketsend (agentData) { // 数据发送
      if (this.Cwebsock.readyState === this.Cwebsock.OPEN) {
        this.Cwebsock.send(agentData)
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
      }
    },
    getQuestion () {
      GameApi.fetchQuestion({uniqueId: this.GLOBAL.uniqueId}).then((data) => {
        if (data.data.data) {
          this.question = data.data.data.question
          this.convertAnswer(data.data.data.answers)
        }
      })
    },
    convertAnswer (arr) {
      if (arr.length !== 0) {
        for (let i = 0; i < arr.length; i++) {
          this.options.push({isSelect: false, value: arr[i], correct: false})
        }
      }
    },
    chooseOption (index) {
      if (!this.lock) {
        this.options[index].isSelect = true
        this.lock = true
        GameApi.checkAnswer({uniqueId: this.GLOBAL.uniqueId, answer: index}).then((data) => {
          if (data.data.data.result) {
            this.options[index].correct = true
          } else {
            this.options[data.data.data.correctAnswer].correct = true
          }
        })
      } else {
        return false
      }
    },
    sendComment () {
      this.websocketsend(JSON.stringify(this.comment))
      this.ismask = false
      this.publishComment = false
    },
    startNewTimer (time) {
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
  created () {
    this.initWebSocket()
    this.getQuestion()
    this.startNewTimer()
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
  &-answer__checked {
    background: #EF6A94;
    border: 1px solid #B01545;
  }
  &-answer__null {
    border: 1px solid #ddd;
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
      margin-top: .2rem;
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
}
</style>
