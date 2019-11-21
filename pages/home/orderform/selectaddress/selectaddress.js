import { imageUrl, geotable_id, ak } from '../../../common/js/baseUrl'
import { useraddress, GetLbsShop, NearbyShop } from '../../../common/js/home'
import { cur_dateTime, sortNum } from '../../../common/js/time'
var app = getApp();
Page({
  data: {
    imageUrl,
    addressList: [],
    mask: false,
    modalShow: false,
    addressListNoUse: [],
    address_id: '',
    lng: '',
    lat: '',
    address: ''
  },
  onLoad(e) {
    // if(e.type) {
    //   this.setData({
    //     orderType:e.orderType
    //   })
    // }
  },
  onShow() {
    this.getAddress();
  },
  // 选择不在配送范围内的地址
  chooseNewAddress(e) {
    this.setData({
      mask: true,
      modalShow: true,
      lng: e.currentTarget.dataset.lng,
      lat: e.currentTarget.dataset.lat,
      address: e.currentTarget.dataset.address
    })
  },
  onCounterPlusOne(data) {
    if (data.type == 1) {
      my.setStorageSync({
        key: 'lng', // 缓存数据的key
        data: this.data.lng, // 要缓存的数据
      });
      my.setStorageSync({
        key: 'lat', // 缓存数据的key
        data: this.data.lat, // 要缓存的数据
      });
      this.getLbsShop(this.data.lng, this.data.lat, this.data.address);
      this.getNearbyShop(this.data.lng, this.data.lat, this.data.address)
    }
    this.setData({
      mask: data.mask,
      modalShow: data.modalShow
    })
  },
  getAddress() {
    useraddress(my.getStorageSync({ key: 'shop_id' }).data).then((res) => {
      let addressList = [], addressListNoUse = [];
      for (let value of res.data) {
        value.lng = value.user_address_lbs_baidu.split(',')[0];
        value.lat = value.user_address_lbs_baidu.split(',')[1];
        if (value.is_dis == 1) {
          addressList.push(value)
        } else {
          addressListNoUse.push(value)
        }
      }
      this.setData({
        addressList,
        addressListNoUse
      })
    })
  },
  chooseAddress(e) {
    app.globalData.address_id = e.currentTarget.dataset.id;
    my.navigateBack({
      url: '/pages/home/orderform/orderform', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
      success: (res) => {

      },
    });
  },
  // 编辑收货地址　
  editAddress(e) {
    my.navigateTo({
      url: "/package_my/pages/myaddress/addaddress/addaddress?Id=" + e.currentTarget.dataset.id
    });
  },
  // 外卖附近门店
  getLbsShop(lng, lat, address) {
    let that = this;
    const location = `${lng},${lat}`
    const shopArr1 = [];
    const shopArr2 = [];
    app.globalData.address = address;
    GetLbsShop(lng, lat).then((res) => {
      // console.log(res)
      if (res.code == 100 && res.data.shop_list.length > 0) {
				let shop_list = res.data.shop_list;
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
        my.setStorageSync({ key: 'takeout', data: shopArray });   // 保存外卖门店到本地
        that.getNearbyShop(lng, lat, address);
        my.switchTab({
          url: '/pages/home/goodslist/goodslist'
        })
      } else if(res.code == 100 && res.data.shop_list.length == 0){
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
      }else {
				my.alert({content: '网络错误，请重试！'})
			}

    }).catch(()=> {
			my.alert({content: '网络错误，请重试！'})
		})
  },
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
});
