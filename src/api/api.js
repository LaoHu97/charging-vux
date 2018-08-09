import Axios from 'axios'
import Bus from './bus.js'

const instance = Axios.create({
  baseURL: process.env.API_ROOT,
  timeout: 20000
})

instance.defaults.headers.post['Content-Type'] = 'application/json'
// http请求拦截器
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 显示
  Bus.$emit('loadingState', true)
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // 隐藏
  setTimeout(function () {
    Bus.$emit('loadingState', false)
  }, 200)
  return response
}, function (error) {
  Bus.$emit('loadingState', false)
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default instance
