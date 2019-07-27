import { imageUrl, imageUrl2 } from '../../../pages/common/js/baseUrl'
import { log, ajax } from '../../../pages/common/js/li-ajax'
Page({
  data: {
    imageUrl,
    imageUrl2,
    orderState: [],
    takeOutState: [
      '待支付',
      '订单已提交',
      '商家已接单',
      '正在配送',
      '已送达',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消'
    ],

    pickUpState: [
      '待支付',
      '订单已提交',
      '商家已接单',
      '待取餐',
      '已取餐',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消'
    ],

    payTypes: {
      1: '微信', 2: '支付宝', 3: '银联', 4: '微信扫码', 5: '支付宝扫码', 6: '现金'
    },

    postWay: {
      FNPS: '蜂鸟配送', MTPS: '美团配送', ZPS: '自配送'
    },
    d: {}
  },
  async onLoad(e) {
    let { order_no } = e
    await this.getOrderDetail(order_no)
  },

  /**
   * @function 获取订单详情
   */
  async getOrderDetail(order_no) {
    let res = await ajax('/juewei-api/order/detail', { order_no })
    if (res.code === 0) {
      this.setData({ d: res.data })
    }
  },

  /**
   * @function 打电话
   */
  makePhoneCall(e) {
    const { number } = e.currentTarget.dataset
    my.makePhoneCall({ number });
  },
});

