import {imageUrl} from '../../../../pages/common/js/baseUrl'
import {couponsList} from '../../../../pages/common/js/home'
import {formatTime} from '../../../../pages/common/js/time'
import { getSid, log, ajax } from '../../../../pages/common/js/li-ajax'
Page({
  data: {
    imageUrl,
    couponList:[],
    open2: false,
    codeImg: '',
  },
  onLoad() {
    const _sid = my.getStorageSync({key: '_sid'}).data;
    this.getCouponsList(_sid);
  },
  getCouponsList(_sid){
    couponsList(_sid,'history').then((res) => {
      res.DATA.used.forEach(item => {
        item.start_time = formatTime(item.start_time,'Y-M-D');
        item.end_time = formatTime(item.end_time,'Y-M-D');
      })
      this.setData({
        couponList:res.DATA.used,
        tabs:this.data.tabs
      })
    })
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
