import { imageUrl, imageUrl2 } from '../../../pages/common/js/baseUrl'
import { log } from '../../../pages/common/js/li-ajax'
import { reqOrderList, reqOrderDetail, reqPay } from '../../../pages/common/js/vip'

const app = getApp()
Page({
  data: {
    imageUrl,
    imageUrl2,
    runShowFlag: true,
    finish: false,
    componentArr: [],
    orderList: [],

    page_num: 1,
    page_size: 10,
    lastLage: 10,

    time: []
  },

  reset() {
    const { time } = this.data
    log(time)
    time.forEach(item => clearInterval(item))
    this.setData({
      finish: false,

      orderList: [],

      page_num: 1,
      page_size: 10,
      lastLage: 10,

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
    // log(app.globalData.refresh)
    // if (app.globalData.refresh) {
    //   app.globalData.refresh = false;
    if (this.data.runShowFlag) {
      this.onPullDownRefresh()
    }
    // }

  },
  async onLoad() {
    this.setData({
      runShowFlag: false
    })
    await this.getOrderList(1)
  },
  onUnload() {
    const { time } = this.data
    time.forEach(item => clearInterval(item))
    this.setData = () => { }
  },
  onHide() {
    this.setData({
      runShowFlag: true
    })
    // 清除子组件定时器
    this.data.componentArr.map((item, index) => {
      if (item) {
        this["componentArr[" + index + "]"].fun();
      }
    })

    const { time } = this.data
    time.forEach(item => clearInterval(item))
    app.globalData.refresh = true
  },

  /**
  * @function 获取更多订单信息
  */
  // 页面被拉到底部
  async onReachBottom() {
    const { time } = this.data
    let { page_num } = this.data
    if (page_num >= this.data.lastLage) {
      my.showToast({
        type: 'none',
        content: '已经是最底部了',
        duration: 1500,
        success: () => {
          --page_num
        },
      });
    } else {
      ++page_num
      await this.getOrderList(page_num)
    }
    this.setData({
      page_num
    })
  },



  /**
   * @function 获取订单列表
   */
  async getOrderList(page_num) {
    let { page_size, time, lastLage } = this.data;
    let orderList = [];

    let res = await reqOrderList({ page_num, page_size })

    if (res.code === 100) {
      // 最后一页的页码
      lastLage = res.data.pagination.lastLage

      orderList = res.data.data
      let timer = setInterval(() => {
        orderList = orderList.map(({ remaining_pay_minute = -1, remaining_pay_second = -1, ...item }) => {
          remaining_pay_second--
          if (remaining_pay_second === 0 && remaining_pay_minute === -1) {
            // clearInterval(time)
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
      }, 1000)
      if (time.length > 100) { time = [] }

      this.$spliceData({
        'orderList': [this.data.orderList.length, 0, ...orderList]
      });
      this.setData({
        finish: true,
        time: [...time, timer],
        lastLage
      }, () => my.hideLoading())
    }
  },

  onZero(id) {
    this.setData({
      ["orderList[" + id + "].remaining_pay_minute"]: -1
    })
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
   * @function 跳转到会员首页
   */

  switchTo() {
    my.switchTab({
      url: '/pages/vip/index/index', // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
    });
  },

  /**
  * @function 支付订单
  */
  async pay(order_sn) {
    log(order_sn)
    let { code, data } = await reqPay(order_sn)
    return { code, data }
  },
  getComponent(ref) {
    if (!this.data.componentArr[ref.$id]) {
      // 把组件绑定在this上，不能使用setData设置到data里
      this["componentArr[" + ref.$id + "]"] = ref;
      // 记录组件的$id,记录到data中
      this.setData({
        ["componentArr[" + ref.$id + "]"]: ref.$id
      })
    }
  },

  /**
   * @function 立即支付
   */

  async payNow(e) {
    let { order_sn, id, order_amount } = e.currentTarget.dataset;
    let res = await reqOrderDetail(id)
    if (res.code === 100) {
      let { id, order_amount, receive_type, user_address_phone, user_address_name, province, city, district, user_address_id, user_address_detail_address } = res.data

      // 校验订单 地址信息
      if (receive_type == 2 || receive_type == 1) {
        if (!user_address_phone) {

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
      }

      if (receive_type == 0) {
        // let { order_id = '', order_sn } = await this.createOrder()
        // if (!order_id) { return }
        // let res = await this.confirmOrder(order_sn)
        if (order_amount != 0) {
          let res = await this.pay(order_sn)
          if (res.code == 0) {
            my.tradePay({
              tradeNO: res.data.tradeNo, // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
              success: res => {
                log('s', res)
                // 用户支付成功
                if (res.resultCode == 9000) {
                  return my.redirectTo({
                    url: '../finish/finish?id=' + order_id + '&fail=' + false
                  });
                }
                // 用户取消支付
                if (res.resultCode == 6001) {
                  return
                  // return my.redirectTo({
                  //   url: '../exchangelist/exchangedetail/exchangedetail?id=' + order_id
                  // });
                }
              },
              fail: res => {
                log('fail')
                return my.redirectTo({
                  url: '../finish/finish?id=' + order_id + '&fail=' + true
                });
              }
            });
          } else {
            return my.showToast({ content: res.msg });
          }
          return
        }

        if (!res) { fail = true }
        // 虚拟订单 + 兑换码 => 无需发货
        //
        if (goods_detail_type == 2 && receive_type == 0) {
          my.navigateTo({
            url: '../finish/finish?id=' + order_id + '&fail=' + fail
          });
        }

        // 虚拟订单 + 优惠卷 => 无需发货
        // 跑通
        if (goods_detail_type == 1 && receive_type == 0) {
          my.navigateTo({
            url: '../finish/finish?id=' + order_id + '&fail=' + fail
          });
        }
      }
    }

  },


});
