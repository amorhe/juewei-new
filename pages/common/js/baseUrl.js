// 测试主域名
// export const baseUrl = 'https://dev.juewei.com/api';
export const baseUrl = 'https://test-wap.juewei.com/api';

// 生产域名
// const baseUrl = 'http://wap.juewei.com/api';

// 判断是否测试环境
const isTestUrl = baseUrl.includes('test');
// 图片测试cdn
export const imageUrl = 'https://test-wap.juewei.com/m/ali-mini/image/';
export const imageUrl2 = 'https://imgcdnjwd.juewei.com';
export const imageUrl3 = 'https://images.juewei.com';

// 百度生产ak
export const ak = 'pRtqXqnajTytAzWDL3HOnPRK';
export const geotable_id='134917';
//百度测试ak
// export const ak = 'kLRuRCHmGvOYIqxmwEzI9PpC80lfuSCU';
// export const geotable_id='170580';
 
// 套餐图片路径
export const img_url = isTestUrl?imageUrl2:imageUrl3;
// const imageUrl = 'https://wap.juewei.com/m/ali-mini/image/';


