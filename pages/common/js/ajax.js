import { baseUrl } from './baseUrl';
export const ajax = (url, data = {}, method = "POST") => {
  my.showLoading({
    content: '加载中...',
    delay: 1000,
  });
  let headers;
  if (method == "POST") {
    headers = { 'content-type': 'application/x-www-form-urlencoded' };
  } else {
    headers = { 'content-type': 'application/json' };
  }
  let promise = new Promise(function(resolve, reject) {
    my.request({
      url: baseUrl + url,
      headers,
      data,
      method,
      success: (res) => {
        my.hideLoading();
        let rest = {
          code: (res.code || res.CODE || ""),
          data: (res.data || res.DATA),
          msg: (res.msg || res.MESSAGE)
        }
        if (rest.code == 0 || rest.code == "A100" || rest.code == 100) {
          resolve(rest.data);
        } else if (rest.code == 30106 || rest.code == "A103" || rest.code == 101) {
          //nologin
          my.navigateTo({
            url: '/pages/login/auth/auth'
          });
        } else {
          //tiaocuowuye
          reject(my.alert({
            title: '网络请求错误',
            success() {
              my.redirectTo({
                url: '/pages/noNet/noNet', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
              });
            }
          }))
        }
      },
      fail: (err) => {
        my.hideLoading();
        reject(my.alert({
          title: '网络请求错误',
          success() {
            my.redirectTo({
              url: '/pages/noNet/noNet', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
            });
          }
        }))
      }
    });
  })
  return promise;
}

