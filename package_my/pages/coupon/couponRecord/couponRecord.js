import {imageUrl} from '../../../../pages/common/js/baseUrl'
import {couponsList} from '../../../../pages/common/js/home'
import {formatTime} from '../../../../pages/common/js/time'
Page({
  data: {
    imageUrl,
    couponList:[]
  },
  onLoad() {
    const _sid = my.getStorageSync({key: '_sid'}).data;
    this.getCouponsList(_sid);
  },
  getCouponsList(_sid){
    couponsList(_sid,'history').then((res) => {
      res.DATA.use.forEach(item => {
        item.start_time = formatTime(item.start_time,'Y-M-D');
        item.end_time = formatTime(item.end_time,'Y-M-D');
      })
      this.setData({
        couponList:res.DATA.use,
        tabs:this.data.tabs
      })
    })
  }
});
