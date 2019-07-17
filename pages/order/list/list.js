import { imageUrl, imageUrl2 } from '../../common/js/baseUrl'
import { ajax, log } from '../../common/js/li-ajax'


Page({
  data: {
    menuList: [
      { key: '官方外卖订单', value: '' },
      { key: '门店自提订单', value: '' }
    ],

    takeOutList: [order],
    pickUpList: [order],

    orderState: [
      '未支付状态/用户下单/新增订单',
      '支付成功',
      '商家接单/商家已确认',
      '正在配送/配送中',
      '确认收货/已送到/完成',
      '用户取消',
      '自动取消',
      '后台客服退单',
      '物流取消订单',
      '微信标记退款失败',
      '店pos取消'
    ],

    cur: 0
  },

  async onShow() {
    await this.getOrderList()
  },

  changeMenu(e) {
    const { cur } = e.currentTarget.dataset
    this.setData({ cur })
  },

  /**
   * @function 获取订单列表
   */
  async getOrderList() {
    let { data, code } = await ajax('/juewei-api/order/list', {}, 'GET')
    if (code === 0) {
      let takeOutList = data.filter(({ dis_type }) => dis_type === 1)
      let pickUpList = data.filter(({ dis_type }) => dis_type === 2)
      this.setData({
        takeOutList,
        pickUpList
      })
    }
  }
});



 let order = {
		"order_no": "jwd0119062926362484", // 订单id
		"real_price": 3800, // 实际支付（优惠后，真实付的钱）
		"sum_price": 3800, // 订单价格
		"coupon_money": 0, // 限量优惠券 // 使用优惠券的优惠金额
		"order_status": 6, // // 订单状态 0未支付状态/用户下单/新增订单 1支付成功 2商家接单/商家已确认 3正在配送/配送中 4确认收货/已送到/完成 5用户取消 6自动取消  7后台客服退单 8物流取消订单 9微信标记退款失败，10店pos取消
		"dis_status": 0, // 派送状态 0|未接单.1|系统已接单.2|分配骑手.3|到店取货.4|配送中.5|已送达.10|已取消.11|系统异常
		"dis_take_time": "0000-00-00 00:00:00", // // 物流取货时间
		"shop_id": 7950, // 门店id
		"shop_name": "绝味鸭脖(人民广场店)", // 门店名称
		"shop_longitude": "121.482569",
		"shop_latitude": "31.237829",
		"dis_type": 1, // 订单类型  1"官方外卖", 2"门店自取" // 配送方式 1配送  2 自提
		"dis_company": "由绝味到家提供外卖和配送服务",
		"order_ctime": "2019-06-29 13:41:38",
		"is_comment": 0, // 是否评论
		"goods": [{
			"goods_id": "A1QLT389",// 商品编号
			"goods_name": "招牌鸭脖（中辣)", // 商品名称
			"goods_num": 1, // 数量 // 商品数量
			"goods_taste": "不辣", // 口味
			"goods_format": "小份", // 商品规格属性
			"gift_id": 0, // 赠品id
			"gift_type": 0 // 赠品类型（1-优惠券;2-兑换码;3-官方商品;4-非官方商品）
		}, {
			"goods_id": "A1QLT393",
			"goods_name": "招牌鸭锁骨",
			"goods_num": 2,
			"goods_taste": "不辣",
			"goods_format": "小份",
			"gift_id": 0,
			"gift_type": 0
		}]
 }