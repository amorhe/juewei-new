import { baseUrl } from './baseUrl'

export const ajax = (url, data = {}, method = 'POST') => {
  my.showLoading({
    content:'加载中...',
  });
  return new Promise((resolve, reject) => {
    my.request({
      url: baseUrl + url,
      data,
      method,
      headers:{'content-type': 'application/x-www-form-urlencoded'},
      success: (res) => {
        my.hideLoading()
        resolve(res.data)
        console.log(res.data)
      },
    });
  })
}