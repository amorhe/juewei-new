import { imageUrl } from '../../../pages/common/js/baseUrl'
import { gd_decrypt } from '../../../pages/common/js/map'
var app = getApp();
Page({
  data: {
    imageUrl,
    longitude: 0,// 地图中心点
    latitude: 0,
    markersArray: [],
    shopList: [],   //门店列表
    type: ''
  },
  onLoad(e) {
    app.globalData.switchClick = true;
    //  外卖
    let data;
    if (e.type == 1) {
      data = my.getStorageSync({ key: 'takeout' }).data
    }
    //  自提
    if (e.type == 2) {
      data = my.getStorageSync({ key: 'self' }).data;
    }
    let hI = 0;
    if (app.globalData.hI) {
      hI = app.globalData.hI
    }
    let arr = data
      .map(({ shop_gd_latitude,shop_gd_longitude }) => ({
        longitude: shop_gd_longitude,
        latitude: shop_gd_latitude
      }))
      .map((item, index) => {
        if (index === hI) {
          return {
            ...item,
            iconPath: `${imageUrl}position_map1.png`,
            width: 32,
            height: 32
          }
        } else {
          return {
            ...item,
            iconPath: `${imageUrl}position_map1.png`,
            width: 15,
            height: 15
          }
        }
      })
    this.setData({
      shopList: data,
      markersArray: arr,
      type: e.type
    })
  },
  // 选择门店
  chooseshop(e) {
    // console.log(e)
    app.globalData.shop_id = e.currentTarget.dataset.id;   //商店id
    app.globalData.type = this.data.type;    //外卖自提
    app.globalData.hI = e.currentTarget.dataset.index;
    app.globalData.shopIng = e.currentTarget.dataset.shopIng;
    app.globalData.position.cityAdcode = e.currentTarget.dataset.shopIng.city_id;
    app.globalData.position.districtAdcode = e.currentTarget.dataset.shopIng.district_id;
    app.globalData.switchClick = null
    my.navigateBack({ //由于商城首页选用的是navigate  所以这里需要用返回
      url: '/pages/home/goodslist/goodslist'
    })
  },
  onShow() {
    let ott = gd_decrypt(my.getStorageSync({ key: 'lng' }).data, my.getStorageSync({ key: 'lat' }).data)
    this.setData({
      longitude: ott.lng,
      latitude: ott.lat,
    })
  }
});
