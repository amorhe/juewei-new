import { baseUrl } from './baseUrl'
import parse from 'mini-html-parser2';


/**
 * @function 获取 sid
 */
export const getSid = () => {
  return new Promise((resolve, reject) => {
    my.getStorage({
      key: '_sid', // 缓存数据的key
      success: (res) => {
        resolve(res.data)
      },
      fail: err => {
        reject(err)
      }
    });
  })
}


/**
 * @function ajax 请求
 * @param url 地址 string
 * @param data 数据
 * @param method 请求方式
 * @return Promise<any>
 */
export const ajax = async (url, data = {}, method = 'POST') => {
  my.showLoading({
    content: '加载中...',
  });
  let _sid = await getSid()
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
 * @function 获取 富文本 数组
 * @param string html字符串
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
      dataType: 'text',
      url: 'https://imgcdnjwd.juewei.com/prod/vipstatic/region_min.js',
      success: (res) => {
        resolve(JSON.parse(res.data.split('=')[1].slice(0, -1)))
      },
      fail: res => {
        my.alert({
          title: res
        });
      }
    });
  })
}

/**
  * @function 剪切板
  */
export const handleCopy = (e) => {
  const { text } = e.currentTarget.dataset
  log(text)
  my.setClipboard({
    text,
    success() {
      my.showToast({
        type: 'success',
        content: '操作成功'
      });
    }
  });
}

/**
 * @function 百度jdk
 * @param _lat 经纬度中超过能100的那个 => 经度
 * @param _lng 经纬度中 没有 超过 100的那个 => 纬度
 */

export const getDistance = async (_lng, _lat) => {
  let lat = my.getStorageSync({ key: 'lat' }).data;
  let lng = my.getStorageSync({ key: 'lng' }).data;
  return new Promise((resolve, reject) => {
    my.request({
      url: `https://api.map.baidu.com/directionlite/v1/driving?origin=${lng},${lat}&destination=${_lng},${_lat}&ak=pRtqXqnajTytAzWDL3HOnPRK`,
      success: (res) => {
        resolve(res)
      },
    });
  })
}

/**
 * @function 导航
 */

export const guide = () => {
  my.openLocation({
    longitude: '121.549697',
    latitude: '31.227250',
    name: '支付宝',
    address: '杨高路地铁站',
  });
}


