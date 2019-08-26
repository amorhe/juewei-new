import { parseData, getSid, log, isloginFn } from '../../../pages/common/js/li-ajax'
import { reqDetail, reqCreateOrder, reqConfirmOrder, reqPay, reqUserPoint } from '../../../pages/common/js/vip'
import { imageUrl2 } from '../../../pages/common/js/baseUrl'
import { upformId } from '../../../pages/common/js/time'

const app = getApp()

Page({
  data: {
    modalOpened: false,
    imageUrl2,
    openPoint: false,
    loginOpened: false,
    content: '',
    detail: {
      //   "id": "355",
      //   "goods_name": "123",
      //   "total_num": "1",
      //   "valid_num": "1",
      //   "cate_id": "25",
      //   "intro": "<p>123<\/p>",
      //   "goods_type": "2",
      //   "goods_detail_type": "4",
      //   "gift_id": "473",
      //   "exchange_type": "1",
      //   "point": "1",
      //   "amount": 0,
      //   "start_time": "2019-06-22 00:00:00",
      //   "end_time": "2019-07-31 23:59:59",
      //   "receive_type": "2",
      //   "get_start_time": "0000-00-00 00:00:00",
      //   "get_end_time": "0000-00-00 00:00:00",
      //   "scope_type": "3",
      //   "company_id": "0",
      //   "city_id": "1",
      //   "district_id": "0",
      //   "express_type": "1",
      //   "express_fee": "0",
      //   "exchange_limit_type": "1",
      //   "exchange_limit_num": "111",
      //   "exchange_day_num": "0",
      //   "exchange_intro": "<p>123123<\/p>",
      //   "sort_no": "12345",
      //   "status": "2",
      //   "create_time": "2019-06-22 14:47:58",
      //   "update_time": "2019-06-22 14:47:58",
      //   "goods_pic": [{
      //     "id": "318",
      //     "goods_pic": "\/static\/check\/image\/goods_point\/oXQW34ZBT6Pcbkx0.jpg"
      //   }, {
      //     "id": "454",
      //     "goods_pic": "\/static\/check\/image\/goods_point\/noTHmy1mTM09NrRh.png"
      //   }]
    }
  },

  parseData,

  onHide() {
    this.onModalClose()
  },

  async onLoad(e) {
    const { id } = e
    this.setData({ id })
  },

  async onShow() {
    const { id } = this.data
    await this.getDetail(id)
  },

  /**
   * @function 获取当商品面详情
   */
  async getDetail(id) {
    let { code, data: { goods_name, exchange_intro, intro, ...Data } } = await reqDetail(id)
    if (code === 100) {
      let _exchange_intro = await this.parseData(exchange_intro)
      let _intro = await this.parseData(intro)
      my.setNavigationBar({
        title: '商品详情',
      });
      this.setData({
        detail: {
          intro,
          _intro,
          exchange_intro,
          _exchange_intro,
          goods_name,
          ...Data
        }
      })
    }
  },

  /**
   * @function 创建订单
   */
  async createOrder() {
    let { id, exchange_type, point, amount } = this.data.detail;

    let params = {
      'goods[goods_id]': id,
      'goods[exchange_type]': exchange_type,
      'goods[point]': point,
      'goods[amount]': amount,
      'pay_type': 11
    }
    let { code, data, msg } = await reqCreateOrder(params)
    if (code === 100) {
      return data
    }
    if (code !== 100) {
      my.alert({title: msg});
      return {}
    }
  },

  /**
   * @function 确认订单
   */

  async confirmOrder(order_sn) {
    let params = { order_sn }
    let { code, data } = await reqConfirmOrder(params)
    return code === 100
  },

  /**
   * @function 支付订单
   */
  async pay(order_sn) {
    log(order_sn)
    let { code, data } = await reqPay(order_sn)
    return { code, data }
  },

  /**
   *@function 确认兑换
   */

  async onModalClick() {
    // goods_type	是	int	订单类型 1 虚拟订单 2 实物订单
    // receive_type	是	int	发货方式 0 无需发货 1 到店领取 2公司邮寄
    // goods_detail_type	是	int	物品详细类型 1 优惠券 2兑换码 3官方商品 4非官方商品
    const { goods_detail_type, receive_type, goods_type, amount } = this.data.detail
    let fail = false
    // 虚拟商品，点击兑换按钮，调用创建订单接口，
    // 有钱的订单或者有运费的订单才调起支付
    // 调用确认订单接口，然后调起支付
    // id = -1 兑换失败
    // 虚拟物品
    if (goods_type == 1) {
      let { order_id = '', order_sn } = await this.createOrder()
      if (!order_id) { return }
      let res = await this.confirmOrder(order_sn)
      if (amount != 0) {
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
                return my.redirectTo({
                  url: '../exchangelist/exchangedetail/exchangedetail?id=' + order_id
                });
              }
              return my.redirectTo({
                url: '../finish/finish?id=' + order_id + '&fail=' + true
              });

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

    // 实物商品，
    // 点击兑换按钮，
    // 调用创建订单接口，
    // 填写页面表单信息，
    // 然后点击支付按钮，
    // 调用确认订单接口，
    // 然后调起支付

    if (goods_type == 2) {
      let res = await this.createOrder()
      if (!res) { return }

      // 实物订单  公司邮寄
      if (receive_type == 2) {
        my.navigateTo({
          url: '../waitpay/waitpay?order_sn=' + res.order_sn
        });
      }

      // 实物订单  到店领取
      if (receive_type == 1) {
        my.navigateTo({
          url: '../waitpay/waitpay?order_sn=' + res.order_sn
        });
      }
    }
  },

  /**
   * @function 显示modal，立即兑换
   */

  async showConfirm() {
    let _sid = await getSid()
    if (!_sid) {
      // return this.setData({
      //   loginOpened: true
      // });
      return isloginFn()
    }

    let { goods_name, point } = this.data.detail

    // 获取 用户 积分
    let points = await this.getUserPoint()

    if (points >= point) {
      this.setData({
        content: `是否兑换“${goods_name}”将消耗你的${point}积分`,
        modalOpened: true
      })
    } else {
      this.setData({
        openPoint: true
      })
    }
  },



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
   * @function 赚积分
  */
  async getMorePoint() {
    this.onModalClose()
    my.switchTab({
      url: '/pages/home/goodslist/goodslist'
    });
  },


  /**
  * @function 获取用户积分
  */
  async getUserPoint() {
    let res = await reqUserPoint()
    if (res.CODE === 'A100') {
      return res.DATA.points
    }
  },
  onSubmit(e) {
    upformId(e.detail.formId);
  },

  isloginFn
});