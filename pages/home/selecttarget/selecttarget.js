import {imageUrl} from '../../common/js/baseUrl'
import {useraddress} from '../../common/js/home'
import {bd_encrypt} from '../../common/js/map'
var app = getApp();
Page({
  data: {
    imageUrl,
    city:'',
    addressIng:'',
    canUseAddress:[],
    noUseAddress:[]
  },
  onLoad() {
    if(app.globalData.address2){
      this.setData({
        city: app.globalData.city,
        addressIng: app.globalData.address1 + app.globalData.address2
      })
      const _sid = my.getStorageSync({key: '_sid'}).data;
      const lng = my.getStorageSync({key: 'lng'}).data;
      const lat = my.getStorageSync({key: 'lat'}).data;
      const location = `${lng},${lat}`;
      this.getAddressList(_sid,location)
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
  getAddressList(_sid,location){
    useraddress(_sid,'normal',location).then((res) => {
      let arr1 = res.filter(item => item.user_address_is_dispatch == 1)
      this.setData({
        canUseAddress: arr1
      })
    })
  },
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
  }
});
