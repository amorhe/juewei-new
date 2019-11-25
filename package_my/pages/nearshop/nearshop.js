import { imageUrl, ak, geotable_id } from '../../../pages/common/js/baseUrl'
import { MyNearbyShop } from '../../../pages/common/js/home'
import { guide } from '../../../pages/common/js/li-ajax'
import { cur_dateTime } from '../../../pages/common/js/time'
import { gd_decrypt} from '../../../pages/common/js/map'
var app = getApp();
Page({
  data: {
    imageUrl,
    // 地图中心点
    longitude: '',
    latitude: '',
    markersArray: [],
    shopList: [],    // 附近门店列表
    inputAddress: '',
    city: '',
    activeIndex: 0
  },
  guide,
  onLoad() {
    const lng = my.getStorageSync({ key: 'lng' }).data;
    const lat = my.getStorageSync({ key: 'lat' }).data;
    let ott = gd_decrypt(lng,lat);
    this.nearShop(lng, lat);
    this.setData({
      longitude: ott.lng,
      latitude: ott.lat-0.04,
      selfshop: false
    })
  },
  onShow() {

  },
  // 输入
  handleSearch(e) {
    this.setData({
      inputAddress: e.detail.value
    })
  },
  // 搜索
  addressSearch() {
    let url = `https://api.map.baidu.com/geocoding/v3/?address=${this.data.city}${this.data.inputAddress}&city=${this.data.city}&output=json&ak=${ak}`
    url = encodeURI(url);
    my.request({
      url,
      success: (res) => {
        my.hideKeyboard();
        const lng = res.data.result.location.lng;
        const lat = res.data.result.location.lat;
        this.nearShop(lng, lat);
        let ott = gd_decrypt(lng,lat);
        this.setData({
          longitude:ott.lng,
          latitude:ott.lat-0.04
        })
      },
    });
  },
  // 切换门店
  switchShop(e) {
    let arr = this.data.markersArray.map((item, index) => {
      if (index == e.currentTarget.dataset.index) {
        return {
          ...item,
          iconPath: `${imageUrl}position_map1.png`,
          markerLevel:10,
          width: 32,
          height: 32
        }
      } else {
        return {
          ...item,
          iconPath: `${imageUrl}position_map1.png`,
          markerLevel:9,
          width: 15,
          height: 15
        }
      }
    })
    this.setData({
      markersArray: arr,
      activeIndex: e.currentTarget.dataset.index
    })
  },
  // 获取附近门店
  nearShop(lng, lat) {
    my.request({
      url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=${geotable_id}&location=${lng}%2C${lat}&ak=${ak}&radius=3000&sortby=distance%3A1&page_index=0&page_size=50&_=`,
      success: (res) => {
        const obj = res.data.contents;
        MyNearbyShop(JSON.stringify(obj)).then((conf) => {
            conf.forEach(item => {
              if (cur_dateTime(item.start_time, item.end_time) != 2) {
                item['isOpen'] = true
              }
            })
            let arr = conf
            .map(({ shop_gd_latitude,shop_gd_longitude}) => ({
              longitude: shop_gd_longitude,
              latitude: shop_gd_latitude
            }))
            .map((item, index) => {
              if (index == 0) {
                return {
                  ...item,
                  iconPath: `${imageUrl}position_map1.png`,
                  markerLevel:10,
                  width: 32,
                  height: 32
                }
              } else {
                return {
                  ...item,
                  iconPath: `${imageUrl}position_map1.png`,
                  markerLevel:9,
                  width: 15,
                  height: 15
                }
              }
            })
            this.setData({
              markersArray: arr,
              shopList: conf,
              city:conf[0].city
            })
        })
      },
    });
  },
  // 去自提
  goSelf(e) {
    app.globalData.isSelf = true;
    app.globalData.shopIng = e.currentTarget.dataset.info;
    app.globalData.type = 2;
    my.navigateTo({
      url: '/pages/home/goodslist/goodslist', // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
      success: (res) => {

      },
    });
  },
  onUnload() {//退出后销毁
    app.globalData.isSelf = false;
    app.globalData.shopIng = null;
  },
  // 切换城市
  choosecityTap() {
    my.chooseCity({
      showLocatedCity: true,
      showHotCities: true,
      success: (res) => {
        this.setData({
          city:res.city + '市'
        })
      },
    });
  },
});
