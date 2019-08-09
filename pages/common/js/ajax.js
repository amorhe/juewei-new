import {baseUrl} from './baseUrl';
export const ajax = (url,data={},method="POST") => {
  my.showLoading({
  content: '加载中...',
  delay: 1000,
  });
  let headers;
  if(method == "POST"){
    headers = {'content-type': 'application/x-www-form-urlencoded'};
  }else{
    headers = {'content-type': 'application/json'};
  }
  let promise = new Promise(function (resolve, reject) {
    my.request({
      url: baseUrl + url,
      headers,
      data,
      method,
      success: (res) => {
         my.hideLoading();
        let rest={
          code: (res.code || res.CODE || ""),
          data: (res.data || res.DATA),
          msg:(res.msg|| res.MESSAGE)
        }
        if(rest.code==0 || rest.code=="A100" || rest.code==100){
            resolve(rest.data);
        }else if(rest.code==30106 || rest.code=="A103" || rest.code==101){
            //nologin
            my.navigateTo({
              url: '/pages/login/auth/auth'
            });
        }else{
           //tiaocuowuye
            reject({ errormsg: rest.msg, code: -1 });
        }
      },
      fail:(err) => {
        my.hideLoading();
        reject({ errormsg: '网络错误,请稍后重试', code: -1 });
      }
    });
  })
  return promise;
}

