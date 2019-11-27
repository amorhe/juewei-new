import { imageUrl, ak, geotable_id } from '../../../../pages/common/js/baseUrl'
import { gd_decrypt, bd_encrypt } from '../../../../pages/common/js/map'
const app = getApp();
Page({
  data: {
    imageUrl,
    mapiconInfo: '',
    mapInfo: [],
    latitude: '',
    longitude: '',
    list: [],
    city: '',
    addressIng: '',    // 定位地址
    nearAddress: [],   // 附近地址
    isSuccess: false,
    info: '',   // 一条地址信息
    inputAddress: '',  //手动输入的地址
    loginOpened: false,
    addressList: [],
    addressList_poi:[],//poi数据
    currentPos: '',
    noSearchResult: false,
    mapCtx: {},
    movePosFlag: false,
    isSearch: false
  },
  onLoad() {
    this.getLocation();
    // let bol = my.canIUse('map.optimize');
    // if (bol) {
    //   this.getLocation();
    // } else {
    //   my.alert({
    //     content:'支付宝版本过低，请升级新版本！',
    //     success:() => {
    //       my.navigateBack();
    //     }
    //   })
    // }
  },
  onReady(e) {
    // 使用 my.createMapContext 获取 map 上下文
    this.setData({
      mapCtx: my.createMapContext('map')
    })
    this.mapCtx = my.createMapContext('map');
    this.data.mapCtx.gestureEnable({ isGestureEnable: 1 });
    // 为了使初始化时只执行一遍
    setTimeout(() => {
      this.setData({
        movePosFlag: true
      })
    }, 1000)
  },
  //获取当前定位地址信息
  getLocation() {
    var that = this
    my.getLocation({
      type: 3,
      success(res) {
        my.hideLoading();
        let currentPos = res.pois[0] ? res.pois[0].name : currentPos;
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          city: res.city,
          currentPos: currentPos,
          addressList: [],//这里地址不能是支付宝的高德地图的
          addressList_poi:[]
        });
        //获取附近的绝味鸭脖门店显示
        that.setIcon(res.longitude, res.latitude);
        let baiduPos = bd_encrypt(res.longitude, res.latitude);// 百度经纬度
        //获取附近的poi信息
        let url = `https://api.map.baidu.com/reverse_geocoding/v3/?ak=${ak}&output=json&coordtype=bd09ll&location=${baiduPos.bd_lat},${baiduPos.bd_lng}&extensions_poi=1`;
        url = encodeURI(url);
        my.request({
          url,
          success: (res) => {
            if (res.data.status === 0) {
              let result = res.data.result.pois;
              let addressComponent = res.data.result.addressComponent
              // 无数据显示无数据页面
              if (result.length === 0) {
                that.setData({
                  noSearchResult: true
                })
              }
              result.forEach(item => {
                item.province = addressComponent.province,
                  item.city = addressComponent.city,
                  item.district = addressComponent.district
                item.location = {
                  lng: item.point.x,
                  lat: item.point.y
                }
              })
              that.setData({
                addressList_poi: result,
                noSearchResult: false
              })
            }
          },
        });
      },
      fail() {
        my.hideLoading();
        my.alert({ title: '定位失败' });
      },
    })
  },
  // 切换城市
  choosecityTap() {
    my.chooseCity({
      showLocatedCity: true,
      showHotCities: true,
      success: (res) => {
        if (res.city.indexOf('市') == res.city.length - 1) {
          this.setData({
            city: res.city
          })
        } else {
          this.setData({
            city: res.city + '市'
          })
        }
      },
    });
  },
  scrollToLower() {

    // this.setData({
    //   isSearch: true
    // })
  },
  //通过经纬度设置地图上的点位置附近2000米绝味鸭脖的门店
  setIcon(long, lat) {
    // 从地图中获取的和往地图中设置的都是高德经纬度，接口调用和后台存储的都是百度的经纬度，在使用中要注意转换
    var that = this
    let baiduPos = bd_encrypt(long, lat);// 百度经纬度
    my.request({
      url: 'https://api.map.baidu.com/geosearch/v3/nearby?ak=' + ak + '&geotable_id=' + geotable_id + '&location=' + baiduPos.bd_lng + ',' + baiduPos.bd_lat + '&radius=2000',
      success: (res) => {
        // 设置定位位置的图标
        if (!this.data.sysInfo) {
          let sysInfo = my.getSystemInfoSync();
          this.setData({
            sysInfo: sysInfo
          })
        }
        let windowWidth = this.data.sysInfo.windowWidth;
        let windowHeight = this.data.sysInfo.windowHeight;
        var arr = [
          {
            iconPath: imageUrl + 'position.png',
            latitude: lat,// 高德经纬度
            longitude: long,
            width: 32,
            height: 32
          }
        ]
        // 设置门店的图标
        res.data.contents.forEach(item => {
          var obj = {}
          obj.iconPath = imageUrl + 'position.png'
          let gdPos = gd_decrypt(item.location[0], item.location[1])
          obj.latitude = gdPos.lat;
          obj.longitude = gdPos.lng;
          obj.width = 20
          obj.height = 20
          arr.push(obj)
        })
        that.setData({
          mapInfo: arr
        })
      },
    });
  },

  // 输入事件
  searchInput(e) {
    if (e.detail.value == '') {
      this.setData({
        inputAddress:'',
        noSearchResult: false,
        isSearch: false
      })
      return
    }
    this.setData({
      inputAddress: e.detail.value
    })
    //搜索
    this.searchAddress();
  },
  // 搜索
  searchAddress() {
    let url = `https://api.map.baidu.com/place/v2/search?query=${this.data.inputAddress}&region=${this.data.city}&output=json&ak=${ak}`;
    url = encodeURI(url);
    my.request({
      url,
      success: (res) => {
        if (res.data.status === 0) {
          let result = res.data.results;
          // 无数据显示无数据页面
          if (result.length === 0) {
            this.setData({
              noSearchResult: true,
              isSearch: true
            })
            return
          }
          this.setData({
            addressList: result,
            noSearchResult: false,
            isSearch: true
          })
        }
        // 搜索到的位置
        // let centerPos = res.data.results[0];
        // if (centerPos) {
        //   const gd_pos = gd_decrypt(centerPos.location.lng, centerPos.location.lat);
        //   this.setData({
        //     longitude: gd_pos.lng,
        //     latitude: gd_pos.lat
        //   });
        //   this.setIcon(centerPos.location.lng, centerPos.location.lat);
        // }
      },
      fail: (e) => {
          this.setData({
            addressList: [],
            noSearchResult: false,
            isSearch: true
          })
      }
    });
  },
  chooseAdress(e) {
    let { pos } = e.currentTarget.dataset;
    app.globalData.addAddressInfo = pos;
    my.navigateBack();
  },
  //选择地图上的点，或者拖动地图后
  mapTap(e) {
    let that = this;
    if (!this.data.movePosFlag) { return; }
    if (e.type == 'end' || e.type == 'tap') {
      let newLat = e.latitude;
      let newLng = e.longitude;
      //将周边的门店显示到地图上
      that.setIcon(e.longitude, e.latitude);
      //转换成百度的
      let baiduPos = bd_encrypt(e.longitude, e.latitude);
      this.mapCtx.updateComponents({
        longitude: e.longitude,
        latitude: e.latitude,
      });
      //获取附近的poi信息
      let url = `https://api.map.baidu.com/reverse_geocoding/v3/?ak=${ak}&output=json&coordtype=bd09ll&location=${baiduPos.bd_lat},${baiduPos.bd_lng}&extensions_poi=1`;
      url = encodeURI(url);
      my.request({
        url,
        success: (res) => {
          if (res.data.status === 0) {
            let result = res.data.result.pois;
            let addressComponent = res.data.result.addressComponent
            // 无数据显示无数据页面
            if (result.length === 0) {
              this.setData({
                noSearchResult: true
              })
            }
            result.forEach(item => {
              item.province = addressComponent.province,
                item.city = addressComponent.city,
                item.district = addressComponent.district
              item.location = {
                lng: item.point.x,
                lat: item.point.y
              }
            })
            this.setData({
              addressList_poi: result,
              noSearchResult: false
            })
          }
        },
      });
    }
  },
});
