import { baseUrl } from './baseUrl';
export const ajax = (url, data = {}, method = "POST", newBaseUrl) => {
  my.showLoading({
    content: '加载中...'
  });
  let headers;
  if (method == "POST") {
    headers = { 'content-type': 'application/x-www-form-urlencoded' };
  } else {
    headers = { 'content-type': 'application/json' };
  }
  let promise = new Promise(function(resolve, reject) {
    let url_pages = getCurrentPages() //获取加载的页面
    let url_currentPage = url_pages[url_pages.length-1] //获取当前页面的对象
    let redir_url = url_currentPage.route //当前页面url
    my.request({
      url: newBaseUrl ? (newBaseUrl + url) : (baseUrl + url),
      headers,
      data,
      method,
      timeout: 5000,
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
          //提示接口的信息，并且跳错误页
          reject(my.showToast({
            content: rest.msg,
            success() {
              my.redirectTo({
                url: '/pages/noNet/noNet?redir='+redir_url, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
              });
            }
          }))
        }
      },
      fail: (err) => {
        my.hideLoading();
        reject(my.showToast({
          content: '您的网路有点卡哦，请稍后再试！',
          success() {
            my.redirectTo({
              url: '/pages/noNet/noNet?redir='+redir_url, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
            });
          }
        }))
      }
    });
  })
  return promise;
}

