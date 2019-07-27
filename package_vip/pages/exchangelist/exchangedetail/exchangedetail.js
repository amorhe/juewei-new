import { imageUrl, imageUrl2 } from '../../../../pages/common/js/baseUrl'
import { ajax, parseData, log } from '../../../../pages/common/js/li-ajax'

Page({
  data: {
    imageUrl,
    imageUrl2,

    detail: {
      "id": "",
      "order_point": "",
      "order_amount": "",
      "exchange_type": "",
      "order_ctime": "",
      "uid": "",
      "order_type": "",
      "receive_type": "",
      "dis_status": "",
      "get_time": "",
      "get_code": "",
      "user_phone": "",
      "goods_id": "",
      "shop_id": "",
      "status": "",
      "order_sn": "",
      "goods_name": "",
      "goods_pic": "",
      "goods_detail_type": "",
      //到店领取
      "user_address_name": "",
      "user_address_phone": "",
      "code_img": "",
      "shop_name": null,
      "province": null,
      "city": null,
      "district": null,
      "address": null,
      "shop_latitude": null,
      "shop_longitude": null,
      "get_start_time": "",
      "get_end_time": "",
      "status_name": "",
      //虚拟商品
      "gift_name": "",
      "conpon_valid_type": "",
      "conpon_valid_day": "",
      "start_time": "",
      "end_time": "",
      "gift_use_time": "",
      "intro": "",
      "exchange_intro": "",
      "exchange_limit_type": "",
      "exchange_limit_num": "",
      // 公司邮寄
      "user_address_name": "",
      "user_address_phone": "",
      "user_address_address": "",
      "user_address_detail_address": "",
      "dis_time": "",
      "dis_sn": "",
      "dispatch_name": "",
      "code": ""
      ,

      a:''

    },

    _exchange_intro: [],
    _intro: [],

  },
  async onLoad(e) {
    const { id } = e;

    await this.getOrderDetail(id)
  },

   onUnload() {
    clearInterval(this.data.a)
  },


  /**
   * @function 或其订单详情
   */
  async getOrderDetail(id) {
    const { _sid } = this.data;
    let res = await ajax('/mini/vip/wap/order/order_detail', { _sid, id })
    let _exchange_intro = await parseData(res.data.exchange_intro)
    let _intro = await parseData(res.data.intro)

    if (res.code === 100) {
      let { remaining_pay_minute, remaining_pay_second,...item }  = res.data
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
          detail:{...item,remaining_pay_second,remaining_pay_minute},
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
});