let data = {
  "order_id": 26362488, // 订单编号
  "user_id": 295095, // 用户编号
  "shop_id": 145, // 门店id
  "user_name": "v", // 收货人姓名
  "user_phone": "13001979905", // 收货人电话
  "user_sex": 0, // 收货人性别
  "map_addr": "紫檀大厦", // 地图定位地址
  "user_address": "6层", // 用户地址
  "sum_goods": 0, // 商品数量
  "sum_price": 3600, // 订单价格
  "real_price": 3600, // 实际支付（优惠后，真实付的钱）
  "message": "", // 备注信息
  "source": "服务号", // 下单来源 1，服务号  2，android 3，ios
  "pay_type": 1, // 支付平台 1，微信 2，支付宝  3， 银联  4，微信扫码 5，支付宝扫码 6，现金
  "order_ctime": "2019-07-02 10:06:24",
  "order_utime": "2019-07-02 10:22:01",
  "get_point": 0, // 获取积分
  "use_point": 0, // 使用积分
  "reduce_money": 0, // 订单优惠总金额
  "coupon_money": 0, // 限量优惠券 // 使用优惠券的优惠金额
  "minus_money": 0, // 立减券金额 // 立减券金额
  "user_new_money": 0, // 首单立减 // 新用户优惠金额
  "activity_code": "4", // 活动code
  "coupons": [], // 满减券code
  "dis_original_price": 500, // 配送费原价
  "dis_price": 500, // 配送费 // 原有配送费,精确到分
  "latitude": "39.918633",
  "longitude": "116.548277",
  "province": "北京",
  "province_id": 110000,
  "city": "北京市",
  "city_id": 110100,
  "district": "朝阳区",
  "district_id": 110105,
  "openid": "ommkBxCy4xYp_WqgBo5s-SZIUJ-g", // 微信openid
  "company_sale_id": 25, // 门店关联的销售型公司
  "status": 2, // 订单状态 0|创建订单 1|已完成 2|已取消
  "push_shop_id": "145", // 可推送的门店
  "cancel_shop_id": "0", // 取消的门店
  "order_cancel_reason": "", // 订单取消原因
  "reduce_detail": null, // 优惠详情
  "goods_gifts_money": 0, // 商品规则优惠券总金额
  "goods_reduce_money": 0, // 商品折扣优惠总金额
  "activity_money": 0,  // 活动满减// 活动金额
  "order_index": 1, // 门店第几单
  "is_comment": 0, // 是否评论
  "pay_no": "", // 第三方支付订单号
  "pay_price": 0, // 实际支付金额
  "pay_reduce_price": 0, // 支付优惠金额
  "dis_tel": "", // 配送员电话
  "dis_name": "", // 配送员名
  "dis_tag": "", // 物流标签 // FNPS:蜂鸟配送 MTPS:美团配送 ZPS:自配送
  "is_dis": 0, // 是否配送标记（商家）
  "dis_type": 1, // 订单类型  1"官方外卖", 2"门店自取" // 配送方式 1配送  2 自提
  "dis_no": "", // 第三方配送的单号
  "refund_no": "", // 退款编码
  "refund_price": 0, // 退款金额
  "refund_is_full": 0, // 是否全额退款
  "refund_reason": "", // 退款原因
  "push_time": "0000-00-00 00:00:00", // 推送时间
  "get_time": "0000-00-00 00:00:00", // 门店接单时间
  "pay_time": "0000-00-00 00:00:00", // 支付时间
  "cancel_time": "2019-07-02 10:22:01", // 取消时间
  "refund_time": "0000-00-00 00:00:00", // 支付时间
  "dis_get_time": "0000-00-00 00:00:00", // 物流接单时间
  "dis_take_time": "0000-00-00 00:00:00", // 物流取货时间
  "dis_finish_time": "0000-00-00 00:00:00", // 物流完成配送时间
  "dis_id": 0, // 配送公司id
  "template_id": "", // 优惠券模板编号
  "distance": 844, // 配送距离
  "is_remark": 0, // 是否标记备注
  "new_user": 0, // 新用户首单标识
  "free_shipping_id": 0, // 包邮活动ID
  "ali_uid": "", // 阿里支付宝小程序user_id
  "goods_list": [{
    "order_goods_web_id": 2219263, // 订单详情编号
    "order_id": 26362488, // 订单id
    "tenant_id": 1,
    "goods_quantity": 1, // 数量 // 商品数量
    "goods_name": "招牌鸭脖", // 商品名称
    "goods_price": 3100, // 单价 // 商品单价,精确到分
    "goods_original_price": 3100, // 原价 // 商品原价,精确到分
    "order_goods_web_ctime": "2019-07-02 10:06:24",
    "goods_code": "A1QLT3", // 商品编号
    "is_gifts": 0, // 是否是赠品
    "remark": "超辣", // 口味 // 商品备注信息
    "goods_format": "大份", // 商品规格属性
    "gift_id": 0, // 赠品id
    "gift_type": 0, // 赠品类型（1-优惠券;2-兑换码;3-官方商品;4-非官方商品）
    "goods_img": "http:\/\/imgcdnjwd.juewei.com\/static\/product\/image\/goods_point\/file\/2017-12-22\/src\/ee54bcc477f93fd0a1.jpg" // 商品图片
  }],
  "order_status_info": {
    "order_status_web_id": 939887,
    "order_id": 26362488,
    "tenant_id": 1,
    "order_status": 6, // 订单状态 0未支付状态/用户下单/新增订单 1支付成功 2商家接单/商家已确认 3正在配送/配送中 4确认收货/已送到/完成 5用户取消 6自动取消  7后台客服退单 8物流取消订单 9微信标记退款失败，10店pos取消
    "dis_status": 0, // 派送状态 0|未接单.1|系统已接单.2|分配骑手.3|到店取货.4|配送中.5|已送达.10|已取消.11|系统异常
    "pay_status": 0, // 支付状态 0|等待支付.1|支付完成
    "refund_status": 0, // 退款状态 0|未退款.1|审核通过.2|审核失败.3|用户退款.4|退款成功.5|退款失败
    "version": 0,
    "order_status_web_ctime": "2019-07-02 10:06:24",
    "order_status_web_utime": "2019-07-02 10:22:01"
  },
  "shop_name": "绝味鸭脖(定福庄西街店)", // 门店名称
  "shop_tel": "13000000000", // 门店电话
  "shop_longitude": "116.557588",
  "shop_latitude": "39.916042",
  "order_no": "jwd0119070226362488" // 订单id
}
