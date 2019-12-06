import { imageUrl, imageUrl2, baseUrl } from '../../../common/js/baseUrl'
import { couponsList, exchangeCode } from '../../../common/js/home'
import { formatTime } from '../../../common/js/time'
import { getSid, log, ajax } from '../../../common/js/li-ajax'
var app = getApp();
Page({
  data: {
    open2: false,
    codeImg: '',
    active: [],
    activeIndex: '',
    imageUrl,
    imageUrl2,
    couponList: [],  // 优惠券列表
    defaultcoupon: '',    // 默认选中的优惠券
    couponChoosed: '',    //coupon.code  选择的优惠按
    is_allow_coupon: false //是否可以享受优惠
  },
  onLoad(e) {
    if(((e.coupon && e.coupon!='')?e.coupon:'')==''){
      app.globalData.notUse = 1; 
    }else{
      app.globalData.notUse = 0; 
    }
    this.setData({
      couponChoosed:((e.coupon && e.coupon!='')?e.coupon:''),
      is_allow_coupon:e.is_allow_coupon=='true'
    })
    const _sid = my.getStorageSync({ key: '_sid' }).data;
    this.getCouponsList(_sid, e.money / 100);
  },
  onHide() {
    this.closeModel();
  },
  onShow(){

  },
  // 优惠券
  getCouponsList(_sid, money) {
    let that=this;
    couponsList(_sid, 'use', money, my.getStorageSync({ key: 'shop_id' }).data).then((res) => {
      res.DATA.use.forEach(item => {
        item.start_time = formatTime(item.start_time, 'Y-M-D');
        item.end_time = formatTime(item.end_time, 'Y-M-D');
        item.toggleRule = false,
          item.isChecked = false
      })
      // 已选中的优惠券
      if (that.data.couponChoosed!='') { //app.globalData.coupon_code
        that.setData({
          couponList: res.DATA.use,
          couponChoosed: ((app.globalData.notUse == 0)?that.data.couponChoosed:'')  //用户不用优惠券的时候要保持空
        })
      } else { // 默认不选择优惠券
        that.setData({
          couponList: res.DATA.use,
          couponChoosed: ''  //this.data.couponChoosed
        })
      }
    })
  },

  //选择优惠券
  chooseCouponed(e) {
    // let couponChoosed = {};
    // couponChoosed[`e${e.currentTarget.dataset.index}`] = e.currentTarget.dataset.coupon_code;
    if(this.data.is_allow_coupon){//可以优惠
        if (this.data.couponChoosed == e.currentTarget.dataset.coupon_code) {
          app.globalData.notUse = 1;
          this.setData({
            couponChoosed: ''
          })
          app.globalData.coupon_code ='';
        } else {
          app.globalData.notUse = 0;
          this.setData({
            couponChoosed:e.currentTarget.dataset.coupon_code
          })
          app.globalData.coupon_code = e.currentTarget.dataset.coupon_code;
        }
    }else{//不能优惠
        this.setData({
          couponChoosed: ''
        })
        app.globalData.coupon_code = '';
        app.globalData.notUse = 1;
    }
    my.navigateBack({
      url: '/pages/home/orderform/orderform'
    });
  },

  //不能选的优惠券
  chooseCouponed_noused(e){
    
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




  // 切换是否选中
  // selectTapTrue(e) {
  //   let couponChoosed = {};
  //   couponChoosed[`e${e.currentTarget.dataset.index}`] = e.currentTarget.dataset.code;
  //   app.globalData.notUse = 0;
  //   this.setData({
  //     couponChoosed
  //   })
  // },
  // selectTapFalse(e) {
  //   app.globalData.notUse = 1;
  //   this.setData({
  //     couponChoosed: {}
  //   })
  // },
