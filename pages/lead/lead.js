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
        app.globalData.address1 = res.streetNumber.street;
        app.globalData.address2 = res.streetNumber.number;
        that.setData({
          city:res.city
        },()=> {
           my.switchTab({
            url: '/pages/home/goodslist/goodslist'
          })
        })
        /* that对象为Page可以设置数据刷新界面
        that.setData({
          hasLocation: true,
          location: formatLocation(res.longitude, res.latitude)
        })
        */
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
