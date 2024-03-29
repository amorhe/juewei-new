import { imageUrl, ak, geotable_id, mySet, myGet } from '../common/js/baseUrl'
import { bd_encrypt } from '../common/js/map'
import { GetLbsShop, NearbyShop } from '../common/js/home'
import { cur_dateTime, compare, sortNum } from '../common/js/time'
let timeCount;
var app = getApp();
let redir_url = 'pages/position/position' //当前页面url
Page({
  data: {
    imageUrl: imageUrl,
    city: '定位中...',
    selfok: false   //是否完成了自提流程
  },
  onLoad() {
    clearInterval(timeCount);
    my.removeStorageSync({
      key: 'takeout', // 缓存数据的key
    });
    my.removeStorageSync({
      key: 'self', // 缓存数据的key
    });
    my.removeStorageSync({
      key: 'opencity', // 缓存数据的key
    });

    var that = this;
    my.getLocation({
      type: 3,
      success(res) {
        my.hideLoading();
        // console.log(res)
        const mapPosition = bd_encrypt(res.longitude, res.latitude);
        my.setStorageSync({
          key: 'lat', // 缓存数据的key
          data: mapPosition.bd_lat, // 要缓存的数据
        });
        my.setStorageSync({
          key: 'lng', // 缓存数据的key
          data: mapPosition.bd_lng, // 要缓存的数据
        });
        // 缓存附近地址
        my.setStorageSync({
          key: 'nearPois',
          data: res.pois
        })
        app.globalData.province = res.province;
        app.globalData.city = res.city;
        app.globalData.address = res.pois[0].name;
        app.globalData.position = res;
        app.globalData.position.longitude = mapPosition.bd_lng;
        app.globalData.position.latitude = mapPosition.bd_lat;
        that.getLbsShop();
        that.getNearbyShop();
        that.setData({
          city: res.city
        })
      },
      fail() {
        // 定位失败
        my.hideLoading();
        my.reLaunch({
          url: '/pages/noposition/noposition'
        })
      },
    })

  },
  onShow() {
    clearInterval(timeCount);
  },
  // 外卖附近门店
  getLbsShop() {
    const lng = my.getStorageSync({ key: 'lng' }).data;
    const lat = my.getStorageSync({ key: 'lat' }).data;
    const location = `${lng},${lat}`
    const shopArr1 = [];
    const shopArr2 = [];
    GetLbsShop(lng, lat).then((res) => {
      if (res.code == 100 && res.data.shop_list.length > 0) {
        let shop_list = res.data.shop_list;
        for (let i = 0; i < shop_list.length; i++) {
          const status = cur_dateTime(shop_list[i].start_time, shop_list[i].end_time);
          // app.globalData.isOpen = status
          // 判断是否营业
          if (status == 1 || status == 3) {
            shopArr1.push(shop_list[i]);
          } else {
            shopArr2.push(shop_list[i]);
          }
        }
        // 按照goods_num做降序排列
        let shopArray = shopArr1.concat(shopArr2);
        // shopArray.sort((a, b) => {
        //   var value1 = a.goods_num,
        //     value2 = b.goods_num;
        //   if (value1 <= value2) {
        //     return a.distance - b.distance;
        //   }
        //   return value2 - value1;
        // });
        shopArray[0]['jingxuan'] = true;
        my.setStorageSync({ key: 'takeout', data: shopArray });   // 保存外卖门店到本地
        //存储app.golbalData
        my.setStorageSync({ key: 'appglobalData', data: app.globalData }); //
        let that = this;
        //外卖ok
        this.setData({
          selfok: true
        })
      } else if (res.code == 100 && res.data.shop_list.length == 0) {
        this.setData({
          content: '您的定位地址无可配送门店',
          confirmButtonText: '去自提',
          cancelButtonText: '修改地址',
          modalShow: true,
          mask: true
        })
      } else {
        my.showToast({
          content: '获取附近外卖门店有些吃力，重新定位一下试试！',
          success: function() {
            my.reLaunch({
              url: '/pages/position/position'
            })
          }
        })
      }
    }).catch(() => {
      my.showToast({
        content: '您的网络有点卡哦，请稍后再试！',
        success() {
          my.redirectTo({
            url: '/pages/noNet/noNet?redir='+redir_url, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
          });
        }
      })
    })
  },
  // 自提附近门店
  getNearbyShop() {
    const lng = my.getStorageSync({ key: 'lng' }).data;
    const lat = my.getStorageSync({ key: 'lat' }).data;
    const location = `${lng},${lat}`
    const str = new Date().getTime();
    my.request({
      url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=${geotable_id}&location=${lng}%2C${lat}&ak=${ak}&radius=3000&sortby=distance%3A1&_=1504837396593&page_index=0&page_size=50&_=${str}`,
      success: (res) => {
        // 3公里有门店
        if (res.data.contents && res.data.contents.length > 0) {
          this.getSelf(res.data.contents)
        } else {
          // 没有扩大搜索范围到1000000公里
          my.request({
            url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=${geotable_id}&location=${lng}%2C${lat}&ak=${ak}&radius=1000000000&sortby=distance%3A1&_=1504837396593&page_index=0&page_size=50&_=1563263791821`,
            success: (conf) => {
              if (conf.data.contents.length > 0) {
                this.getSelf(conf.data.contents)
              } else {
                // 提示切换地址
                my.showToast({
                  content: "当前定位地址无可浏览的门店，请切换地址！",
                  success: (res) => {
                    my.redirectTo({
                      url: '/pages/home/selecttarget/selecttarget?type=true'
                    });
                  },
                });
              }
            },
          });
        }
      },
    });
  },
  // 自提
  getSelf(obj) {
    let shopArr1 = [];
    let shopArr2 = [];
    NearbyShop(JSON.stringify(obj)).then((res) => {
      for (let i = 0; i < res.length; i++) {
        let status = cur_dateTime(res[i].start_time, res[i].end_time);
        // 判断是否营业
        if (status == 1 || status == 3) {
          shopArr1.push(res[i]);
        } else {
          shopArr2.push(res[i]);
        }
      }
      // 根据距离最近排序
      // shopArr1.sort(sortNum('distance'));
      // shopArr2.sort(sortNum('distance'));
      const shopArray = shopArr1.concat(shopArr2);
      shopArray[0]['jingxuan'] = true;
      my.setStorageSync({ key: 'self', data: shopArray });  // 保存自提门店到本地
      let that = this;
      timeCount = setInterval(function() {
        if (that.data.selfok == true) {
          clearInterval(timeCount);
          //跳转到商城首页
          my.reLaunch({
            url: '/pages/home/goodslist/goodslist'
          });
        }
      }, 1000);
    })
  },
  onCounterPlusOne(e) {
    // 点击左边去自提
    if (e.type == 1 && e.isType == "noShop") {
      this.setData({
        modalShow: e.modalShow,
        mask: e.mask,
        type: 2
      })
      app.globalData.type = 2;
      // this.getNearbyShop();
      //存储app.golbalData
      my.setStorageSync({ key: 'appglobalData', data: app.globalData }); //
      my.reLaunch({
        url: '/pages/home/goodslist/goodslist'
      })
    } else {
      my.redirectTo({
        url: '/pages/home/selecttarget/selecttarget?type=true'
      });
    }
  },
});
