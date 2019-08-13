import {imageUrl,ak} from '../common/js/baseUrl'
import {bd_encrypt} from '../common/js/map'
import {GetLbsShop,NearbyShop} from '../common/js/home'
import {cur_dateTime,compare,sortNum} from '../common/js/time'
var app = getApp();

Page({
  data: {
    imageUrl:imageUrl,
    city:'定位中...',
  },
  onLoad() {
    var that = this;
    my.getLocation({
      type:3,
      success(res){
        my.hideLoading();
        // console.log(res)
        const mapPosition = bd_encrypt(res.longitude,res.latitude);
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
          key:'nearPois',
          data:res.pois
        })
        app.globalData.province = res.province;
        app.globalData.city = res.city;
        app.globalData.address =  res.pois[0].name;
        app.globalData.position = res;
        that.getLbsShop();
        that.getNearbyShop();
        that.setData({
          city:res.city
        })
      },
      fail() {
        // 定位失败
        my.hideLoading();
        my.navigateTo({
          url: '/pages/position/position'
        })
      },
    })
  },
  // 外卖附近门店
  getLbsShop() {
    const lng = my.getStorageSync({key:'lng'}).data;
    const lat = my.getStorageSync({key:'lat'}).data;
    const location = `${lng},${lat}`
    const shopArr1 = [];
    const shopArr2 = [];
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
        shopArray.sort((a,b) => {
          var value1 = a.goods_num,
              value2 = b.goods_num;
          if(value1 <= value2){
              return a.distance - b.distance;
          }
          return value2 - value1;
        });
        shopArray[0]['jingxuan'] = true;
        my.setStorageSync({ key: 'takeout', data: shopArray });   // 保存外卖门店到本地
        my.switchTab({
          url: '/pages/home/goodslist/goodslist'
        })
      } else if (res.code == 5 || res.data.length == 0) {
        this.setData({
          content:'您的定位地址无可配送门店',
          confirmButtonText:'去自提',
          cancelButtonText:'修改地址',
          modalShow:true,
          mask:true
        })

      }

    })
  },
  // 自提附近门店
  getNearbyShop() {
    const lng = my.getStorageSync({key:'lng'}).data;
    const lat = my.getStorageSync({key:'lat'}).data;
    const location = `${lng},${lat}`
    const str = new Date().getTime();
    my.request({
      url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=134917&location=${lng}%2C${lat}&ak=${ak}&radius=3000&sortby=distance%3A1&_=1504837396593&page_index=0&page_size=50&_=${str}`,
      success: (res) => {
        // 3公里有门店
        if (res.data.contents && res.data.contents.length > 0) {
          this.getSelf(res.data.contents)
        } else {
          // 没有扩大搜索范围到1000000公里
          my.request({
            url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=134917&location=${lng}%2C${lat}&ak=${ak}&radius=1000000000&sortby=distance%3A1&_=1504837396593&page_index=0&page_size=50&_=1563263791821`,
            success: (conf) => {
              if (conf.data.contents.length > 0) {
                this.getSelf(conf.data.contents)
              } else {
                // 提示切换地址
                my.showToast({
                  content: "当前定位地址无可浏览的门店，请切换地址！",
                  success: (res) => {
                    my.navigateTo({
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
        app.globalData.isOpen = status;
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
      my.setStorageSync({ key: 'self', data: shopArray });  // 保存自提门店到本地
    })
  },
  onCounterPlusOne(e){
    // 点击左边去自提
    if(e.type==1 && e.isType=="noShop") {
      console.log(e)
      this.setData({
        modalShow:e.modalShow,
        mask:e.mask,
        type:2
      })
      app.globalData.type = 2;
      // this.getNearbyShop();
      my.switchTab({
        url: '/pages/home/goodslist/goodslist'
      })
    }else{
      my.navigateTo({
        url: '/pages/home/selecttarget/selecttarget?type=true'
      });
    }
  },
});
