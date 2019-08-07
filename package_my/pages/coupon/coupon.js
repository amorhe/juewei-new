import { imageUrl, imageUrl2, baseUrl } from '../../../pages/common/js/baseUrl'
import { couponsList, exchangeCode } from '../../../pages/common/js/home'
import { formatTime } from '../../../pages/common/js/time'
import { getSid, log, ajax } from '../../../pages/common/js/li-ajax'
Page({
  data: {
    open2: false,
    codeImg: '',
    tabs: [
      {
        title: '优惠券0张'
      },
      {
        title: '兑换码0个'
      },
    ],
    activeTab: 0,  // 初始选中
    imageUrl,
    imageUrl2,
    couponList: [],  // 优惠券列表
    exchangeList: [],  // 兑换列表
  },
  onLoad() {
    const _sid = my.getStorageSync({ key: '_sid' }).data;
    this.getCouponsList(_sid);
    this.getExchangeCode(_sid);
    let phone = my.getStorageSync({ key: 'phone' }).data
    this.setData({ phone })
  },
  onHide() {
    this.closeModel()
  },

  // 优惠券
  getCouponsList(_sid) {
    couponsList(_sid, 'use').then((res) => {
      this.data.tabs[0].title = `优惠券${res.DATA.use.length}张`;
      res.DATA.use.forEach(item => {
        item.start_time = formatTime(item.start_time, 'Y-M-D');
        item.end_time = formatTime(item.end_time, 'Y-M-D');
        item.toggleRule = false
      })
      this.setData({
        couponList: res.DATA.use,
        tabs: this.data.tabs
      })
    })
  },
  // 兑换码
  getExchangeCode(_sid) {
    exchangeCode(_sid, 'use').then((res) => {
      console.log(res)
      this.data.tabs[1].title = `兑换码${res.DATA.length}个`;
      this.setData({
        exchangeList: res.DATA
      })
    })
  },
  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  // 兑换详情
  changedetail(e) {
    const { gift_code_id, gift_id, order_id } = e.currentTarget.dataset
    my.navigateTo({
      url: '/package_my/pages/coupon/changedetails/changedetails?gift_code_id=' + gift_code_id + '&gift_id=' + gift_id + '&order_id=' + order_id
    })
  },

  /**
   * @function 展示CODE
   */

  async showCode(e) {
    let { code } = e.currentTarget.dataset
    let _sid = await getSid()
    let codeImg = baseUrl + '/juewei-api/coupon/getQRcode?' + '_sid=' + _sid + '&code=' + code
    this.setData({
      open2: true,
      codeImg
    })
  },
  /**
   * @function 关闭弹窗
   */
  closeModel() {
    this.setData({
      open2: false
    })
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
  },

  /**
   * @function 展示规则
   */

  toggleRule(e) {
    const { index } = e.currentTarget.dataset;
    let { couponList } = this.data
    if (couponList[index].toggleRule) {
      couponList[index].toggleRule = false
    } else {
      couponList.forEach(item => {
        item.toggleRule = false;
      })
      couponList[index].toggleRule = true
    }

    this.setData({ couponList })
  }
});
