// import { baseUrl } from './baseUrl'
import parse from 'mini-html-parser2';

let baseUrl = 'https://test-wap.juewei.com/api'

/**
 * @function ajax 请求
 * @param url 地址 string
 * @param data 数据
 * @param method 请求方式
 * @return Promise<any>
 */
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
        log(res.data)
      },
    });
  })
}

/**
 * @function 获取 sid
 */

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

export const _sid = '9789-4ui62bhsvvg4jautqijjk114h6'


/**
 * @function 获取 富文本 数组
 */
export const parseData = async (html) => {
  return new Promise(resolve => {
    parse(html, (err, nodes) => {
      if (!err) {
        resolve(nodes)
      }
    })
  })
}

/**
 * @function 重定向
 */

export const redirect = (url) => {
  my.redirectTo({
    url,
  });
}


export const log = console.log

/**
 * @function 获取地址列表
 */
export const getRegion = async () => {
  return new Promise((resolve, reject) => {
    my.request({
      dataType:'text',
      url: 'https://imgcdnjwd.juewei.com/prod/vipstatic/region_min.js',
      success: (res) => {
        resolve(JSON.parse(res.data.split('=')[1].slice(0, -1)))
      },
      fail:res=>{
        my.alert({
          title: res 
        });
      }
    });
  })
}

/**
 * @function 百度jdk
 */

export const getDistance = async () => {
  return new Promise((resolve, reject) => {
    my.request({
      url: 'https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=134917&location=116.45633588096595%2C39.9289655041306&ak=pRtqXqnajTytAzWDL3HOnPRK&radius=3000&sortby=distance%3A1&_=1504837396593&page_index=0&page_size=1000&_=1563263791821',
      success: (res) => {
        resolve(res)
      },
    });
  })
}



