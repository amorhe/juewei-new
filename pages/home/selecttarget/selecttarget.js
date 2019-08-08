import {imageUrl,ak} from '../../common/js/baseUrl'
import {addressList,GetLbsShop,NearbyShop} from '../../common/js/home'
import {bd_encrypt} from '../../common/js/map'
import {cur_dateTime,compare} from '../../common/js/time'
var app = getApp();
Page({
  data: {
    imageUrl,
    city:'',      //城市
    addressIng:'',    // 定位地址
    canUseAddress:[],   // 我的地址
    nearAddress:[],   // 附近地址
    isSuccess:false,
    info:'',   // 一条地址信息
    inputAddress:''  //手动输入的地址
  },
  onLoad(e) {
    if(e.type){
      this.setData({
        isSuccess:true
      })
    }
  },
  onShow(){
    if(app.globalData.address){
      const _sid = my.getStorageSync({key: '_sid'}).data;
      const lng = my.getStorageSync({key: 'lng'}).data;
      const lat = my.getStorageSync({key: 'lat'}).data;
      const location = `${lng},${lat}`;
      this.getAddressList(_sid,location,lat,lng);
      this.setData({
        city: app.globalData.city,
        addressIng: app.globalData.address
      })
    }
  },
  // 切换城市
  choosecityTap(){
    my.chooseCity({
      showLocatedCity:true,
      showHotCities:true,
      success: (res) => {
        console.log(res)
        this.setData({
          city:res.city
        })
      },
    });
  },
  handleSearch(e){
    this.setData({
      inputAddress:e.detail.value
    })
  },
  // 输入地址搜索门店
  searchShop(){
    let url = `https://api.map.baidu.com/geocoding/v3/?address=${this.data.city}${this.data.inputAddress}&output=json&ak=${ak}`
    url = encodeURI(url);
    my.request({
      url,
      success: (res) => {
        console.log(res)
        my.hideKeyboard();
        const _sid = my.getStorageSync({key: '_sid'}).data;
        const lng = res.data.result.location.lng;
        const lat = res.data.result.location.lat;
        const location = `${lng},${lat}`;
        this.getAddressList(_sid,location,lat,lng);
      },
    });
  },
  // 地址列表
  getAddressList(_sid,location,lat,lng){
    addressList(_sid,'normal',location).then((res) => {
      console.log(res)
      let arr1 = [];
      if(res.data.length>0){
         arr1 = res.data.filter(item => item.user_address_is_dispatch == 1)
      }
      this.setData({
        canUseAddress: arr1
      })
      // 百度附近POI
      let str = `https://api.map.baidu.com/place/v2/search?query=房地产$金融$公司企业$政府机构$医疗$酒店$美食$生活服务$教育培训$交通设施&location=${lat},${lng}&radius=1000&output=json&page_size=50&page_num=0&ak=${ak}`;
      str = encodeURI(str);
      my.request({
        url: str,
        success: (res) => {
          // console.log(res.data.results)
          this.setData({
            nearAddress:res.data.results
          })
        },
      });
    })
  },
  // 重新定位
  rePosition(){
    var that = this;
    my.getLocation({
      type:3,
      success(res) {
        console.log(res)
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
        app.globalData.address = res.pois[0].name;
        my.showToast({
          content:'定位成功！'
        })
        that.setData({
          city:res.city,
          addressIng: res.pois[0].name,
          info:res,
          isSuccess:true
        })
      },
      fail(){
        this.setData({
          isSuccess:false
        })
      }
    })
  },
  switchAddress(e){
    console.log(e)
    if(!this.data.isSuccess){
      my.showToast({
        content:'定位失败，请选择其他收货地址！'
      });
    }
    let mapPosition = '';
    switch(e.currentTarget.dataset.type){
      case 1:
        mapPosition = bd_encrypt(e.currentTarget.dataset.info.longitude,e.currentTarget.dataset.info.latitude);
        break;
      case 3: 
        mapPosition = bd_encrypt(e.currentTarget.dataset.info.longitude,e.currentTarget.dataset.info.latitude);
    }
    my.setStorageSync({
        key: 'lat', // 缓存数据的key
        data: mapPosition.bd_lat, // 要缓存的数据
      });
    my.setStorageSync({
      key: 'lng', // 缓存数据的key
      data: mapPosition.bd_lng, // 要缓存的数据
    });
    this.getLbsShop(mapPosition.bd_lng,mapPosition.bd_lat,e.currentTarget.dataset.info.name);
  },
  switchPositionAddress(e){
    console.log(e)
    let position = e.currentTarget.dataset.info.user_address_lbs_baidu.split(',');
    my.setStorageSync({
        key: 'lat', // 缓存数据的key
        data: position[1], // 要缓存的数据
      });
    my.setStorageSync({
      key: 'lng', // 缓存数据的key
      data: position[0] // 要缓存的数据
    });
    this.getLbsShop(position[0],position[1],e.currentTarget.dataset.info.user_address_map_addr);
  },
  // 外卖附近门店
  getLbsShop(lng,lat,chooseAddress) {
    const location = `${lng},${lat}`
    const shopArr1 = [];
    const shopArr2 = [];
    GetLbsShop(location).then((res) => {
      console.log(res)
      if (res.code == 0 && res.data.length > 0) {
        for (let i = 0; i < res.data.length; i++) {
          const status = cur_dateTime(res.data[i].start_time, res.data[i].end_time);
          app.globalData.isOpen = status;
          // 判断是否营业
          if (status == 1 || status == 3) {
            shopArr1.push(res.data[i]);
          } else {
            shopArr2.push(res.data[i]);
          }
        }
        // 按照goods_num做降序排列
        shopArr1.sort(compare('goods_num'));
        shopArr2.sort(compare('goods_num'));
        const shopArray = shopArr1.concat(shopArr2);
        my.setStorageSync({ key: 'takeout', data: shopArray });   // 保存外卖门店到本地
        my.setStorageSync({key:'shop_id',data:shopArray[0].shop_id});
        app.globalData.address = chooseAddress;
        this.getNearbyShop(lng,lat);
        my.switchTab({
          url: '/pages/home/goodslist/goodslist'
        })
      } else if (res.code == 5 || res.data.length == 0) {
        // this.setData({
        //   content:'您的定位地址无可配送门店',
        //   confirmButtonText:'去自提',
        //   cancelButtonText:'修改地址',
        //   modalShow:true,
        //   mask:true
        // })
        my.showToast({
          content:'当前选择的地址无可浏览的门店，请选择其他地址！',
          success: (res) => {
            
          },
        });
      }

    })
  },
  // 自提附近门店
  getNearbyShop(lng,lat) {
    const location = `${lng},${lat}`
    const str = new Date().getTime();
    my.request({
      url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=134917&location=${lng}%2C${lat}&ak=${ak}&radius=3000&sortby=distance%3A1&_=1504837396593&page_index=0&page_size=50&_=${str}`,
      success: (res) => {
        // 3公里有门店
        if (res.data.contents && res.data.contents.length > 0) {
          this.getSelf(res.data.contents)
        } else {
          // 没有扩大搜索范围到100公里
          my.request({
            url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=134917&location=${lng}%2C${lat}&ak=${ak}&radius=100000&sortby=distance%3A1&_=1504837396593&page_index=0&page_size=50&_=1563263791821`,
            success: (conf) => {
              if (conf.data.contents > 0) {
                this.getSelf(conf.data.contents)
              } else {
                // 提示切换地址
                my.showToast({
                  content: "当前定位地址无可浏览的门店，请切换地址！",
                  success: (res) => {
                    my.navigateTo({
                      url: '/pages/home/selecttarget/selecttarget'
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
    const shopArr1 = [];
    const shopArr2 = [];
    NearbyShop(JSON.stringify(obj)).then((res) => {
      console.log(res)
      for (let i = 0; i < res.length; i++) {
        const status = cur_dateTime(res[i].start_time, res[i].end_time);
        app.globalData.isOpen = status;
        // 判断是否营业
        if (status == 1 || status == 3) {
          shopArr1.push(res[i]);
        } else {
          shopArr2.push(res[i]);
        }
      }
      const shopArray = shopArr1.concat(shopArr2);
      my.setStorageSync({ key: 'self', data: shopArray });  // 保存自提门店到本地
      my.setStorageSync({key:'shop_id',data:shopArray[0].shop_id});
    })
  },

});
