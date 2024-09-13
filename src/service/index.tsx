import { Modal, message } from 'antd'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'

export default class CustomAxios {
  // axios 实例
  instance: AxiosInstance

  clearEmptyParam = (config) => {
    const res_url: any[] = []
    if (config.url?.includes('?') && config.url.split('?')[1]) {
      const url_split = config.url.split('?')[1].split('&')
      url_split.forEach((key: any) => {
        if (!key.includes('undefined') && key.split('=')[1] && !key.includes('null')) {
          res_url.push(key)
        }
      })
      if (res_url) {
        config.url = `${config.url.split('?')[0]}?${res_url.join('&')}`
      }
    }
  }

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    // 拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // config.headers.Authorization = `${sessionStorage.token_type} ${sessionStorage.access_token}`
        // config.headers.Cookie = 'ldap=eesyanuigbiaeasdaiiieasyiansgcoud6482e922ade8901993b613fff06dcaee3f74e25f529f0377f6b96d32344453e'
        if (config.method === 'get' || config.method === 'delete') {
          this.clearEmptyParam(config)
          config.params = {
            ...config.params,
            timestamp: new Date().valueOf() /* 解决GET请求缓存问题 */,
          }
        }

        return config
      },
      (err) => Promise.reject(err)
    )
    this.instance.interceptors.response.use(
      (response) => {
        console.log('接口返回response', response)
        if (response.config?.responseType === 'blob') {
          return response
        }
        const res = response.data
        if (res && res.error_code !== 0) {
          return res
        }
        return response
      },
      (error) => {
        let errorMsg = ''
        let longErrorMsg = ''
        // 401报错,就跳到转登录页
        if (error?.response) {
          if (error.response.status === 500) {
            errorMsg = '服务器500错误！'
          } else if (error.response.status === 422) {
            errorMsg = `${error.response.data?.detail[0]?.loc[1]} ${error.response.data?.detail[0].type}`
          } else if (error.response.status === 404) {
            errorMsg = '请求404错误'
          } else {
            if (Array.isArray(error.response?.data?.data)) {
              longErrorMsg = `<div>${error.response?.data?.data?.join('<br/>').split('; ').join('<br/>')}</div>`
            } else {
              console.log('error', error)
              if (error.response?.data?.code === 13 && error.response?.data?.msg === 'USERNAME_OR_PASSWORD_ERROR') {
                // history.push('/login')
                sessionStorage.clear()
              }
              errorMsg = error.response?.data?.data
                ? error.response?.data?.data
                : error.response?.data?.msg
                  ? error.response?.data?.msg
                  : '发生错误,请联系管理员'
            }
          }
        }
        // 表格解析时,超长报错内容使用modal,显示换行,需要手动关闭
        // 普通报错使用message,显示4次,主动消失
        if (longErrorMsg.length > 0) {
          Modal.error({
            title: '出错了 O_o???',
            content: (
              <>
                <div dangerouslySetInnerHTML={{ __html: longErrorMsg }} />
            </>
          ),
          width: 700,
            maskClosable: true,
        })
        } else {
          message.error(`出错了O_o??? , 报错原因：${errorMsg}`)
        }
        return Promise.reject(error)
      }
    )
  }
  request<T>(config: AxiosRequestConfig<T>): Promise<T> {
    return this.instance.request<any, T>(config)
  }
}

export const customAxios = new CustomAxios({
  baseURL: '/savv',
  // baseURL: '',
  timeout: 20000,
  // withCredentials: true // 请求是携带cookie
})

export const request = customAxios.instance
