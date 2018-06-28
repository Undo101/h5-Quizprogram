<template>
  <span :endTime="endTime" :callback="callback" :endText="endText">
    <slot>
      {{content}}
    </slot>
  </span>
</template>
<script>
import GameApi from '@/Api/index.js'
export default {
  data () {
    return {
      content: '',
      timestamp: ''
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
    this.countdowm(this.timestamp)
  },
  watch: {
    content (n, o) {
      let that = this
      if (n === '00:00:01') {
        console.log(n)
        GameApi.entranceDetail({uniqueId: that.GLOBAL.uniqueId}).then((data) => {
          console.log(data.data)
          if (data.data.data.status !== 1) {
            that.$router.push({path: '/quiz', query: {mycard: data.data.data.resurrectionCard}})
          }
        })
      }
    }
  },
  methods: {
    countdowm (timestamp) {
      let self = this
      let nowTime = ''
      let timer = setInterval(function () {
        nowTime = new Date().getTime()
        let t = timestamp - nowTime
        if (t > 0) {
          let day = Math.floor(t / 86400000)
          let hour = Math.floor((t / 3600000) % 24)
          let min = Math.floor((t / 60000) % 60)
          let sec = Math.floor((t / 1000) % 60)
          if (hour === 0) {
            hour = '00'
          } else if (hour < 10 && hour > 0) {
            hour = '0' + hour
          } else {
            return hour
          }
          min = min < 10 ? '0' + min : min
          sec = sec < 10 ? '0' + sec : sec
          let format = ''
          if (day > 0) {
            format = `${day}天${hour}:${min}:${sec}`
          }
          if (day <= 0 && hour >= 0) {
            format = `${hour}:${min}:${sec}`
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
  },
  created () {
    this.timestamp = this.endTime
    console.log(this.timestamp)
  }
}
</script>
