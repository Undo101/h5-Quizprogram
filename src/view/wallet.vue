<template>
  <div class="wallet-page">
    <div class="wallet-hd">
      <ul>
        <li v-for="(item, index) in hdList" :key="index">{{item}}</li>
      </ul>
    </div>
    <div class="wallet-bd">
      <ul>
        <li>
          <span>排位红包</span>
          <span>.32元</span>
          <span style="width: 23%">2018-12-16</span>
          <span>已领取</span>
          <button>查看</button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      hdList: ['红包类型', '红包金额', '获取时间', '状态', '操作']
    }
  }
}
</script>
<style lang="scss" scoped>
.wallet {
  &-hd {
    ul {
      width: 100%;
      display: flex;
      font-size: 15px;
      background-color: #fff;
      padding: 1rem 0;
      li {
        width: 20%;
        text-align: center;
      }
      li:nth-child(4) {
        text-align: end;
        width: 17%;
      }
    }
  }
  &-bd {
    background: #fff;
    height: 100%;
    font-size: 15px;
    margin-top: .3rem;
    li {
      padding: .7rem 0;
      border-bottom: 1px solid #eee;
    }
    span {
      width: 19%;
      display: inline-block;
      text-align: center;
    }
    button {
      color: #6692EB;
      font-size: 13px;
    }
  }
}
</style>
