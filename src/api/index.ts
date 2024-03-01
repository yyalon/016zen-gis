import type { AxiosResponse } from 'axios'
import axios from 'axios'

// import qs from 'qs'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
import { toAdmin } from '@/utils/index'

// function toLogin() {
//   useUserStore().logout().then(() => {
//     router.push({
//       path: '/login',
//       query: {
//         redirect: router.currentRoute.value.path !== '/login' ? router.currentRoute.value.fullPath : undefined,
//       },
//     })
//   })
// }

const api = axios.create({
  baseURL: import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true' ? '/proxy/' : import.meta.env.VITE_APP_API_BASEURL,
  timeout: 1000 * 60,
  responseType: 'json',
})

api.interceptors.request.use((request) => {
  const userStore = useUserStore()
  /**
   * 全局拦截请求发送前提交的参数
   */

  console.log(userStore.isLogin)
  if (request.headers) {
    request.headers.Token = userStore.token

    // 请求标识
    if (request.headers) {
      request.headers.Authorization = userStore.token
    }
  }
  return request
})

api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.code === 1000) {
      return Promise.resolve(response.data)
    } else {
      ElMessage({
        message: response.data.message,
        type: 'error',
      })
    }
    // else {
    //   toLogin()
    // }
  },
  (error) => {
    const userStore = useUserStore()
    let message = error.message
    if (message === 'Network Error') {
      message = '后端网络故障'
    } else if (message.includes('timeout')) {
      message = '接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = `接口${message.substr(message.length - 3)}异常`
    }

    ElMessage({
      message,
      type: 'error',
    })
    setTimeout(() => {
      if (error.response) {
        const { status, config: c } = error.response
        if (status === 401) {
          userStore.logout()
          toAdmin('/logout')
        }
      }
    }, 3000)
    return Promise.reject(error)
  }
)

export default api
