import {ajax} from './ajax'
const ajaxUrl = {
  bannerList: '/mini/index/wap/banner/list',  // 首页改版公众号 banner列表
}

export const bannerList = (city_id,district_id,company_id,release_channel) => ajax(ajaxUrl.bannerList,{city_id,district_id,company_id,release_channel});