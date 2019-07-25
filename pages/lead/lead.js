import {imageUrl} from '../common/js/baseUrl'
import {bd_encrypt} from '../common/js/map'
var app = getApp();

Page({
  data: {
    imageUrl:imageUrl,
    city:'定位中...'
  },
  onLoad() {
    var that = this;
    my.getLocation({
      type:2,
      success(res) {
        my.hideLoading();
        const mapPosition = bd_encrypt(res.longitude,res.latitude);
        my.setStorageSync({
          key: 'lat', // 缓存数据的key
          data: mapPosition.bd_lat, // 要缓存的数据
        });
        my.setStorageSync({
          key: 'lng', // 缓存数据的key
          data: mapPosition.bd_lng, // 要缓存的数据
        });
        console.log(res)
        app.globalData.province = res.province;
        app.globalData.city = res.city;
        app.globalData.address1 = res.streetNumber.street;
        app.globalData.address2 = res.streetNumber.number;
        that.setData({
          city:res.city
        },()=> {
           my.switchTab({
            url: '/pages/home/goodslist/goodslist'
          })
        })
      },
      fail() {
        my.hideLoading();
        my.navigateTo({
          url: '/pages/position/position'
        })
      },
    })
  },
});
