import axios from 'axios'
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

request.interceptors.response.use((res) => {
  if (res.data.code !== 0) {
    throw new Error(ErrMsg[res.data.code])
  }
  return res.data.data
})

export default request
