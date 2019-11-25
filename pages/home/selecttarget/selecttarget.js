import { imageUrl, ak, geotable_id,myGet } from '../../common/js/baseUrl'
import { addressList, GetLbsShop, NearbyShop } from '../../common/js/home'
import { bd_encrypt } from '../../common/js/map'
import { cur_dateTime, compare, sortNum } from '../../common/js/time'
import { navigateTo } from '../../common/js/router'
var app = getApp();
Page({
  data: {
    imageUrl,
    city: '',      //城市
    addressIng: '',    // 定位地址
    canUseAddress: [],   // 我的地址
    nearAddress: [],   // 附近地址
    searchedAddress: [], //搜索地址
    showClear: false,
    isSuccess: false,
    info: '',   // 一条地址信息
    inputAddress: '',  //手动输入的地址
    loginOpened: false,
    showSearched: false,
    showSearchedMask: false
  },
  onLoad(e) {
    // console.log(app.globalData.position)
    if (e.type) {
      this.setData({
        isSuccess: true,
        city: app.globalData.position.city || app.globalData.city,
        addressIng: app.globalData.address,
        info: app.globalData.position
      })
    }
  },
  onShow() {
    const _sid = my.getStorageSync({ key: '_sid' }).data;
    //获取用户收货地址,一次性获取下来
    if (_sid) {
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
    this.setData({
      inputAddress: '',
      searchedAddress: [],
      showClear: false,
      showSearched: false,
      showSearchedMask: false
    })
    my.chooseCity({
      showLocatedCity: true,
      showHotCities: true,
      success: (res) => {
        console.log(res)
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
  getFocus() {
    if (this.data.searchedAddress.length == 0) {
      this.setData({
        showSearchedMask: true,
        showSearched: false
      });
    }
    if (this.data.searchedAddress.length > 0) {
      this.setData({
        showSearchedMask: false,
        showSearched: true
      });
    }
  },
  clearSearch() {
    this.setData({
      searchedAddress: [],
      showSearchedMask: true,
      showSearched: false,
      inputAddress: '',
      showClear: false,
    })
  },
  cancelSearch() {
    this.setData({
      searchedAddress: [],
      showSearchedMask: false,
      showSearched: false,
      inputAddress: '',
      showClear: false,
    })
  },
  handleSearch(e) {
    this.setData({
      inputAddress: e.detail.value
    });
    if (e.detail.value.length > 0) {
      this.searchShop();
      this.setData({
        showClear: true
      })
    } else {
      this.setData({
        showSearchedMask: true,
        showSearched: false,
        searchedAddress: [],
        showClear: false
      });
    }
  },
  // 输入地址搜索门店
  searchShop() {
    let that = this;
    //附近地址列表
    if (this.data.city + this.data.inputAddress != '') {
      let url = `https://api.map.baidu.com/geocoding/v3/?address=${this.data.city}${this.data.inputAddress}&output=json&ak=${ak}`
      url = encodeURI(url);
      my.request({
        url,
        success: (res) => {
          const lng = res.data.result.location.lng;
          const lat = res.data.result.location.lat;
          const location = `${lng},${lat}`;
          that.getSearchedAddress(location, lat, lng);
        },
      });
    }
  },
  getSearchedAddress(location, lat, lng) {
    let that = this;
    //附近地址列表
    if (this.data.city + this.data.inputAddress != '') {
      // let str = `http://api.map.baidu.com/place/v2/search?query=${this.data.inputAddress}&region=${this.data.city}&scope=2&filter=sort_name:distance&output=json&ak=${ak}`;
      let str = `https://api.map.baidu.com/place/v2/search?query=${this.data.inputAddress}&location=${lat},${lng}&radius=100000&scope=2&output=json&ak=${ak}`;
      str = encodeURI(str);
      my.request({
        url: str,
        success: (res) => {
          if (res.data.status == 0) {
            this.setData({
              searchedAddress: res.data.results,
              showSearched: true,
              showSearchedMask: false
            })
            console.log(this.data.searchedAddress)
          } else {
            this.setData({
              searchedAddress: [],
              showSearched: true,
              showSearchedMask: false
            })
          }
        },
        fail: (rej) => {
          this.setData({
            searchedAddress: [],
            showSearched: true,
            showSearchedMask: false
          })
        }
      });
    }
  },
  //附近地址列表
  getAddressList(location, lat, lng) {
    //附近列表中没有传出当前的 地区id,城市id等参数
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
    my.showLoading();
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
        that.getLbsShop(mapPosition.bd_lng, mapPosition.bd_lat, res.pois[0].name);
        that.getNearbyShop(mapPosition.bd_lng, mapPosition.bd_lat, res.pois[0].name);
        that.getAddressList((mapPosition.bd_lng, mapPosition.bd_lat), mapPosition.bd_lat, mapPosition.bd_lng);
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
    if (e.currentTarget.dataset.type == '1' && !this.data.isSuccess && e.currentTarget.dataset.address == '') {
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
    let lng, lat;
    switch (parseInt(e.currentTarget.dataset.type)) {
      case 1:
        lng = e.currentTarget.dataset.info.longitude || e.currentTarget.dataset.info.user_address_lbs_baidu.split(',')[0];
        lat = e.currentTarget.dataset.info.latitude || e.currentTarget.dataset.info.user_address_lbs_baidu.split(',')[1]
        mapPosition = bd_encrypt(lng, lat);
        break;
      case 3:
        lng = e.currentTarget.dataset.info.location.lng;
        lat = e.currentTarget.dataset.info.location.lat;
        mapPosition = bd_encrypt(e.currentTarget.dataset.info.location.lng, e.currentTarget.dataset.info.location.lat);
        break;
    }

    my.setStorageSync({
      key: 'lat', // 缓存数据的key
      data: mapPosition.bd_lat, // 要缓存的数据
    });
    my.setStorageSync({
      key: 'lng', // 缓存数据的key
      data: mapPosition.bd_lng, // 要缓存的数据
    });
    app.globalData.position = e.currentTarget.dataset.info;
    app.globalData.position.city = e.currentTarget.dataset.info.city;
    app.globalData.position.district = e.currentTarget.dataset.info.area;
    app.globalData.position.cityAdcode = '';
    app.globalData.position.districtAdcode = '';
    app.globalData.shopIng = null;
    if (e.currentTarget.dataset.info.location) {
      app.globalData.position.latitude = e.currentTarget.dataset.info.location.lat;
      app.globalData.position.longitude = e.currentTarget.dataset.info.location.lng;
    } else {
      app.globalData.position.latitude = lat;
      app.globalData.position.longitude = lng;
    }

    app.globalData.position.province = e.currentTarget.dataset.info.province;
    //额外添加两个
    app.globalData.city = e.currentTarget.dataset.info.city;
    app.globalData.province = e.currentTarget.dataset.info.province;
    let address = '';
    if (e.currentTarget.dataset.type == 1) {
      address = e.currentTarget.dataset.address;
    } else {
      address = e.currentTarget.dataset.info.name;
    }
    this.getLbsShop(app.globalData.position.longitude, app.globalData.position.latitude, address, 'click');
    this.getNearbyShop(app.globalData.position.longitude, app.globalData.position.latitude, address, 'click')

  },
  // 选择我的收货地址
  switchPositionAddress(e) {
    //我的收获地址未能传递地区id，城市id等参数。
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
    app.globalData.position.cityAdcode = '';
    app.globalData.position.districtAdcode = '';
    app.globalData.shopIng = null;
    this.getLbsShop(position[0], position[1], e.currentTarget.dataset.info.user_address_map_addr, 'click');
    this.getNearbyShop(position[0], position[1], e.currentTarget.dataset.info.user_address_map_addr, 'click')
  },
  // 外卖附近门店
  async getLbsShop(lng, lat, address, str) {
    let that = this;
    const location = `${lng},${lat}`
    const shopArr1 = [];
    const shopArr2 = [];
    app.globalData.address = address;
    GetLbsShop(lng, lat).then((res) => {
      // console.log(res)
      if (res.code == 100 && res.data.shop_list.length > 0) {
        let shop_list = res.data.shop_list;
        my.hideLoading();
        for (let i = 0; i < shop_list.length; i++) {
          const status = cur_dateTime(shop_list[i].start_time, shop_list[i].end_time);
          app.globalData.isOpen = status
          // 判断是否营业
          if (status == 1 || status == 3) {
            shopArr1.push(shop_list[i]);
          } else {
            shopArr2.push(shop_list[i]);
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
        app.globalData.position.cityAdcode = shopArray[0].city_id
        app.globalData.position.districtAdcode = shopArray[0].district_id

        my.setStorageSync({ key: 'takeout', data: shopArray });   // 保存外卖门店到本地
        that.getNearbyShop(lng, lat, address);
        if (str) {
          my.switchTab({
            url: '/pages/home/goodslist/goodslist'
          })
        }
      } else if (res.code == 100 && res.data.shop_list.length == 0) {
        // 无外卖去自提
        this.setData({
          loginOpened: true
        })
        app.globalData.type = 2;
        //存储app.golbalData
        my.setStorageSync({ key: 'appglobalData', data: app.globalData }); //
        // my.reLaunch({
        // 	url: '/pages/home/goodslist/goodslist'
        // })
      } else {
        my.alert({ content: '网络错误，请重试！' })
      }
    }).catch(() => {
      my.alert({ content: '网络错误，请重试！' })
    })
  },
  // 自提附近门店
  async getNearbyShop(lng, lat, address) {
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
  // 获取自提门店信息
  getSelf(obj, address) {
    let shopArr1 = [];
    let shopArr2 = [];
    NearbyShop(JSON.stringify(obj)).then((res) => {
      my.hideLoading();
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
    let userInfo = myGet('userInfo');
    if (userInfo && userInfo.user_id && userInfo.user_id != '') {
      navigateTo({
        url: "/package_my/pages/myaddress/addaddress/addaddress"
      });
    } else {
      navigateTo({
        url: '/pages/login/auth/auth'
      });
    }
  },
  // 去自提
  onModalRepurse() {
    app.globalData.type = 2;
    my.removeStorageSync({
      key: 'takeout', // 缓存数据的key
    });
    let shopArray = my.getStorageSync({ key: 'self' }).data;
    app.globalData.position.cityAdcode = shopArray[0].city_id;
    app.globalData.position.districtAdcode = shopArray[0].district_id;

    this.setData({
      loginOpened: false
    })
    my.switchTab({
      url: '/pages/home/goodslist/goodslist'
    })
  }
});
