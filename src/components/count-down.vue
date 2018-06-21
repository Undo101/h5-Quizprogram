<template>
  <span :endTime="endTime" :callback="callback" :endText="endText">
    <slot>
      {{content}}
    </slot>
  </span>
</template>
<script>
export default {
  data () {
    return {
      content: ''
    }
  },
  props: {
    endTime: {
      type: String,
      default: ''
    },
    endText: {
      type: String,
      default: '已结束'
    },
    callback: {
      type: Function,
      default: Function
    }
  },
  mounted () {
    this.countdowm(this.endTime)
  },
  methods: {
    countdowm (timestamp) {
      let self = this
      let timer = setInterval(function () {
        let endTime = timestamp
        let nowTime = new Date().getTime()
        let t = endTime - nowTime
        if (t > 0) {
          let day = Math.floor(t / 86400000)
          let hour = Math.floor((t / 3600000) % 24)
          let min = Math.floor((t / 60000) % 60)
          let sec = Math.floor((t / 1000) % 60)
          hour = hour < 10 ? '0' + hour : hour
          min = min < 10 ? '0' + min : min
          sec = sec < 10 ? '0' + sec : sec
          let format = ''
          if (day > 0) {
            format = `${day}天${hour}:${min}:${sec}`
          }
          if (day <= 0 && hour > 0) {
            format = `${hour}:${min}:${sec}`
          }
          if (day <= 0 && hour <= 0) {
            format = `${min}:${sec}`
          }
          self.content = format
        } else {
          clearInterval(timer)
          self.content = self.endText
          self._callback()
        }
      }, 1000)
    },
    _callback () {
      if (this.callback && this.callback instanceof Function) {
        this.callback(...this)
      }
    }
  }
}
</script>
