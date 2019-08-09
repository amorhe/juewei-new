import { baseUrl, imageUrl, imageUrl2 } from '../../../../pages/common/js/baseUrl'
import { parseData, log, getSid, handleCopy, guide, contact, getNavHeight } from '../../../../pages/common/js/li-ajax'
import { reqOrderDetail, reqCancelOrder, reqWait } from '../../../../pages/common/js/vip'

const app = getApp()

Page({
  data: {
    imageUrl,
    imageUrl2,
    fail: false,
    open1: false,
    open2: false,
    cancleShow: false,

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

    time: '',

    // },

    cancelReasonList: [
      { reason: '下错单/临时不想要了', value: true },
      { reason: '信息填写错误，重新下单', value: false },
      { reason: '其他', value: false },
    ],
    _exchange_intro: [],
    _intro: [],

  },
  async onLoad(e) {
    const { id } = e;
    let navHeight = getNavHeight()
    this.setData({
      navHeight
    })
    await this.getOrderDetail(id)
  },

  onUnload() {
    clearInterval(this.data.time)
    this.setData({ time: -1 })
    this.setData = () => { }
  },


  onHide() {
    this.closeModel()
    // clearInterval(this.data.time)
    // this.setData({ time: -1 })
  },

  guide,

  contact,


  /**
   * @function 获取订单详情
   */
  async getOrderDetail(id) {
    let res = await reqOrderDetail(id)
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
      let { time } = this.data
      time = setInterval(() => {
        --remaining_pay_second
        if (remaining_pay_minute === 0 && remaining_pay_second == 0) {
          return clearInterval(a)
        }
        if (remaining_pay_second <= 0) {
          --remaining_pay_minute
          remaining_pay_second = 59
        }
        this.setData({
          _exchange_intro,
          _intro,
          detail: { ...item, remaining_pay_second, remaining_pay_minute },
          time
        })
      }, 1000)
    }
  },

  /**
   * @function 取消订单
   */

  async doCancelOrder() {
    const { order_sn } = this.data.detail
    let res = await reqCancelOrder(order_sn)
    if (res.code === 100) {
      app.globalData.refresh = true
      my.showToast({
        content: '取消成功',
      });

      setTimeout(() => {
        my.navigateBack({
          delta: 1
        });
      }, 1000)

    }
  },

  /**
   * @function 立即支付
   */

  async payNow() {
    let { order_sn, id, order_amount, receive_type, user_address_phone, user_address_name, province, city, district, user_address_id, user_address_detail_address } = this.data.detail;
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

  },

  /**
   * @function 剪切板
   */
  handleCopy,

  /**
  * @function 关闭弹窗
  */

  closeModel() {
    this.setData({
      open1: false,
      open2: false,
      cancleShow: false
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
        let { code } = this.data.detail
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
    let res = await reqWait()
    if (res.code == 0) {
      return this.closeModel()
    }

    return my.showToast({
      content: res.msg,
    });
  },
  /**
   * @ 显示选择原因
   */

  showCancel() {
    this.setData({
      cancleShow: true
    })
  },
  /**
   * @function 选择原因
   */

  selectReason(e) {
    const { cancelReasonList } = this.data;
    const { index } = e.currentTarget.dataset;
    cancelReasonList.forEach(item => item.value = false)
    cancelReasonList[index].value = true

    this.setData({
      cancelReasonList
    })
  },


});
