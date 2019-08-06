import { imageUrl, imageUrl2 } from '../../common/js/baseUrl'
import { ajax, log, contact, isloginFn,guide } from '../../common/js/li-ajax'


Page({
  data: {
    imageUrl,
    loginOpened: false,
    menuList: [
      { key: '官方外卖订单', value: '' },
      { key: '门店自提订单', value: '' }
    ],

    listAll: [],

    takeOutList: [],
    pickUpList: [],

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

    cur: 0,

    page: 1
  },

  async onLoad() {
    const { page } = this.data
    await this.getOrderList(page)
  },
  onUnload() {
    clearInterval(this.data.time)
    this.setData({ time: -1 })
    this.setData = () => { }
  },
  onHide() {
    this.onModalClose()

    // clearInterval(this.data.time)
    // this.setData({ time: -1 })
  },

  contact,
  isloginFn,
  guide,

  /**
   * @function 关闭modal
   */
  onModalClose() {
    this.setData({
      openPoint: false,
      modalOpened: false,
      loginOpened: false
    })
  },

  /**
   * @function 选择菜单
   */

  changeMenu(e) {
    const { cur } = e.currentTarget.dataset
    this.setData({ cur })
  },

  /**
   * @function 获取订单列表
   */
  async getOrderList(page) {

    let { listAll } = this.data

    let { data, code } = await ajax('/juewei-api/order/list', { page_size: 10, page }, 'GET')
    if (code === 0) {

      let { time } = this.data
      listAll = [...data, ...listAll]
      time = setInterval(() => {
        listAll = listAll.map(({ remaining_pay_minute, remaining_pay_second, ...item }) => {
          remaining_pay_second--
          if (remaining_pay_second === 0 && remaining_pay_minute === 0) {
            return clearInterval(time)
          }
          if (remaining_pay_second <= 0) {
            --remaining_pay_minute
            remaining_pay_second = 59
          }
          return {
            remaining_pay_minute,
            remaining_pay_second,
            ...item,
          }
        })
        let takeOutList = listAll.filter(({ dis_type }) => dis_type == 1)
        let pickUpList = listAll.filter(({ dis_type }) => dis_type == 2)
        this.setData({
          takeOutList,
          pickUpList,
          listAll,
          finish: true,
          time,
        }, () => my.hideLoading())

      }, 1000)

    } else {
      this.setData({
        loginOpened: true
      })
    }
  },

  /**
   * @function 获取更对订单信息
   */

  async onReachBottom() {
    // 页面被拉到底部
    clearInterval(this.data.time)
    my.showLoading({ content: '加载中...' });
    this.setData({ time: -1 }, async () => {
      setTimeout(async () => {
        let { page } = this.data
        ++page
        await this.getOrderList(page)
        this.setData({
          page
        })
      }, 300)
    })

  },

  /**
   * @function 跳转订单详情页面
   */
  toDetail(e) {
    const { order_no } = e.currentTarget.dataset;
    my.navigateTo({
      url: '/package_order/pages/orderdetail/orderdetail?order_no=' + order_no
    });
  },
  /**
   * @function 去评价页面
   */
  toComment(e) {
    const { order_no } = e.currentTarget.dataset;
    my.navigateTo({
      url: '/package_order/pages/comment/comment?order_no=' + order_no
    });
  },

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