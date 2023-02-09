import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, toAdmin, isExpired } from '@/utils/auth'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  async config => {
    // 判断 token 是否过期
    if (isExpired('token')) {
      // 判断 refreshToken 是否过期
      if (isExpired('refreshToken')) {
        toAdmin('/login')
      }
      await store.dispatch('refreshToken')
    }

    if (store.getters.token) {
      config.headers['Authorization'] = `${getToken()}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 1000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      if (res && res.data) {
        return res.data
      }
    }
  },
  error => {
    let msg = ''
    const { response, message } = error
    if (response) {
      if (response.data && response.data.message) {
        msg = response.data.message
        if (response.data.code === 1001) {
          toAdmin('/login')
        }
      } else {
        msg = response.config.url + ' : ' + message
      }
    }
    Message({
      message: msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
