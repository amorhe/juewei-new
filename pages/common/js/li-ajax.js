import { baseUrl } from './baseUrl'

export const ajax = (url, data = {}, method = 'POST') => {
  return new Promise((resolve, reject) => {
    my.request({
      url: baseUrl + url,
      data,
      method,
      headers:{'content-type': 'application/x-www-form-urlencoded'},
      success: (res) => {
        resolve(res.data)
        console.log(res.data)
      },
    });
  })
}