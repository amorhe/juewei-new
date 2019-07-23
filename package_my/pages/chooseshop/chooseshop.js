import { imageUrl } from '../../../pages/common/js/baseUrl'
var app = getApp();
Page({
  data: {
    imageUrl,
     // 地图中心点
    // longitude: 116.54828,
    // latitude: 39.918639,
    longitude: my.getStorageSync({key:'lng'}).data,
    latitude: my.getStorageSync({key:'lat'}).data,
    markersArray: [
      {
        longitude: 116.30051,
        latitude: 39.918639,
        iconPath: `${imageUrl}position_map1.png`,
        width: 32,
        height: 32
      },
      {
        longitude: 116.3005,
        latitude: 39.918639,
        iconPath: `${imageUrl}position_map1.png`,
        width: 15,
        height: 15
      }
    ],
    shopList: [],   //门店列表
    type:''
  },
  onLoad(e) {
    //  外卖
    let data;
    if (e.type == 1) {
      data = my.getStorageSync({ key: 'takeout' }).data
    }
    //  自提
    if (e.type == 2) {
      data = my.getStorageSync({ key: 'self' }).data;
    }
    console.log(data);
    let arr = data
    .map(({ location }) => ({
      longitude: location[0],
      latitude: location[1]
    }))
    .map((item,index)=>{
      if (index === 0) {
        return {
          ...item,
          iconPath: `${imageUrl}position_map1.png`,
          width: 32,
          height: 32
        }
      }else{
        return {
          ...item,
          iconPath: `${imageUrl}position_map1.png`,
          width: 15,
          height: 15
        }
      }
    })
    console.log(arr)
    this.setData({
      shopList: data,
      markersArray: arr,
      type:e.type
    })
  },
  // 选择门店
  chooseshop(e) {
    app.globalData.shop_id = e.currentTarget.dataset.id;   //商店id
    app.globalData.type = this.data.type    //外卖自提
    my.switchTab({ 
      url: '/pages/home/goodslist/goodslist'
    })
  }
});
