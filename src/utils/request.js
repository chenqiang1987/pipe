import config from '@/config'
import axios from 'axios'

axios.interceptors.request.use(
  conf => {
    conf.baseURL = config.baseURL
    conf.withCredentials = true
    conf.timeout = 6000
    return conf
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(res => {
  if (res.status == 200) {
    if (res.data.code === 200) { // 统一处理成功状态码
      return Promise.resolve(res.data); // 成功状态
    } else {
      return Promise.reject(res.data); // 失败状态
    }
  } else {
    return Promise.reject(res); // 失败的原因
  }
}, err => {
  // 单独处理其他的状态码异常
  if (err.response) {
    switch (err.response.status) {
      case '401':
        console.log(err);
        break;
      default:
        break;
    }
  }
  return Promise.reject(err);
})

export default axios;
