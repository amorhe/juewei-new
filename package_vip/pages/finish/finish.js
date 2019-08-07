import { imageUrl, imageUrl2, baseUrl } from '../../../pages/common/js/baseUrl'
import { ajax, parseData, redirect, log, getSid, handleCopy,guide,contact,liTo } from '../../../pages/common/js/li-ajax'

var app = getApp();
Page({
  data: {
    imageUrl,
    imageUrl2,
    fail: false,
    open1: false,
    open2: false,
    codeImg: '',
    // d: {
    //   "id": "26",
    //   "order_point": "1",
    //   "order_amount": 0.01,
    //   "exchange_type": "2",
    //   "order_ctime": "2019-03-02 11:02:47",
    //   "uid": "295060",
    //   "order_type": "2",
    //   "receive_type": "1",
    //   "dis_status": "2",
    //   "get_time": "0000-00-00 00:00:00",
    //   "get_code": "",
    //   "user_phone": "18701350807",
    //   "goods_id": "39",
    //   "shop_id": "0",
    //   "status": "2",
    //   "order_sn": "jwd03190302s265060",
    //   "goods_name": "4",
    //   "goods_pic": "/static/check/image/goods_point/wmyaUccmI47oFRkV.jpg",
    //   "goods_detail_type": "3",
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
    //   "get_start_time": "2019-03-01 00:00:00",
    //   "get_end_time": "2019-03-01 23:59:59",
    //   "status_name": "支付超时",
    //   //虚拟商品
    //   "gift_name": "绝味满40-5优惠券",
    //   "conpon_valid_type": "2",
    //   "conpon_valid_day": "0",
    //   "start_time": "2019-03-01 00:00:00",
    //   "end_time": "2019-03-04 23:59:59",
    //   "gift_use_time": "0000-00-00 00:00:00",
    //   "intro": "",
    //   "exchange_intro": "",
    //   "exchange_limit_type": "1",
    //   "exchange_limit_num": "11",
    //   // 公司邮寄
    //   "user_address_name": "",
    //   "user_address_phone": "",
    //   "user_address_address": "",
    //   "user_address_detail_address": "",
    //   "dis_time": "",
    //   "dis_sn": "",
    //   "dispatch_name": "",
    //   "code": ""
    // }
  },
  async onLoad(query) {
    let { id, fail } = query
    this.setData({
      fail: fail == 'true'
    })
    my.setNavigationBar({
        title:fail != 'true'?'兑换成功':'兑换失败',
    });
    await this.getOdrderDetail(id)

  },

  onShow() {
    this.closeModel()
  },

  handleCopy,

  guide,

  contact,

  liTo,


  redirect() {
    my.switchTab({
      url: '/pages/vip/index/index', // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
      success: (res) => {

      },
    });
    // redirect('/pages/vip/index/index')
  },

  /**
  * @function 跳转商品页
  */

  toOrderDetail(e) {
    const { id } = e.currentTarget.dataset
    my.navigateTo({
      url: '/package_vip/pages/exchangelist/exchangedetail/exchangedetail?id=' + id
    });
  },

  /**
   * 获取商品详情
   */
  async getOdrderDetail(id) {
    let { code, data: { intro, exchange_intro, ...Data } } = await ajax('/mini/vip/wap/order/order_detail', { id })
    if (code === 100) {
      this.setData({
        d: {
          _intro: await parseData(intro),
          _exchange_intro: await parseData(exchange_intro),
          intro,
          exchange_intro,
          ...Data
        }
      })
    }
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
    const { way } = this.data.d
    // way:用途 1:外卖专享 2:门店专享 3:全场通用
    switch (way - 0) {
      case 1:
      case 3:
        this.setData({
          open1: true
        })
        break;
      case 2:
        let { code } = this.data.d
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
    my.switchTab({
      url: '/pages/home/goodslist/goodslist'
    });
  },

  /**
   * @function 去外卖
   */
  toTakeIn() {
    app.globalData.type = 1
    log(app.globalData.type)

    my.switchTab({
      url: '/pages/home/goodslist/goodslist'
    });
  },

  /**
   * @function 核销
   */

  async wait() {
    let res = await ajax('/juewei-api/order/waiting', {}, 'GET')
    if (res.code == 0) {
      return this.closeModel()
    }

    return my.showToast({
      content: res.msg,
    });
  }
});

