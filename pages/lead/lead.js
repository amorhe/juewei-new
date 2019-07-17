import {imageUrl} from '../common/js/baseUrl'
import {bd_encrypt} from '../common/js/map'

Page({
  data: {
    imageUrl:imageUrl
  },
  onLoad() {
    my.getLocation({
      type:2,
      success(res) {
        my.hideLoading();
        const mapPosition = bd_encrypt(res.longitude,res.latitude)
        my.setStorageSync({
          key: 'lat', // 缓存数据的key
          data: mapPosition.bd_lat, // 要缓存的数据
        });
        my.setStorageSync({
          key: 'lng', // 缓存数据的key
          data: mapPosition.bd_lng, // 要缓存的数据
        });
        my.redirectTo({
          url: '/pages/home/goodslist/goodslist?address1=' + res.streetNumber.street + '&address2=' + res.streetNumber.number
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
