// import { Toast } from 'mint-ui'

// 分享设置(需要在上面的jsApiList中添加相关接口名)
function setShare (type = 'all', title = '', Link, ImgUrl, desc, successCb, cancelCb) {
  var shareArray = ['onMenuShareAppMessage', 'onMenuShareTimeline']
  /* eslint-disable no-undef */
  wx.ready(function () {
    if (shareArray.indexOf(type) < 0 && type !== 'all') {
      // Toast('无当前分享类型')
    } else if (type === 'all') {
      shareArray.forEach((ele) => {
        wx[ele]({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: Link, // 分享链接
          imgUrl: ImgUrl, // 分享图标
          success () {
            // 成功回调
            successCb && successCb(ele)
          },
          cancel () {
            // 取消分享的回调
            cancelCb && cancelCb()
          }
        })
      })
    } else {
      wx[type]({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success () {
          // 成功回调
          successCb && successCb(type)
        },
        cancel () {
          // 取消分享的回调
          cancelCb && cancelCb()
        }
      })
    }
  })
}

export default {
  setShare
}
