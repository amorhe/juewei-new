import {imageUrl,imageUrl2} from '../../../../pages/common/js/baseUrl'
import {exchangeCode} from '../../../../pages/common/js/home'
Page({
  data: {
    imageUrl,
    imageUrl2,
    exchageArr:[]
  },
  onLoad() {
    const _sid = my.getStorageSync({key: '_sid'}).data;
    this.getExchangeCode(_sid);
  },
  getExchangeCode(_sid){
    exchangeCode(_sid,'history').then((res) => {
      this.setData({
        exchageArr:res.DATA
      })
    })
  },
});
