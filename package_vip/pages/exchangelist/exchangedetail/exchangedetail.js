import { baseUrl, imageUrl, imageUrl2 } from '../../../../pages/common/js/baseUrl'
import { ajax, parseData, log,getSid } from '../../../../pages/common/js/li-ajax'

const app = getApp()

Page({
  data: {
    imageUrl,
    imageUrl2,
     fail: false,
    open1: false,
    open2: false,

    // detail: {
    //   "id": "",
    //   "order_point": "",
    //   "order_amount": "",
    //   "exchange_type": "",
    //   "order_ctime": "",
    //   "uid": "",
    //   "order_type": "",
    //   "receive_type": "",
    //   "dis_status": "",
    //   "get_time": "",
    //   "get_code": "",
    //   "user_phone": "",
    //   "goods_id": "",
    //   "shop_id": "",
    //   "status": "",
    //   "order_sn": "",
    //   "goods_name": "",
    //   "goods_pic": "",
    //   "goods_detail_type": "",
    //   //到店领取
    //   "user_address_name": "",
    //   "user_address_phone": "",
    //   "code_img": "",
    //   "shop_name": null,
    //   "province": null,
    //   "city": null,
    //   "district": null,
    //   "address": null,
    //   "shop_latitude": null,
    //   "shop_longitude": null,
    //   "get_start_time": "",
    //   "get_end_time": "",
    //   "status_name": "",
    //   //虚拟商品
    //   "gift_name": "",
    //   "conpon_valid_type": "",
    //   "conpon_valid_day": "",
    //   "start_time": "",
    //   "end_time": "",
    //   "gift_use_time": "",
    //   "intro": "",
    //   "exchange_intro": "",
    //   "exchange_limit_type": "",
    //   "exchange_limit_num": "",
    //   // 公司邮寄
    //   "user_address_name": "",
    //   "user_address_phone": "",
    //   "user_address_address": "",
    //   "user_address_detail_address": "",
    //   "dis_time": "",
    //   "dis_sn": "",
    //   "dispatch_name": "",
    //   "code": ""
    //   ,

    //   a: ''

    // },

    _exchange_intro: [],
    _intro: [],

  },
  async onLoad(e) {
    const { id } = e;

    await this.getOrderDetail(id)
  },

  onShow(){
    this.closeModel()
  },

  onUnload() {
    clearInterval(this.data.a)
  },


  onHide() {
    clearInterval(this.data.a)
  },




  /**
   * @function 获取订单详情
   */
  async getOrderDetail(id) {
    let res = await ajax('/mini/vip/wap/order/order_detail', { id })
    let _exchange_intro = await parseData(res.data.exchange_intro)
    let _intro = await parseData(res.data.intro)

    if (res.code === 100) {
      // if (res.data.receive_type == 2 || res.data.receive_type == 1) {
      //   if (!res.data.user_address_phone && res.data.status == 0) {
      //     return my.redirectTo({
      //       url: '/package_vip/pages/waitpay/waitpay?order_sn=' + res.data.order_sn
      //     });
      //   }
      // }

      let { remaining_pay_minute, remaining_pay_second, ...item } = res.data
      let { a } = this.data
      a = setInterval(() => {
        --remaining_pay_second
        if (remaining_pay_minute === 0 && remaining_pay_second == 0) {
          return clearInterval(a)
        }
        if (remaining_pay_second <= 0) {
          --remaining_pay_minute
          remaining_pay_second = 59
        }
        log(remaining_pay_second)
        this.setData({
          _exchange_intro,
          _intro,
          detail: { ...item, remaining_pay_second, remaining_pay_minute },
          a
        })
      }, 1000)
    }
  },

  /**
   * @function 取消订单
   */

  async doCancelOrder() {
    const { order_sn } = this.data.detail
    let res = await ajax('/mini/vip/wap/trade/cancel_order', { order_sn }, 'POST')
    if (res.code === 100) {
      my.navigateBack({
        delta: 1
      });
    }
  },

  /**
   * @function 立即支付
   */

  async payNow() {
    let { order_sn, id, order_amount, receive_type, user_address_phone ,user_address_name,province,city,district,user_address_id,user_address_detail_address} = this.data.detail;
    // 校验订单 地址信息
    // if (receive_type == 2 || receive_type == 1) {
    //   if (!user_address_phone) {
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
    //   }
    // }
    // 订单不要钱的时候 直接 成功
    if (order_amount == 0) {
      return my.redirectTo({
        url: '/package_vip/pagesfinish/finish?id=' + id + '&fail=' + false
      });
    }
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
              url: '/package_vip/pages/finish/finish?id=' + id + '&fail=' + false
            });
          }
        },
        fail: res => {
          log(res)
          return my.redirectTo({
            url: '/package_vip/pages/finish/finish?id=' + id + '&fail=' + true
          });
        }
      });

    } else {
      return my.redirectTo({
        url: '/package_vip/pages/finish/finish?id=' + id + '&fail=' + true
      });
    }
  },

  /**
   * @function 剪切板
   */
  handleCopy() {
    my.setClipboard({
      text: this.data.detail.order_sn,
      success() {
        my.showToast({
          type: 'success',
          content: '操作成功'
        });
      }
    });
  },

   /**
   * @function 关闭弹窗
   */

  closeModel() {
    this.setData({
      open1: false,
      open2: false
    })
  },

  /**
  * @function 使用优惠卷
  */
  async toUse() {
    const { way } = this.data.detail
    // way:用途 1:外卖专享 2:门店专享 3:全场通用
    switch (way - 0) {
      case 1:
      case 3:
        this.setData({
          open1: true
        })
        break;
      case 2:
      let {code} = this.data.detail
      let _sid = await getSid()
      let codeImg = baseUrl + '/juewei-api/coupon/getQRcode?' + '_sid=' + _sid + '&code=' + code
      log(codeImg)
       this.setData({
          open2: true,
          codeImg
        })
        break
    }
  },



  /**
   * @function 去自提
   */
  toTakeOut() {
    app.globalData.type = 2
    log(app.globalData.type)
    my.navigateTo({
      url: '/pages/home/goodslist/goodslist'
    });
  },

  /**
   * @function 去外卖
   */
  toTakeIn() {
    app.globalData.type = 1
    log(app.globalData.type)

    my.navigateTo({
      url: '/pages/home/goodslist/goodslist'
    });
  },

/**
 * @function 核销
 */

async wait(){
 let res = await ajax('/juewei-api/order/waiting',{},'GET')
 if(res.code == 0){
  return this.closeModel()
 }

 return my.showToast({
  content: res.msg,
 });
}

});
