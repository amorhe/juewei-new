import {imageUrl,ak} from '../../common/js/baseUrl'
import {useraddress} from '../../common/js/home'
import {bd_encrypt} from '../../common/js/map'
var app = getApp();
Page({
  data: {
    imageUrl,
    city:'',
    addressIng:'',
    canUseAddress:[],
    nearAddress:[]
  },
  onLoad() {
    if(app.globalData.address){
      this.setData({
        city: app.globalData.city,
        addressIng: app.globalData.address
      })
      const _sid = my.getStorageSync({key: '_sid'}).data;
      const lng = my.getStorageSync({key: 'lng'}).data;
      const lat = my.getStorageSync({key: 'lat'}).data;
      const location = `${lng},${lat}`;
      this.getAddressList(_sid,location,lat,lng);
    }
  },
  // 切换城市
  choosecityTap(){
    my.chooseCity({
      showLocatedCity:true,
      showHotCities:true,
      success: (res) => {
        console.log(res)
      },
    });
  },
  // 地址列表
  getAddressList(_sid,location,lat,lng){
    useraddress(_sid,'normal',location).then((res) => {
      let arr1 = [];
      if(res.length>0){
         arr1 = res.filter(item => item.user_address_is_dispatch == 1)
      }
      // 百度附近POI
      let str = `https://api.map.baidu.com/place/v2/search?query=房地产$金融$公司企业$政府机构$医疗$酒店$美食$生活服务$教育培训$交通设施&location=${lat},${lng}&radius=1000&output=json&page_size=50&page_num=0&ak=${ak}`;
      str = encodeURI(str);
      my.request({
        url: str,
        success: (res) => {
          console.log(res.data.results)
          this.setData({
            nearAddress:res.data.results
          })
        },
      });
      this.setData({
        canUseAddress: arr1
      })
    })
  },
  // 重新定位
  rePosition(){
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
        app.globalData.province = res.province;
        app.globalData.city = res.city;
        app.globalData.address1 = res.streetNumber.street;
        app.globalData.address2 = res.streetNumber.number;
        that.setData({
          city:res.city,
          addressIng: res.streetNumber.street + res.streetNumber.number
        })
      }
    })
  },
  switchAddress(e){
    console.log(e)
    const mapPosition = bd_encrypt(e.currentTarget.dataset.info.location.lng,e.currentTarget.dataset.info.location.lat);
    my.setStorageSync({
        key: 'lat', // 缓存数据的key
        data: mapPosition.bd_lat, // 要缓存的数据
      });
    my.setStorageSync({
      key: 'lng', // 缓存数据的key
      data: mapPosition.bd_lng, // 要缓存的数据
    });
    app.globalData.province = e.currentTarget.dataset.info.province;
    app.globalData.city = e.currentTarget.dataset.info.city;
    app.globalData.address = e.currentTarget.dataset.info.name;
    my.switchTab({
      url: '/pages/home/goodslist/goodslist', // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
    });
  }

});
