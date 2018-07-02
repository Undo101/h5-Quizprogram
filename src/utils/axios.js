import axios from 'axios'
import qs from 'qs'
import { Indicator } from 'mint-ui'

if (process.env.NODE_ENV === 'development') {
  // 前提是开发环境
  axios.defaults.baseURL = 'http://139.159.212.187:6880'
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://139.159.212.187:6880'
}

// 创建单例axios
const instance = axios.create({
  // baseURL: baseUrl,
  withCredentials: true,
  transformRequest: [function (data) {
    return qs.stringify(data)
  }]
})

instance.interceptors.request.use(config => {
  Indicator.open()
  return config
}, error => {
  console.log('test_error')
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
instance.interceptors.response.use(response => {
  Indicator.close()
  return response
}, error => {
  // Do something with response error
  Indicator.close()
  return Promise.reject(error.response)
})

export default instance
