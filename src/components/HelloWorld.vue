<template>
  <div class="hello">
    <button @click="socketConnect">click me!</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    login: function (value) {
      console.log(value)
    }
  },
  methods: {
    socketConnect () {
      this.$socket.emit('add user', 'LIUSHAN')
    }
  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
