import {imageUrl,ak} from '../../../pages/common/js/baseUrl'
import {NearbyShop} from '../../../pages/common/js/home'
import {guide} from '../../../pages/common/js/li-ajax'
var app = getApp();
Page({
  data: {
    imageUrl,
    // 地图中心点
    // longitude: 116.54828,
    // latitude: 39.918639,
    longitude: my.getStorageSync({key:'lng'}).data,
    latitude: my.getStorageSync({key:'lat'}).data,
    markersArray:[],
    shopList:[],    // 附近门店列表
    inputAddress:'',
    city:'',
    activeIndex:0
  },
  guide,
  onLoad() {
    const lng = my.getStorageSync({key:'lng'}).data;
    const lat = my.getStorageSync({key:'lat'}).data;
    this.nearShop(lng,lat);
  },
  // 输入
  handleSearch(e){
    this.setData({
      inputAddress:e.detail.value
    })
  },
  // 搜索
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
  // 切换门店
  switchShop(e){
    let arr = this.data.markersArray.map((item,index) => {
      if(index == e.currentTarget.dataset.index) {
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
    this.setData({
      markersArray:arr,
      activeIndex:e.currentTarget.dataset.index
    })
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
    app.globalData.isSelf = true;
    app.globalData.shopIng = e.currentTarget.dataset.info
    my.switchTab({
      url: '/pages/home/goodslist/goodslist', // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
      success: (res) => {
        
      },
    });
    // my.navigateTo({
    //   url: '/pages/home/selfshop/selfshop?shop_id=' + e.currentTarget.dataset.shop_id + '&company_id=' + e.currentTarget.dataset.company_id + '&title=' + e.currentTarget.dataset.title + '&address=' + e.currentTarget.dataset.address + '&goods_num=' + e.currentTarget.dataset.goods_num + '&distance=' + e.currentTarget.dataset.distance 
    // });
  },
  // 切换城市
  choosecityTap(){
    my.chooseCity({
      showLocatedCity:true,
      showHotCities:true,
      success: (res) => {
        this.setData({
          city
        })
      },
    });
  },
});
