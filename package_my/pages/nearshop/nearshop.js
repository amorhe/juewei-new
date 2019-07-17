import {imageUrl,ak} from '../../../pages/common/js/baseUrl'
import {MyNearbyShop} from '../../../pages/common/js/home'
Page({
  data: {
    imageUrl,
    // 地图中心点
    longitude: 116.54828,
    latitude: 39.918639,
    // longitude: my.getStorageSync({key:'lng'}).data,
    // latitude: my.getStorageSync({key:'lat'}).data,
    markersArray:[
      {
        longitude: 116.30051,
        latitude: 40.0511,
        iconPath:`${imageUrl}position_map1.png`,
        width: 32,
        height: 32
      },
      {
        longitude: 116.3005,
        latitude: 40.054,
        iconPath:`${imageUrl}position_map1.png`,
        width: 15,
        height: 15
      }
    ],
    shopList:[],    // 附近门店列表
  },
  onLoad() {
    this.nearShop();
  },
  // 获取附近门店
  nearShop(){
    const lng = 116.54828;
    const lat = 39.918639;
    my.request({
      url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=134917&location=${lng}%2C${lat}&ak=${ak}&radius=3000&sortby=distance%3A1&_=1504837396593&page_index=0&page_size=50&_=1563263791821`,
      success: (res) => {
        const obj = res.data.contents;
        MyNearbyShop(JSON.stringify(obj)).then((conf) => {
          console.log(conf)
          let arr = conf
          .map(({location}) => ({
            longitude: location[0],
            latitude: location[1]
          }))
          .map((item,index) => {
            if(index == 0) {
              return {
                ...item,
                iconPath:`${imageUrl}position_map1.png`,
                width: 32,
                height: 32
              }
            }else{
              return {
              ...item,
                iconPath:`${imageUrl}position_map1.png`,
                width: 15,
                height: 15
              }
            }
          })
          console.log(arr);
          this.setData({
            markersArray: arr,
            shopList: conf
          })


        })
      },
    });
  }
});
