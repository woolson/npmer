import axios from 'axios'

/** 接口地址 */
const BaseURL = process.env.NODE_ENV === 'production'
  ? 'https://woolson.cn'
  : 'http://localhost:3001'

/** 接口错误信息 */
const ErrMsg = {
  10001: '登录授权无效，请重新登录',
  10002: '徽章上传失败',
  10003: '登录已超时',
  10004: '参数错误',
  10005: '已经点赞'
}
const request = axios.create({
  baseURL: process.env.baseUrl,
  https: true
})

request.interceptors.request.use((config) => {
  window.$nuxt.$loading.start()
  config.url = BaseURL + config.url
  return config
})

request.interceptors.response.use((res) => {
  window.$nuxt.$loading.finish()
  if (res.data.code !== 0) {
    throw new Error(ErrMsg[res.data.code])
  }
  return res.data.data
}, () => {
  window.$nuxt.$loading.finish()
})

export default request
