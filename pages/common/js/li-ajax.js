import { baseUrl } from './baseUrl'

export const ajax = (url, data = {}, method = 'POST') => {
  return new Promise((resolve, reject) => {
    my.request({
      url: baseUrl + url,
      data,
      method,
      success: (res) => {
        resolve(res.data)
      },
    });
  })
}