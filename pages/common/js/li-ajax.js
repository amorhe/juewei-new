import { baseUrl } from './baseUrl'
import parse from 'mini-html-parser2';

export const ajax = (url, data = {}, method = 'POST') => {
  my.showLoading({
    content: '加载中...',
  });
  data._sid = _sid
  return new Promise((resolve, reject) => {
    my.request({
      url: baseUrl + url,
      data,
      method,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        my.hideLoading()
        resolve(res.data)
        console.log(res.data)
      },
    });
  })
}

export const sid = async () => {
  return new Promise(resolve => {
    my.getAuthCode({
      scopes: 'auth_base',
      success: (res) => {
        console.log(res)
        ajax('/juewei-api/alimini/loginByAuth', {
          ali_uid: res.authCode,
          phone: '18640460506'
        })
      },
    });
  })
}

export const _sid = '4966-inviq2t1sdl3s95idh7a0s1dn1'

export const parseData = async (html) => {
  return new Promise(resolve => {
    parse(html, (err, nodes) => {
      if (!err) {
        resolve(nodes)
      }
    })
  })
}

export const redirect = (url) =>{
  my.redirectTo({
    url, 
  });
}