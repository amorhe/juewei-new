import { imageUrl, imageUrl2 } from '../../../pages/common/js/baseUrl'
import { ajax, log } from '../../../pages/common/js/li-ajax'



Page({
  data: {
    imageUrl,
    imageUrl2,

    orderList: [],

    page_num: 1,
    page_size: 10000,

    time: ''
  },
  async onShow() {
    let { page_num } = this.data;
    await this.getOrderList(1)
  },
  onUnload() {
    clearInterval(this.data.time)
  },
  onHide() {
    clearInterval(this.data.time)
  },

  // /**
  // * @function 获取更对订单信息
  // */

  // async onReachBottom() {
  //   // 页面被拉到底部
  //   let { page_num } = this.data
  //   ++page_num
  //   await this.getOrderList(page_num)
  //   this.setData({
  //     page_num
  //   })
  // },


  /**
   * @function 获取订单列表
   */
  async getOrderList(page_num) {
    let { page_size, time, orderList } = this.data;
    let res = await ajax('/mini/vip/wap/order/order_list', { page_num, page_size })
    if (res.code === 100) {
      orderList = [...res.data.data,...orderList]
      time = setInterval(() => {
        orderList = orderList.map(({ remaining_pay_minute, remaining_pay_second, ...item }) => {
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

        this.setData({ orderList, time })

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

  async payNow() {
    let { order_sn, id } = this.data.detail;
    let r = await ajax('/juewei-service/payment/AliMiniPay', { order_no: order_sn })
    if (r.code === 0) {
      let { tradeNo } = r.data
      if (!tradeNo) {
        return my.showToast({
          content: r.data.erroMSg
        })
      }
      my.tradePay({
        tradeNO: tradeNo, // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
        success: res => {
          if (res.resultCode == 9000) {
            return my.redirectTo({
              url: '../..//finish/finish?id=' + id + '&fail=' + false
            });
          }
        },
        fail: res => {
          log(res)
          return my.redirectTo({
            url: '../../finish/finish?id=' + id + '&fail=' + true
          });
        }
      });

    } else {
      return my.redirectTo({
        url: '../../finish/finish?id=' + id + '&fail=' + true
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
