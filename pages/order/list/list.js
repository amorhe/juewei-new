import { imageUrl, imageUrl2 } from '../../common/js/baseUrl'
import { ajax, log, contact, isloginFn, guide } from '../../common/js/li-ajax'

const app = getApp()
Page({
  data: {
    imageUrl,
    loginOpened: false,
    menuList: [
      {
        key: '官方外卖订单',
        value: '',
        page: 1,
        dis_type: 1,
        finish: false,
        fun: 'getTakeOutList',
        timer: -1
      },
      {
        key: '门店自提订单',
        value: '',
        page: 1,
        dis_type: 2,
        finish: false,
        fun: 'getPickUpList',
        timer: -1
      }
    ],

    dis_type: 1,

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
      '等待取餐',
      '订单已完成',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消'
    ],

    cur: 0,

  },

  // 下拉刷新
  async onPullDownRefresh() {
    this.refresh()
  },

  // 刷新
  async refresh() {
    // 重置数据
    let _menuList = [
      {
        key: '官方外卖订单',
        value: '',
        page: 1,
        dis_type: 1,
        finish: false,
        fun: 'getTakeOutList',
        timer: -1
      },
      {
        key: '门店自提订单',
        value: '',
        page: 1,
        dis_type: 2,
        finish: false,
        fun: 'getPickUpList',
        timer: -1
      }
    ]
    let _takeOutList = []
    let _pickUpList = []

    // 清空所有计时器
    const { menuList } = this.data
    menuList.forEach(({ timer }) => clearInterval(timer))

    // 拉取最新数据

    this.setData({
      menuList: _menuList,
      takeOutList: _takeOutList,
      pickUpList: _pickUpList
    }, async () => {
      await this.getMore()

      my.stopPullDownRefresh()
    })


  },


  

  async onShow() {
    // app.globalData.refresh = true
    log(app.globalData.refresh)
     if (app.globalData.refresh == true) {
       my.showToast({
         content:'取消成功'
       });
      app.globalData.refresh = false
      return this.refresh();
    }
    let { takeOutList, pickUpList, menuList, cur } = this.data
    if (menuList[cur].page == 1 && (!takeOutList.length || !pickUpList.length)) {
      await this[menuList[cur]['fun']]()
    }
  },
  onUnload() {
    let { menuList, cur } = this.data
    clearInterval(menuList[cur].timer)
    menuList[cur].timer = -1
    this.setData({ menuList })
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
      loginOpened: false,
      menuList: [
        { key: '官方外卖订单', value: '', page: 1, dis_type: 1 },
        { key: '门店自提订单', value: '', page: 1, dis_type: 2 }
      ],
      takeOutList: [],
      pickUpList: [],
    })
  },

  

  /**
   * @function 选择菜单
   */

  async changeMenu(e) {
    let { menuList, pickUpList } = this.data
    const { cur } = e.currentTarget.dataset
    if (this.data.cur === cur) { return }
    this.setData({ cur }, () => {
      if (menuList[cur].page == 1 && !pickUpList.length) {
        this[menuList[cur]['fun']]()
      }
    })
  },

  /**
   * @function 获取外卖订单列表
   */
  async getTakeOutList() {

    let { takeOutList, menuList, cur } = this.data

    let { page, dis_type, timer } = menuList[cur]

    clearInterval(timer)

    let { data, code } = await ajax('/juewei-api/order/list', { page_size: 10, page, dis_type }, 'GET')
    if (code === 0) {

      takeOutList = [...data, ...takeOutList]

      timer = setInterval(() => {
        takeOutList = takeOutList.map(({ remaining_pay_minute, remaining_pay_second, ...item }) => {
          remaining_pay_second--
          if (remaining_pay_second === 0 && remaining_pay_minute === 0) {
            return this.getTakeOutList()
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
        menuList[cur].finish = true
        menuList[cur].page++
        menuList[cur].timer = timer
        this.setData({
          takeOutList,
          menuList
        }, () => my.hideLoading())

      }, 1000)

    }
  },

  /**
   * @function 获取自提订单列表
   */
  async getPickUpList() {

    let { pickUpList, menuList, cur } = this.data

    let { page, dis_type, timer } = menuList[cur]

    clearInterval(timer)
    let { data, code } = await ajax('/juewei-api/order/list', { page_size: 10, page, dis_type }, 'GET')
    if (code === 0) {
      pickUpList = [...data, ...pickUpList]
      timer = setInterval(() => {
        pickUpList = pickUpList.map(({ remaining_pay_minute, remaining_pay_second, ...item }) => {
          remaining_pay_second--
          if (remaining_pay_second === 0 && remaining_pay_minute === 0) {
            return this.getPickUpList()
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
        menuList[cur].timer = timer
        menuList[cur].finish = true
        menuList[cur].page++

        this.setData({
          pickUpList,
          menuList
        }, () => my.hideLoading())
      }, 1000)

    }
  },

  /**
   * @function 获取更对订单信息
   */

  async getMore() {
    // 页面被拉到底部
    const { menuList, cur } = this.data;
    my.showLoading({ content: '加载中...' });
    setTimeout(async () => {
      await this[menuList[cur]['fun']]()
    }, 300)
  },

  /**
   * @function 触底
   */

  async onReachBottom() {

    this.getMore()
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

  /**
   * @function 再来一单
   */

  buyAgain() {
    const { menuList, cur } = this.data;

    app.globalData.type = menuList[cur].dis_type;
    log(app.globalData.type)

    my.switchTab({
      url: '/pages/home/goodslist/goodslist'
    });
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