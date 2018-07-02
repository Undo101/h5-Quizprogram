<template>
  <div class="rule-page">
    <h5>活动规则</h5>
    <div class="rule-md">
      <h6 class="rule-tit">答题规则：</h6>
      <p>1）用户进入游戏可参与答题，用户需要在每场活动第一道题结束时间之前进场，迟到的用户将只能围观答题活动。</p>
      <p>2）每场共10题，每题2~4个答案选项，在10秒内选出你认为正确的选项，一经选择不可更改选项</p>
      <p>3）超时或回答错误将淘汰，若你持有复活卡，复活卡会在你该场活动答题错误时自动使用，你将可以继续参与答题，每场活动只允许使用一次复活卡 </p>
      <p>4）答对10题，瓜分本期活动奖金，奖金由所有答对者平分</p>
    </div>
    <div class="rule-md">
      <h6 class="rule-tit">复活卡问题：</h6>
      <span>1）复活卡是什么</span>
      <p>复活卡是答题活动中的复活机制，能让用户给在每场次活动中答题错误时获得继续参与答题的机会。复活卡每场活动仅限使用1张。</p>
      <span>2）如何获得复活卡</span>
      <p>每成功邀请一位新用户填写邀请者的邀请码参与本活动或者绑定资金账号，均将获得一张复活。</p>
      <span>3）为什么邀请了新用户，却没有获得复活卡</span>
      <p>首先，检查邀请码是否填写正确。其次，只有邀请从未参与过答题活动的用户，当被邀请者成功填写邀请者的邀请码时，邀请者才能获得复活卡。</p>
    </div>
  </div>
</template>
<script>
import shareConf from '@/utils/share.js'
export default {
  created () {
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
.rule-page {
  background: #fff;
  height: 100%;
  padding: 0.8rem .5rem 1rem;
  h5 {
    font-size: 19px;
  }
  h6 {
    font-size: 17px;
    font-weight: 500;
    margin-bottom: .4rem;
  }
  p {
    font-size: 15px;
    color: #333;
    margin-bottom: .8rem;
  }
}
.rule {
  &-md {
    margin-top: .3rem;
    span {
      font-size: 15px;
      padding-bottom: .2rem;
      display: inline-block;
    }
  }
}
</style>
