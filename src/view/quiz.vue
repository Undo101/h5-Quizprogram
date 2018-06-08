<template>
  <div class="quiz-page">
    <div class="quiz-hd">
      <div class="quiz-tag">
        <div class="quiz-tag__item">
          <div class="quiz-tag__reuse">
            复活卡 <span>x 10</span>
          </div>
        </div>
        <div class="quiz-time">10</div>
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
            <p class="quiz-question">1.在香港交易所大楼门前摆放的雕塑是放在（）？</p>
            <div class="quiz-answer">
              <ul>
                <li><p>哈哈哈哈哈急急急急急急啦啦啦</p></li>
                <li><p>哈哈哈哈哈急急急急急急啦啦啦</p></li>
                <li><p>哈哈哈哈哈急急急急急急啦啦啦</p></li>      
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="quiz-foot">
      <ul>
        <li>
          <img src="../assets/img/avatar.jpg" alt="">
          <span style="color: #383497">用户A说:</span>
          <p>不要刷屏</p>
        </li>
      </ul>
    </div>
    <div class="quiz-btn">
      <button></button>
    </div>
  </div>
</template>

<script>
export default {

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
      border: 1px solid #ddd;
      margin-bottom: .5rem;
      p {
        margin: 0;
      }
    }
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
  }
}
</style>
