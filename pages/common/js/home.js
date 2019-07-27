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
  createOrder: '/juewei-api/order/create',       // 创建订单
  confirmOrder: '/juewei-api/order/confirm',        // 确认订单（商品加入购物车点击立即购买）
  useraddress: '/juewei-api/useraddress/list',     // 我的地址，收货地址列表
  exchangeCode: '/mini/user/exchange_code_list',     // 兑换码列表
  exchangeCoupon: '/mini/coupons/exchange_coupons',   // 兑换优惠券
  exchangedetail: '/mini/user/exchange_code_view',    // 兑换详情
  commentList: '/juewei-api/comment/GoodsCommentList',     //  商品详情中的商品评价列表
  DispatchCommentList: '/juewei-api/comment/DispatchCommentList',      // 商品详情中的配送评价列表
  add_lng_lat: '/mini/order_online/add_lng_lat',            // 风控数据经纬度
  getMarkActivity: '/mini/activity/markup/mark/getMarkActivity',             // 加价购列表
} 

export const bannerList = (city_id,district_id,company_id,release_channel) => ajax(ajaxUrl.bannerList,{city_id,district_id,company_id,release_channel});

export const upAliMiniFormId = (aliUid,formId) => ajax(ajaxUrl.upAliMiniFormId,{aliUid,formId},"GET");

export const upAliMiniTradeNo = (aliUid,tradeNo) => ajax(ajaxUrl.upAliMiniTradeNo,{aliUid,tradeNo},"GET");

export const couponsList = (_sid,get_use,money,phone,shop_id) => ajax(ajaxUrl.couponsList,{_sid,get_use,money,phone,shop_id});

export const getQRcode = (_sid) => ajax(ajaxUrl.getQRcode,{_sid},"GET");

export const couponsExpire = (_sid) => ajax(ajaxUrl.couponsExpire,{_sid});

export const checkDis = (shop_id,location) => ajax(ajaxUrl.checkDis,{shop_id,location},"GET");

export const MyNearbyShop = (data) => ajax(ajaxUrl.MyNearbyShop,{data});

export const activityList = (city_id,district_id,company_id,join_way,user_id) => ajax(ajaxUrl.activityList,{city_id,district_id,company_id,join_way,user_id});

export const showPositionList = (city_id,district_id,company_id,release_channel) => ajax(ajaxUrl.showPositionList,{city_id,district_id,company_id,release_channel});

export const GetLbsShop = (location) => ajax(ajaxUrl.GetLbsShop,{location});

export const NearbyShop = (data) => ajax(ajaxUrl.NearbyShop,{data});

export const GetShopGoods = (shop_id) => ajax(ajaxUrl.GetShopGoods,{shop_id});

export const createOrder = (dispatch_type,shop_id,goods,shops,coupon_code,gift,notUse) => ajax(ajaxUrl.createOrder,{dispatch_type,shop_id,goods,shops,coupon_code,gift,notUse})

export const confirmOrder = (dispatch_type,shop_id,goods,shops,notUse,coupon_code,gift) => ajax(ajaxUrl.createOrder,{dispatch_type,shop_id,goods,shops,notUse,coupon_code,gift})

export const useraddress = (_sid,type,location) => ajax(ajaxUrl.useraddress,{_sid,type,location});

export const exchangeCode = (_sid,get_type) => ajax(ajaxUrl.exchangeCode,{_sid,get_type});

export const exchangeCoupon = (_sid,couponscode) => ajax(ajaxUrl.exchangeCoupon,{_sid,couponscode});

export const exchangedetail = (_sid,gift_code_id,gift_id,order_id) => ajax(ajaxUrl.exchangedetail,{_sid,gift_code_id,gift_id,order_id});

export const commentList = (goods_code,pagenum,pagesize,plate) => ajax(ajaxUrl.commentList,{goods_code,pagenum,pagesize,plate});

export const DispatchCommentList = (shop_id,pagenum,pagesize,plate) => ajax(ajaxUrl.DispatchCommentList,{shop_id,pagenum,pagesize,plate});

export const add_lng_lat = (order_no,type,longitude,latitude) =>ajax(ajaxUrl.add_lng_lat,{order_no,type,longitude,latitude});

export const getMarkActivity = (company_id,user_id) => ajax(ajaxUrl.getMarkActivity,{company_id,user_id})