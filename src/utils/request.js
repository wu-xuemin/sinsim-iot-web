import axios from 'axios'
import { getToken } from '@/utils/auth'
import store from '@/store'
import Cookies from 'js-cookie'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: '/api',
  timeout: 20000
})

service.interceptors.request.use(
  config => {
    if (Cookies.get('Token')) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code == 401) {
      store.dispatch('user/resetToken').then(() => {
        Message.error('token过期，请重新登陆')
        location.reload()
        return
      })
    } else {
      return res
    }
  },
  error => {
    if (error.response.status == 401) {
      store.dispatch('user/resetToken').then(() => {
        Message.error('token过期，请重新登陆')
        location.reload()
        return
      })
    }
    return Promise.reject(error)
  }
)

export default service
