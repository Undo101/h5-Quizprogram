export default {
  methods: {
    FormatTime (stamp) {
      let time = new Date(stamp)
      let _hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
      let _minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
      let _seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
      return _hours + ':' + _minutes + ':' + _seconds
    },
    showNewTime (h, m, s, time) {
      let timeStr = ('0' + h.toString()).substr(-2) + ':' + ('0' + m.toString()).substr(-2) + ':' + ('0' + h.toString()).substr(-2)
      time.text(timeStr)
    },
    getNextTimeNumber (h, m, s) {
      if (++s === 60) {
        s = 0
      }
      if (s === 0) {
        if (++m === 60) {
          m = 0
        }
      }
      if (m === 0) {
        if (++h === 60) {
          h = 0
        }
      }
      return [h, m, s]
    },
    scrollTop (event) {
      event.stopPropagation()
      let target = event.target
      let tagName = target.tagName.toLowerCase()
      // 只处理input和textarea
      if (tagName !== 'input' && tagName !== 'textarea') return
      // input只处理text,tel,search,number,email
      if (tagName === 'input') {
        let type = target.type
        if (!(type === 'text' || type === 'tel' || type === 'search' || type === 'number' || type === 'email')) {
          return
        }
      }
      // 不处理只读和禁用的元素
      if (target.readonly || target.disabled) return
      // 延时等待键盘弹出
      setTimeout(function () {
        target.scrollIntoViewIfNeeded()
      }, 300)
    }
  }
}
