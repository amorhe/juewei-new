import { imageUrl } from '../../../pages/common/js/baseUrl'
var app = getApp();
Page({
  data: {
    imageUrl,
     // 地图中心点
    longitude: my.getStorageSync({key:'lng'}).data,
    latitude: my.getStorageSync({key:'lat'}).data,
    markersArray: [],
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
    let hI =0;
    if(app.globalData.hI){
      hI = app.globalData.hI
    }
    let arr = data
    .map(({ location }) => ({
      longitude: location[0],
      latitude: location[1]
    }))
    .map((item,index)=>{
      if (index === hI) {
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
    this.setData({
      shopList: data,
      markersArray: arr,
      type:e.type
    })
  },
  // 选择门店
  chooseshop(e) {
    app.globalData.shop_id = e.currentTarget.dataset.id;   //商店id
    app.globalData.type = this.data.type;    //外卖自提
    app.globalData.hI = e.currentTarget.dataset.index;
    app.globalData.shopIng = e.currentTarget.dataset.shopIng;
    my.switchTab({ 
      url: '/pages/home/goodslist/goodslist'
    })
  },
});
