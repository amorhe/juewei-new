import { imageUrl, imageUrl2 } from '../../../../pages/common/js/baseUrl'
import { ajax } from '../../../../pages/common/js/li-ajax'

Page({
  data: {
    imageUrl,
    imageUrl2,

    detail: {
      "id": "26",
      "order_point": "1",
      "order_amount": 0.01,
      "exchange_type": "2",
      "order_ctime": "2019-03-02 11:02:47",
      "uid": "295060",
      "order_type": "2",
      "receive_type": "1",
      "dis_status": "2",
      "get_time": "0000-00-00 00:00:00",
      "get_code": "",
      "user_phone": "18701350807",
      "goods_id": "39",
      "shop_id": "0",
      "status": "2",
      "order_sn": "jwd03190302s265060",
      "goods_name": "4",
      "goods_pic": "/static/check/image/goods_point/wmyaUccmI47oFRkV.jpg",
      "goods_detail_type": "3",
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
      "get_start_time": "2019-03-01 00:00:00",
      "get_end_time": "2019-03-01 23:59:59",
      "status_name": "支付超时",
      //虚拟商品
      "gift_name": "绝味满40-5优惠券",
      "conpon_valid_type": "2",
      "conpon_valid_day": "0",
      "start_time": "2019-03-01 00:00:00",
      "end_time": "2019-03-04 23:59:59",
      "gift_use_time": "0000-00-00 00:00:00",
      "intro": "",
      "exchange_intro": "",
      "exchange_limit_type": "1",
      "exchange_limit_num": "11",
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

    _sid: '4966-inviq2t1sdl3s95idh7a0s1dn'
  },
  onLoad(e) {
    const { id } = e;

    this.getOrderDetail(id)

    my.setNavigationBar({
      title: '兑换记录',
      backgroundColor: '#F5402B',
      success() {

      },
      fail() {

      },
    });
  },

  async getOrderDetail(id) {
    const { _sid } = this.data;
    let res = await ajax('/mini/vip/wap/order/order_detail', { _sid, id })
    if(res.code ===100){
      this.setData({
        detail:res.data
      })
    }
  }
});
