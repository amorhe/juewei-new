import {imageUrl} from '../common/js/baseUrl'

Page({
  data: {
    imageUrl:imageUrl
  },
  onLoad() {
    my.getLocation({
      type:1,
      success(res) {
        my.hideLoading();
        console.log(res);
        my.setStorageSync({
          key: 'lat', // 缓存数据的key
          data: res.latitude, // 要缓存的数据
        });
        my.setStorageSync({
          key: 'lng', // 缓存数据的key
          data: res.longitude, // 要缓存的数据
        });
        my.navigateTo({
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
