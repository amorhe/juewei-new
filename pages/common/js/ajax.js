import {baseUrl} from './baseUrl';
export const ajax = (url,data={},method="POST") => {
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
        resolve(res.data);
      },
      fail:(err) => {
        reject({ errormsg: '网络错误,请稍后重试', code: -1 });
      }
    });
  })
  return promise; 
}

