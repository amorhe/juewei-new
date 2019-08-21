import { imageUrl, ak, geotable_id } from '../../common/js/baseUrl'
import { addressList, GetLbsShop, NearbyShop } from '../../common/js/home'
import { bd_encrypt } from '../../common/js/map'
import { cur_dateTime, compare, sortNum } from '../../common/js/time'
var app = getApp();
Page({
  data: {
    imageUrl,
    city: '',      //城市
    addressIng: '',    // 定位地址
    canUseAddress: [],   // 我的地址
    nearAddress: [],   // 附近地址
    isSuccess: false,
    info: '',   // 一条地址信息
    inputAddress: '',  //手动输入的地址
    loginOpened: false
  },
  onLoad(e) {
    console.log(app.globalData)
    if (e.type) {
      this.setData({
        isSuccess: true,
        city: app.globalData.city,
        addressIng: app.globalData.address
      })
    }
  },
  onShow() {
    const _sid = my.getStorageSync({ key: '_sid' }).data;
    //获取用户收货地址,一次性获取下来
    if(_sid){
        addressList(_sid, 'normal', location).then((res) => {
          let arr1 = [];
          if (res.data.length > 0) {
            arr1 = res.data.filter(item => item.user_address_is_dispatch == 1)
          }
          this.setData({
            canUseAddress: arr1
          })
        });
    }

    if (app.globalData.address) {
      const lng = my.getStorageSync({ key: 'lng' }).data;
      const lat = my.getStorageSync({ key: 'lat' }).data;
      const location = `${lng},${lat}`;
      this.getAddressList(location, lat, lng);
    }
  },
  // 切换城市
  choosecityTap() {
    my.chooseCity({
      showLocatedCity: true,
      showHotCities: true,
      success: (res) => {
        // console.log(res)
        this.setData({
          city: res.city + '市'
        })
      },
    });
  },
  handleSearch(e) {
    this.setData({
      inputAddress: e.detail.value
    })
  },
  // 输入地址搜索门店
  searchShop() {
    let that= this;
    //附近地址列表
    if(this.data.city+this.data.inputAddress!='' ){
      let url = `https://api.map.baidu.com/geocoding/v3/?address=${this.data.city}${this.data.inputAddress}&output=json&ak=${ak}`
      url = encodeURI(url);
      my.request({
        url,
        success: (res) => {
            my.hideKeyboard();
            const lng = res.data.result.location.lng;
            const lat = res.data.result.location.lat;
            const location = `${lng},${lat}`;
            that.getAddressList(location, lat, lng);
        },
      });
    }
  },
  //附近地址列表
  getAddressList(location, lat, lng) {
    // 百度附近POI
    let str = `https://api.map.baidu.com/place/v2/search?query=房地产$金融$公司企业$政府机构$医疗$酒店$美食$生活服务$教育培训$交通设施&location=${lat},${lng}&radius=1000&output=json&page_size=50&page_num=0&ak=${ak}`;
    str = encodeURI(str);
    my.request({
      url: str,
      success: (res) => {
        if (res.data.status == 0) {
          this.setData({
            nearAddress: res.data.results
          })
        } else {
          this.setData({
            nearAddress: []
          })
        }
      },
      fail: (rej) => {
        this.setData({
          nearAddress: []
        })
      }
    });

  },
  // 重新定位
  rePosition() {
    var that = this;
    my.getLocation({
      type: 3,
      success(res) {
        // console.log(res)
        my.hideLoading();
        const mapPosition = bd_encrypt(res.longitude, res.latitude);
        my.setStorageSync({
          key: 'lat', // 缓存数据的key
          data: mapPosition.bd_lat, // 要缓存的数据
        });
        my.setStorageSync({
          key: 'lng', // 缓存数据的key
          data: mapPosition.bd_lng, // 要缓存的数据
        });
        app.globalData.address = res.pois[0].name;
        app.globalData.position = res;
        my.showToast({
          content: '定位成功！'
        })
        that.setData({
          city: res.city,
          addressIng: res.pois[0].name,
          info: res,
          isSuccess: true
        })
      },
      fail() {
        that.setData({
          isSuccess: false
        })
      }
    })
  },
  //选择附近地址
  switchAddress(e) {
    //手动定位没有地址
    if (e.currentTarget.dataset.type=='1' && !this.data.isSuccess && e.currentTarget.dataset.address == '') {
      my.showToast({
        content: '定位失败，请选择其他收货地址！'
      });
      return
    }
    //手动定位获得了地址
    //这里分两种情况1原先不变地址，2重新定位后地址
    // if (e.currentTarget.dataset.type=='1' && this.data.isSuccess && e.currentTarget.dataset.address != '') {
    //   //需要重新获得外卖，和自提门店
    //   //这里没有做
    //   my.switchTab({
    //     url: '/pages/home/goodslist/goodslist'
    //   });
    //   return
    // }
    //定位失败
    let mapPosition = '';
    switch (parseInt(e.currentTarget.dataset.type)) {
      case 1:
        mapPosition = bd_encrypt(e.currentTarget.dataset.info.longitude, e.currentTarget.dataset.info.latitude);
        break;
      case 3:
        mapPosition = bd_encrypt(e.currentTarget.dataset.info.location.lng, e.currentTarget.dataset.info.location.lat);
    }
    my.setStorageSync({
      key: 'lat', // 缓存数据的key
      data: mapPosition.bd_lat, // 要缓存的数据
    });
    my.setStorageSync({
      key: 'lng', // 缓存数据的key
      data: mapPosition.bd_lng, // 要缓存的数据
    });
    console.log(e)
    app.globalData.position = e.currentTarget.dataset.info;
    let address = '';
    if(e.currentTarget.dataset.type==1){
      address = e.currentTarget.dataset.address;
    }else{
      address = e.currentTarget.dataset.info.name;
    }
    this.getLbsShop(mapPosition.bd_lng, mapPosition.bd_lat, address);
    this.getNearbyShop(mapPosition.bd_lng, mapPosition.bd_lat, address)
  },
  // 选择我的收货地址
  switchPositionAddress(e) {
    // console.log(e)
    let position = e.currentTarget.dataset.info.user_address_lbs_baidu.split(',');
    my.setStorageSync({
      key: 'lat', // 缓存数据的key
      data: position[1], // 要缓存的数据
    });
    my.setStorageSync({
      key: 'lng', // 缓存数据的key
      data: position[0] // 要缓存的数据
    });
    app.globalData.position = e.currentTarget.dataset.info;
    console.log('e.currentTarget.dataset.info',e.currentTarget.dataset.info);
    this.getLbsShop(position[0], position[1], e.currentTarget.dataset.info.user_address_map_addr);
    this.getNearbyShop(position[0], position[1], e.currentTarget.dataset.info.user_address_map_addr)
  },
  // 外卖附近门店
  getLbsShop(lng, lat, address) {
    let that=this;
    const location = `${lng},${lat}`
    const shopArr1 = [];
    const shopArr2 = [];
    app.globalData.address = address;
    GetLbsShop(location).then((res) => {
      // console.log(res)
      if (res.code == 0 && res.data.length > 0) {
        for (let i = 0; i < res.data.length; i++) {
          const status = cur_dateTime(res.data[i].start_time, res.data[i].end_time);
          app.globalData.isOpen = status
          // 判断是否营业
          if (status == 1 || status == 3) {
            shopArr1.push(res.data[i]);
          } else {
            shopArr2.push(res.data[i]);
          }
        }
        // 按照goods_num做降序排列
        let shopArray = shopArr1.concat(shopArr2);
        shopArray.sort((a, b) => {
          var value1 = a.goods_num,
            value2 = b.goods_num;
          if (value1 <= value2) {
            return a.distance - b.distance;
          }
          return value2 - value1;
        });
        shopArray[0]['jingxuan'] = true;
        my.setStorageSync({ key: 'takeout', data: shopArray });   // 保存外卖门店到本地
        that.getNearbyShop(lng, lat, address);
        my.switchTab({
          url: '/pages/home/goodslist/goodslist'
        })
      } else {
        // 无外卖去自提
        this.setData({
          loginOpened: true
        })
      }

    })
  },
  // 自提附近门店
  getNearbyShop(lng, lat, address) {
    const location = `${lng},${lat}`
    const str = new Date().getTime();
    my.request({
      url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=${geotable_id}&location=${lng}%2C${lat}&ak=${ak}&radius=3000&sortby=distance%3A1&page_index=0&page_size=50&_=${str}`,
      success: (res) => {
        // 3公里有门店
        if (res.data.contents && res.data.contents.length > 0) {
          this.getSelf(res.data.contents, address)
        } else {
          // 没有扩大搜索范围到1000000公里
          my.request({
            url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=${geotable_id}&location=${lng}%2C${lat}&ak=${ak}&radius=1000000000&sortby=distance%3A1&page_index=0&page_size=50&_=${str}`,
            success: (conf) => {
              if (conf.data.contents && conf.data.contents.length > 0) {
                this.getSelf(conf.data.contents, address)
              } else {
                // 无自提门店

              }
            },
          });
        }

      },
    });
  },
  // 自提
  getSelf(obj, address) {
    let shopArr1 = [];
    let shopArr2 = [];
    NearbyShop(JSON.stringify(obj)).then((res) => {
      for (let i = 0; i < res.length; i++) {
        let status = cur_dateTime(res[i].start_time, res[i].end_time);
        app.globalData.isOpen = status
        // 判断是否营业
        if (status == 1 || status == 3) {
          shopArr1.push(res[i]);
        } else {
          shopArr2.push(res[i]);
        }
      }
      // 根据距离最近排序
      shopArr1.sort(sortNum('distance'));
      shopArr2.sort(sortNum('distance'));
      const shopArray = shopArr1.concat(shopArr2);
      shopArray[0]['jingxuan'] = true;
      app.globalData.address = address;
      my.setStorageSync({ key: 'self', data: shopArray });  // 保存自提门店到本地
    })
  },
  // 新增地址
  addAddressTap() {
    // 判断 是否登录
    if (my.getStorageSync({ key: 'user_id' }).data == null) {
      my.navigateTo({
        url: '/pages/login/auth/auth'
      });
    } else {
      my.navigateTo({
        url: "/package_my/pages/myaddress/addaddress/addaddress"
      });
    }
  },
  // 去自提
  onModalRepurse() {
    app.globalData.type = 2;
    my.removeStorageSync({
      key: 'takeout', // 缓存数据的key
    });
    this.setData({
      loginOpened: false
    })
    my.switchTab({
      url: '/pages/home/goodslist/goodslist'
    })
  }
});
