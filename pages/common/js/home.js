import {ajax} from './ajax'
const ajaxUrl = {
  bannerList: '/mini/index/wap/banner/list',  // 首页改版公众号 banner列表
  upAliMiniFormId: '/juewei-api/order/upAliMiniFormId',  // 发送模板信息
  upAliMiniTradeNo: '/juewei-api/order/upAliMiniTradeNo',  // 订单支付后模板消息发送
  couponsList: '/mini/coupons/list',   // 优惠券列表
  getQRcode: '/juewei-api/coupons/getQRcode',   // 优惠券核销二维码
  couponsExpire: '/mini/index/wap/coupon/expire_detail',   // 优惠券过期提醒
  checkDis: '/juewei-api/shop/CheckDis',     // 判断收获地址是不是在当前门店配送范围内
  MyNearbyShop: '/juewei-api/shop/MyNearbyShop',   // 我的/周边门店
  activityList: '/mini/Mini_activity/list',   // 商城页面营销活动
  showPositionList: '/mini/index/wap/show_position/list',   // 公众号展位列表
  GetLbsShop: '/juewei-api/shop/GetLbsShop',    // 根据经纬度获取外卖附近门店
  NearbyShop: '/juewei-api/shop/NearbyShop',      // 根据经纬度获取自提附近门店
  GetShopGoods: '/juewei-api/shop/GetShopGoods',      // 门店商品列表
} 

export const bannerList = (city_id,district_id,company_id,release_channel) => ajax(ajaxUrl.bannerList,{city_id,district_id,company_id,release_channel});

export const upAliMiniFormId = (aliUid,formId) => ajax(ajaxUrl.upAliMiniFormId,{aliUid,formId},"GET");

export const upAliMiniTradeNo = (aliUid,tradeNo) => ajax(ajaxUrl.upAliMiniTradeNo,{aliUid,tradeNo},"GET");

export const couponsList = (get_use,money,phone,shop_id) => ajax(ajaxUrl.couponsList,{get_use,money,phone,shop_id});

export const getQRcode = (_sid) => ajax(ajaxUrl.getQRcode,{_sid},"GET");

export const couponsExpire = (_sid) => ajax(ajaxUrl.couponsExpire,{_sid});

export const checkDis = (shop_id,location) => ajax(ajaxUrl.checkDis,{shop_id,location},"GET");

export const MyNearbyShop = (data) => ajax(ajaxUrl.MyNearbyShop,{data});

export const activityList = (city_id,district_id,company_id,buy_type,user_id) => ajax(ajaxUrl.activityList,{city_id,district_id,company_id,buy_type,user_id});

export const showPositionList = (city_id,district_id,company_id,release_channel) => ajax(ajaxUrl.showPositionList,{city_id,district_id,company_id,release_channel});

export const GetLbsShop = (location) => ajax(ajaxUrl.GetLbsShop,{location});

export const NearbyShop = (data) => ajax(ajaxUrl.NearbyShop,{data});

export const GetShopGoods = (shop_id) => ajax(ajaxUrl.GetShopGoods,{shop_id});
