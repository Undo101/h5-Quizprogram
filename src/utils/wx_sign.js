// import axios
import axios from './axios'
import { Toast } from 'mint-ui'

// weixin config
// 这里主要是做jssdk参数的设置,请求后端的接口，拿到相应的参数.
export default function (url) {
  // 微信参数的接口地址
  axios.get(`http://139.159.212.187:6880/wechat`, {
    params: {
      url: url,
      funcNo: '1000003',
      weixinpk: 'gh_b83a442f57d4'}
  }).then(function (response) {
    const data = response.data
    /* eslint-disable no-undef */
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: data.appId,
      timestamp: data.timestamp,
      nonceStr: data.nonceStr,
      signature: data.signature,
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'hideMenuItems'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })
    wx.error(function (res) {
      Toast('jssdk warning:' + res.errMsg)
    })
  }).catch(function (error) {
    console.warn(error, 'jssdk sign error')
  })
}
