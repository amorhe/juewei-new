import { imageUrl, imageUrl2, baseUrl } from '../../../common/js/baseUrl'
import { couponsList, exchangeCode } from '../../../common/js/home'
import { formatTime } from '../../../common/js/time'
import { getSid, log, ajax } from '../../../common/js/li-ajax'
var app = getApp();
Page({
  data: {
    open2: false,
    codeImg: '',
    active:[],
    activeIndex:'',
    imageUrl,
    imageUrl2,
    couponList:[],  // 优惠券列表
    defaultcoupon:'',    // 默认选中的优惠券
    couponChoosed:{}
  },
  onLoad(e) {
    const _sid = my.getStorageSync({ key: '_sid' }).data;
    this.getCouponsList(_sid,e.money/100);
  },
  onHide() {
    this.closeModel();
  },

  // 优惠券
  getCouponsList(_sid,money) {
    couponsList(_sid, 'use',money,my.getStorageSync({key:'shop_id'}).data).then((res) => {
      console.log(res)
      res.DATA.use.forEach(item => {
        item.start_time = formatTime(item.start_time, 'Y-M-D');
        item.end_time = formatTime(item.end_time, 'Y-M-D');
        item.toggleRule = false,
        item.isChecked = false
      })
      // 已选中的优惠券
      if(app.globalData.coupon_code){
        this.setData({
          defaultcoupon: app.globalData.coupon_code,
          couponList: res.DATA.use
        })
      }else{
        // 默认选择的优惠券
        this.setData({
          defaultcoupon:res.DATA.max.code,
          couponList: res.DATA.use
        })
      }

    })
  },
  chooseCouponed(e){
    app.globalData.coupon_code = e.currentTarget.dataset.coupon_code;
    console.log(this.data.couponChoosed)
    if(Object.keys(this.data.couponChoosed).length==0){
      app.globalData.notUse = 1;
      console.log('1')
    }else{
      console.log('2')
      app.globalData.notUse = 0
    }
    my.navigateBack({
      url: '/pages/home/orderform/orderform'
    });
  },
  // 切换是否选中
  selectTapTrue(e){
    let couponChoosed = {};
    couponChoosed[`e${e.currentTarget.dataset.index}`] = e.currentTarget.dataset.code;
    this.setData({
      couponChoosed,
      defaultcoupon:e.currentTarget.dataset.code
    })
  },
  selectTapFalse(e){
    this.setData({
      couponChoosed:{}
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
