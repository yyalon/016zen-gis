// import { Buffer } from 'node:buffer'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://10.245.183.33:8078',
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const encodedData = btoa('test:123456')
  if (config && config.headers) {
    config.headers.Authorization = `Basic ${encodedData}`
  }
  return config
})

export default api
