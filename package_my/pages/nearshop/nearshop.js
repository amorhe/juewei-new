import {imageUrl,ak} from '../../../pages/common/js/baseUrl'
import {NearbyShop} from '../../../pages/common/js/home'
import {guide} from '../../../pages/common/js/li-ajax'
Page({
  data: {
    imageUrl,
    // 地图中心点
    // longitude: 116.54828,
    // latitude: 39.918639,
    longitude: my.getStorageSync({key:'lng'}).data,
    latitude: my.getStorageSync({key:'lat'}).data,
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
    inputAddress:'',
    city:''
  },
  onLoad() {
    const lng = my.getStorageSync({key:'lng'}).data;
    const lat = my.getStorageSync({key:'lat'}).data;
    this.nearShop(lng,lat);
  },
  handleSearch(e){
    this.setData({
      inputAddress:e.detail.value
    })
  },
  addressSearch(){
    let url = `https://api.map.baidu.com/geocoding/v3/?address=${this.data.city}${this.data.inputAddress}&output=json&ak=${ak}`
    url = encodeURI(url);
    my.request({
      url,
      success: (res) => {
        console.log(res)
        my.hideKeyboard();
        const lng = res.data.result.location.lng;
        const lat = res.data.result.location.lat;
        this.nearShop(lng,lat);
      },
    });
  },
  // 获取附近门店
  nearShop(lng,lat){
    my.request({
      url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=134917&location=${lng}%2C${lat}&ak=${ak}&radius=3000&sortby=distance%3A1&_=1504837396593&page_index=0&page_size=50&_=1563263791821`,
      success: (res) => {
        const obj = res.data.contents;
        NearbyShop(JSON.stringify(obj)).then((conf) => {
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
  },
  // 去自提
  goSelf(e){
    my.navigateTo({
      url: '/pages/home/selfshop/selfshop?shop_id=' + e.currentTarget.dataset.shop_id + '&company_id=' + e.currentTarget.dataset.company_id + '&title=' + e.currentTarget.dataset.title + '&address=' + e.currentTarget.dataset.address + '&goods_num=' + e.currentTarget.dataset.goods_num + '&distance=' + e.currentTarget.dataset.distance 
    });
  },
  // 切换城市
  choosecityTap(){
    my.chooseCity({
      showLocatedCity:true,
      showHotCities:true,
      success: (res) => {
        console.log(res)
        this.setData({
          city
        })
      },
    });
  },
});
