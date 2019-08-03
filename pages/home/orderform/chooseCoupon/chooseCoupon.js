import {imageUrl,imageUrl2} from '../../../common/js/baseUrl'
import {couponsList,exchangeCode} from '../../../common/js/home'
import {formatTime} from '../../../common/js/time'
Page({
  data: {
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
    couponList:[],  // 优惠券列表
    exchangeList:[],  // 兑换列表
    defaultcoupon:'',    // 默认选中的优惠券
  },
  onLoad() {
    const _sid = my.getStorageSync({key: '_sid'}).data;
    this.getCouponsList(_sid);
    this.getExchangeCode(_sid);
  },
  // 优惠券
  getCouponsList(_sid){
    couponsList(_sid,'use').then((res) => {
      this.data.tabs[0].title = `优惠券${res.DATA.use.length}张`;
      res.DATA.use.forEach(item => {
        item.start_time = formatTime(item.start_time,'Y-M-D');
        item.end_time = formatTime(item.end_time,'Y-M-D');
      })
      let index = res.DATA.use.findIndex(item => {
        return item.code == res.DATA.max.code
      });
      
      this.setData({
        couponList:res.DATA.use,
        tabs:this.data.tabs,
        defaultcoupon:index
      })
    })
  },
  //  选择优惠券
  radioChange(e){
    console.log('你选择的优惠券是：', e.detail.value);
    this.setData({
      coupon_code: e.detail.value
    })
  },
  chooseCouponed(){
    // my.setStorageSync({
    //   coupon_code:this.data.coupon_code
    // })
    app.globalData.coupon_code = this.data.coupon_code;
    my.navigateBack({
      url: '/pages/home/orderform/orderform'
    });
  },
  // 兑换码
  getExchangeCode(_sid){
    exchangeCode(_sid,'use').then((res) => {
      console.log(res)
       this.data.tabs[1].title = `兑换码${res.DATA.length}个`;
      this.setData({
        exchangeList:res.DATA
      })
    })
  },
  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  // 兑换详情
  changedetail(){
    my.navigateTo({
      url:'/package_my/pages/coupon/changedetails/changedetails'
    })
  }
});
