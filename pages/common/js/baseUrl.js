// 测试环境
export const baseUrl = 'https://test-wap.juewei.com/api';
//新接口
export const newBaseUrl = 'https://test-saas.juewei.com';
// 图片测试cdn
export const imageUrl = 'https://test-cdn-wap.juewei.com/m/ali-mini/image/';
export const imageUrl2 = 'https://imgcdnjwd.juewei.com';
export const imageUrl3 = 'https://images.juewei.com';
//jsonUrl
export const jsonUrl='https://imgcdnjwd.juewei.com/static/check';
export const serviceUrl='https://test-wap.juewei.com';
//百度测试ak
export const ak = 'pRtqXqnajTytAzWDL3HOnPRK';
export const geotable_id='134917';


// // 预发布
// export const baseUrl = 'https://proving-wap.juewei.com/api';
// // 新接口
// export const newBaseUrl = 'https://proving-saas.juewei.com';
// // 图片测试cdn
// export const imageUrl = 'https://cdn-wap.juewei.com/m/ali-mini/image/';
// export const imageUrl2 = 'https://imgcdnjwd.juewei.com';
// export const imageUrl3 = 'https://images.juewei.com';
// //jsonUrl
// export const jsonUrl='https://imgcdnjwd.juewei.com/static/product';
// export const serviceUrl='https://wap.juewei.com';
// //百度测试ak
// export const ak = 'pRtqXqnajTytAzWDL3HOnPRK';
// export const geotable_id='134917';
 

// // 生产环境
// export const baseUrl = 'https://wap.juewei.com/api';
// // 新接口
// export const newBaseUrl = 'https://saas.juewei.com'
// // 图片测试cdn
// export const imageUrl = 'https://cdn-wap.juewei.com/m/ali-mini/image/';
// export const imageUrl2 = 'https://imgcdnjwd.juewei.com';
// export const imageUrl3 = 'https://images.juewei.com';
// //jsonUrl
// export const jsonUrl='https://imgcdnjwd.juewei.com/static/product';
// export const serviceUrl='https://wap.juewei.com';
// // 百度生产ak
// export const ak = 'pRtqXqnajTytAzWDL3HOnPRK';
// export const geotable_id='134917';




// 判断是否测试环境
const isTestUrl = baseUrl.includes('test');
// 套餐图片路径
export const img_url = isTestUrl?imageUrl2:imageUrl3;

// 获取缓存
export const myGet = (key) => {
  let value = my.getStorageSync({ key }).data;
  return value
}

// 存储数据
export const mySet = (key, data) => {
  my.setStorageSync({
    key,
    data
  })
}