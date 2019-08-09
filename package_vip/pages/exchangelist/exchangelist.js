import { imageUrl, imageUrl2 } from '../../../pages/common/js/baseUrl'
import { log } from '../../../pages/common/js/li-ajax'
import { reqOrderList, reqOrderDetail } from '../../../pages/common/js/vip'

const app = getApp()
Page({
  data: {
    imageUrl,
    imageUrl2,

    finish: false,

    orderList: [],

    page_num: 1,
    page_size: 10,
    lastLage: 10,

    time: ''
  },

  reset() {
    const { time } = this.data
    clearInterval(time)
    this.setData({
      finish: false,

      orderList: [],

      page_num: 1,
      page_size: 10,
      lastLage: 10,

      time: ''
    }, async () => {
      await this.getOrderList(1)
      my.stopPullDownRefresh()
    })


  },

  /**
  * @function 触底
  */

  async onPullDownRefresh() {
    this.reset()
  },


  async onShow() {
    log(app.globalData.refresh)
    if (app.globalData.refresh) {
      app.globalData.refresh = false;

      return this.reset()


    }

  },
  async onLoad() {
    await this.getOrderList(1)
  },
  onUnload() {
    clearInterval(this.data.time)
    this.setData({ time: -1 })
    this.setData = () => { }
  },
  onHide() {
    // clearInterval(this.data.time)
    // this.setData({ time: -1 })
  },

  /**
  * @function 获取更多订单信息
  */
  // 页面被拉到底部
  async onReachBottom() {
    clearInterval(this.data.time)
    my.showLoading({ content: '加载中...' });
    this.setData({ time: -1 }, async () => {
      setTimeout(async () => {
        let { page_num } = this.data
        ++page_num
        await this.getOrderList(page_num)
        this.setData({
          page_num
        })
      }, 300)
    })
  },


  /**
   * @function 获取订单列表
   */
  async getOrderList(page_num) {
    let { page_size, time, orderList, lastLage } = this.data;
    if (lastLage < page_num) {
      return my.hideLoading()
    }
    let res = await reqOrderList({ page_num, page_size })
    if (res.code === 100) {
      lastLage = res.data.pagination.lastLage
      if (lastLage < page_num) {
        return
      }
      orderList = [...orderList, ...res.data.data]

      time = setInterval(() => {
        orderList = orderList.map(({ remaining_pay_minute, remaining_pay_second, ...item }) => {
          remaining_pay_second--
          if (remaining_pay_second === 0 && remaining_pay_minute === 0) {
            return this.reset()
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
        this.setData({
          orderList,
          finish: true,
          time,
          lastLage
        }, () => my.hideLoading())

      }, 1000)

    }
  },

  /**
   * @function 跳转商品页
   */

  toOrderDetail(e) {
    const { id } = e.currentTarget.dataset
    my.navigateTo({
      url: './exchangedetail/exchangedetail?id=' + id
    });
  },

  /**
   * @function 跳转到VIP首页
   */

  switchTo() {
    my.switchTab({
      url: '/pages/vip/index/index', // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
    });
  },

  /**
   * @function 立即支付
   */

  async payNow(e) {
    let { order_sn, id, order_amount } = e.currentTarget.dataset;
    let res = await reqOrderDetail(id)
    if (res.code === 100) {
      // 校验订单 地址信息
      // if (res.data.receive_type == 2 || res.data.receive_type == 1) {
      //   if (!res.data.user_address_phone) {
      let { id, order_amount, receive_type, user_address_phone, user_address_name, province, city, district, user_address_id, user_address_detail_address } = res.data

      return my.navigateTo({
        url: '/package_vip/pages/waitpay/waitpay?'
          + 'order_sn=' + order_sn
          + '&user_address_name=' + user_address_name
          + '&user_address_phone=' + user_address_phone
          + '&province=' + province
          + '&city=' + city
          + '&district=' + district
          + '&user_address_id=' + user_address_id
          + '&user_address_detail_address=' + user_address_detail_address
      });
    }
  },


});

let detail = {
  "id": "26",
  "order_point": "1",
  "order_amount": 0.01,
  "exchange_type": "2",
  "order_ctime": "2019-03-02 11:02:47",
  "uid": "295060",
  "order_type": "2",
  "status": "2",
  "dis_status": "2",
  "order_sn": "jwd03190302s265060",
  "goods_name": "4",
  "goods_pic": "/static/check/image/goods_point/wmyaUccmI47oFRkV.jpg",
  "status_name": "支付超时"
}
