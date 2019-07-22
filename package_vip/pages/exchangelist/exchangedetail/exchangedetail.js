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

    },

    _exchange_intro: [],
    _intro: [],

  },
  onLoad(e) {
    const { id } = e;

    this.getOrderDetail(id)
  },

  async getOrderDetail(id) {
    const { _sid } = this.data;
    let res = await ajax('/mini/vip/wap/order/order_detail', { _sid, id })
    let _exchange_intro = await parseData(res.data.exchange_intro)
    let _intro = await parseData(res.data.intro)

    if (res.code === 100) {
      this.setData({
        _exchange_intro,
        _intro,
        detail: res.data
      })
    }
  },


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
