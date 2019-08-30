import { imageUrl, imageUrl2, ak, jsonUrl } from '../../common/js/baseUrl'
import { bannerList, showPositionList, activityList, GetLbsShop, NearbyShop, GetShopGoods } from '../../common/js/home'
import { getuserInfo, loginByAuth } from '../../common/js/login'
import { cur_dateTime, compare, upformId } from '../../common/js/time'
import { bd_encrypt } from '../../common/js/map'
var app = getApp(); //放在顶部
Page({
  data: {
    isSelf: false,  // 是不是去自提页
    imageUrl,
    imageUrl2,
    firstAddress: '定位失败',
    isClose: false,
    indicatorDots: false,
    autoplay: false,
    interval: 2000,
    circular: true,
    imgUrls: [],
    province_id: '',  //省
    city_id: '',  // 市
    region_id: '',  //区
    showListObj: [],   // 展位
    isOpen: '',     //门店是否营业
    shopTakeOut: {},   // 附近门店列表
    shopGoodsList: [],         // 门店商品列表
    companyGoodsList: [],
    typeList1: {
      "折扣": "zk",
      "套餐": "zhsm",
    },
    typeList: {
      "爆款": "hot",
      "超辣": "kl",
      "甜辣": "tl",
      "微辣": "wl",
      "不辣": "bl",
      "招牌系列": "zhao_series",
      "藤椒系列": "tj_series",
      "素菜系列": "su_series",
      "黑鸭系列": "hei_series",
      "五香系列": "wu_series",
      "解辣神器": "qqt_series"
    },
    shopGoodsAll: [],
    content: '',
    confirmButtonText: '',
    cancelButtonText: '',
    modalShow: false,
    mask: false,
    otherGoods: [],   // 参与换购的商品
    type: 1,   // 默认外卖
    shopGoods: [],   // 门店商品
    fullActivity: '',
    freeMoney: '',
    jingxuan: true,
    btnClick: true,
    activityList: []
  },
  onLoad() {
    //重写app.globalData
    //原因首页app页面会刷新两次
    if (app.globalData && !app.globalData.address && my.getStorageSync({ key: 'appglobalData' }).data) {
      app.globalData = my.getStorageSync({ key: 'appglobalData' }).data;
    }
    if (my.getStorageSync({ key: 'appglobalData' }).data) {
      my.removeStorageSync({ key: 'appglobalData' });
    }
  },
  onShow() {
    // 定位地址
    this.setData({
      firstAddress: app.globalData.address,
      type: app.globalData.type,
      shopTakeOut: {}
    })
    if (app.globalData.isSelf) {
      this.setData({
        isSelf: true
      })
    }
    my.showLoading({
      content: '加载中...'
    });
    // 初始化默认外卖
    let shopArray = [];
    
    if (app.globalData.shopIng && !app.globalData.switchClick) {
      if (my.getStorageSync({ key: 'shop_id' }).data != app.globalData.shop_id) {
        const status = cur_dateTime(app.globalData.shopIng.start_time, app.globalData.shopIng.end_time);
        this.setData({
          isOpen: status,
          shopTakeOut: app.globalData.shopIng
        })
        my.setStorageSync({ key: 'shop_id', data: app.globalData.shopIng.shop_id });
        app.globalData.isOpen = status;
        app.globalData.shopTakeOut = this.data.shopTakeOut;
      }
      this.setData({
        jingxuan: app.globalData.shopIng.jingxuan || false,
        shopTakeOut: app.globalData.shopIng,
        shopGoodsAll: []
      })
    } else if (!app.globalData.shopIng && !app.globalData.switchClick) {
      if (app.globalData.type == 1) {
        shopArray = my.getStorageSync({
          key: 'takeout', // 缓存数据的key
        }).data;
      } else {
        shopArray = my.getStorageSync({
          key: 'self', // 缓存数据的key
        }).data;
      }
      const status = cur_dateTime(shopArray[0].start_time, shopArray[0].end_time);
      this.setData({
        isOpen: status,
        shopTakeOut: shopArray[0],
        jingxuan: true,
        shopGoodsAll: []
      })
      my.setStorageSync({ key: 'shop_id', data: shopArray[0].shop_id });
      app.globalData.shopTakeOut = shopArray[0];
      app.globalData.isOpen = status;
    } else {
      this.setData({
        shopTakeOut: app.globalData.shopTakeOut
      })
    }
    app.globalData.switchClick=null;
    if (app.globalData.activityList) {
      app.globalData.activityList.DIS = [];
      app.globalData.activityList.PKG = [];
    }
    let user_id = 1;
    if (my.getStorageSync({ key: 'user_id' }).data) {
      user_id = my.getStorageSync({ key: 'user_id' }).data
    }
    this.getCompanyGoodsList(this.data.shopTakeOut.company_sale_id); //获取公司所有商品
    this.getBannerList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id);//banner
    this.getShowpositionList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id);
    this.getActivityList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id, app.globalData.type, user_id)     //营销活动
    my.setStorageSync({
      key: 'vip_address',
      data: app.globalData.shopTakeOut
    })

    // 自定义跳转页面
    let topage = (app.globalData.page || my.getStorageSync({ key: 'query' }).data || '');
    app.globalData.page = null; //删除
    my.removeStorageSync({ key: 'query' }); //删除
    // console.log('topage',topage);
    if (topage != '') {
      switch (topage) {
        //会员
        case '/pages/home/goodslist/goodslist':
          //就是当前页不用跳转任何
          break;
        //会员
        case '/pages/vip/index/index':
          my.switchTab({
            url: topage
          });
          break;
        // 订单
        case '/pages/order/list/list':
          my.switchTab({
            url: topage
          });
          break;
        // 个人中心
        case '/pages/my/index/index':
          my.switchTab({
            url: topage
          });
          break;
        // 优惠券
        case '/package_my/pages/coupon/coupon':
          setTimeout(function() {
            my.navigateTo({
              url: topage
            });
          }, 200)
          break;
        // 会员卡
        case '/package_my/pages/membercard/membercard':
          setTimeout(function() {
            my.navigateTo({
              url: topage
            });
          }, 200)
          break;
        //  附近门店
        case '/package_my/pages/nearshop/nearshop':
          setTimeout(function() {
            my.navigateTo({
              url: topage
            });
          }, 500)
          break;
        default:
          setTimeout(function() {
            my.navigateTo({
              url: topage
            });
          }, 200)
          break;
      }
    }
  },
  onReady() {
    // 页面加载完成 只加载一次 页面初始化用
  },

  // 关闭提醒
  closeOpen() {
    this.setData({
      isClose: true
    })
  },
  // 切换外卖自提
  chooseTypes(e) {
    let user_id = 1;
    if (my.getStorageSync({ key: 'user_id' }).data) {
      user_id = my.getStorageSync({ key: 'user_id' }).data
    }
    // js节流防短时间重复点击
    if (this.data.btnClick == false) {
      return
    }
    this.setData({
      btnClick: false
    })
    if (e.currentTarget.dataset.type == 'ziti') {
      let shopTakeOut = my.getStorageSync({ key: 'self' }).data[0] || '';
      this.setData({
        shopTakeOut,
        type: 2,
        jingxuan: true
      });
      app.globalData.type = 2;
      this.getActivityList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id, app.globalData.type, user_id)
      this.getCompanyGoodsList(shopTakeOut.company_sale_id); //获取公司所有商品(第一个为当前门店)
      this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut.company_sale_id);//banner
      this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut.company_sale_id);
    } else {
      //切换外卖
      if (!my.getStorageSync({ key: 'takeout' }).data) {
        return
      }
      let shopTakeOut = my.getStorageSync({ key: 'takeout' }).data[0] || '';
      this.setData({
        shopTakeOut,
        type: 1,
        jingxuan: true
      })
      app.globalData.type = 1;
      this.getActivityList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id, app.globalData.type, user_id)
      this.getCompanyGoodsList(shopTakeOut.company_sale_id); //获取公司所有商品(第一个为当前门店)
      this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut.company_sale_id);//banner
      this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut.company_sale_id);
    }
    app.globalData.shopTakeOut = this.data.shopTakeOut;
    const status = cur_dateTime(this.data.shopTakeOut.start_time, this.data.shopTakeOut.end_time);
    this.setData({
      isOpen: status,
      btnClick: true
    })
    my.setStorageSync({
      key: 'shop_id', // 缓存数据的key
      data: this.data.shopTakeOut.shop_id, // 要缓存的数据
    });
    app.globalData.isOpen = status;
    app.globalData.shopIng = null;
  },
  // 首页banner列表
  async getBannerList(city_id, district_id, company_id) {
    await bannerList(city_id, district_id, company_id, 1).then((data) => {
      if (data.data.length == 1) {
        this.setData({
          indicatorDots: false,
          autoplay: false,
          imgUrls: data.data
        })
      } else if (data.data.length > 1) {
        this.setData({
          indicatorDots: true,
          autoplay: true,
          imgUrls: data.data
        })
      } else {
        this.setData({
          indicatorDots: false,
          autoplay: false,
          imgUrls: []
        })
      }

    });
  },
  // 首页商品展位
  async getShowpositionList(city_id, district_id, company_id) {
    await showPositionList(city_id, district_id, company_id, 1).then((res) => {
      this.setData({
        showListObj: res.data
      })
    })
  },
  // 门店营销活动(折扣和套餐)
  async getActivityList(city_id, district_id, company_id, buy_type, user_id) {
    await activityList(city_id, district_id, company_id, buy_type, user_id).then((res) => {
      // 获取加价购商品
      if (res.data.MARKUP) {
        app.globalData.gifts = res.data.MARKUP.gifts;
        // 获取活动金额
        let newArr = Object.keys(res.data.MARKUP.gifts);
        app.globalData.fullActivity = newArr;
        this.setData({
          fullActivity: newArr
        })
      } else {
        app.globalData.gifts = [];
        app.globalData.fullActivity = [];
        this.setData({
          fullActivity: []
        })
      }
      this.setData({
        activityList: res.data
      }, () => {
        this.getShopGoodsList(this.data.shopTakeOut.shop_id);
      })
    })
  },
  // 公司商品列表
  getCompanyGoodsList(company_id) {
    const timestamp = new Date().getTime();
    my.request({
      url: `${jsonUrl}/api/product/company_sap_goods${company_id}.json?v=${timestamp}`,
      success: (res) => {
        // 该公司所有的商品
        this.setData({
          companyGoodsList: res.data.data[`${company_id}`]
        })
      }
    });
  },

  // 门店商品列表
  async getShopGoodsList(shop_id) {
    await GetShopGoods(shop_id).then((res) => {
      my.hideLoading();
      const shopGoodsList = res.data[`${shop_id}`];
      const companyGoodsList = this.data.companyGoodsList;
      //  获取某公司下的某一个门店的所有商品
      let arr = companyGoodsList.filter(item => {
        return shopGoodsList.includes(item.sap_code)
      })
      // 获取参与加价购商品的列表（可换购）
      if (this.data.activityList && this.data.activityList.MARKUP != null) {
        if (this.data.activityList.MARKUP.goods.length == 0) {
          app.globalData.repurseGoods = [];
        } else {
          app.globalData.repurseGoods = this.data.activityList.MARKUP.goods;
        }
        for (let item of this.data.activityList.MARKUP.goods) {
          for (let value of arr) {
            if (item.goods_code == value.sap_code) {
              value['huangou'] = 1;
            }
          }
        }
      }
      // 筛选在当前门店里面的折扣商品
      let DIS = [], PKG = [], obj1 = {}, obj2 = {};
      if (this.data.activityList.DIS) {
        DIS = this.data.activityList.DIS.filter(item => arr.findIndex(value => value.sap_code == item.goods_sap_code) != -1)
      }
      // 筛选在当前门店里面的套餐商品  
      if (this.data.activityList.PKG) {
        PKG = this.data.activityList.PKG.filter(item => item.pkg_goods.map(ott => arr.findIndex(value => value.sap_code == ott.sap_code) != -1));
      }
      // 套餐商品图片格式
      for (let item of PKG) {
        item.goods_img = [item.goods_img];
        item.goods_img_detail_origin = [item.goods_img_detail_origin]
        item.goods_img_intr_origin = [item.goods_img_intr_origin]
      }
      // 包邮活动
      if (this.data.activityList && this.data.activityList.FREE) {
        app.globalData.freeId = this.data.activityList.FREE.id;
        this.setData({
          freeMoney: this.data.activityList.FREE.money
        })
      } else {
        app.globalData.freeId = null;
      }
      obj1 = {
        "key": "折扣",
        "last": DIS
      }
      obj2 = {
        "key": "套餐",
        "last": PKG
      }
      const str = new Date().getTime();
      my.request({
        url: `https://images.juewei.com/prod/shop/goods_sort.json?v=${str}`,
        success: (conf) => {
          let _T = conf.data.data.country
          const { typeList } = this.data

          let keys = Object.keys(typeList);
          let list = keys.map(
            item => ({
              key: item,
              values: arr.filter(_item => item === _item.cate_name || item === _item.taste_name)
            })
          )
          let sortList = list.map(({ key, values }) => {
            let _sort = typeList[key]
            let _t = _T[_sort]
            if (!_t) { return { key, last: [] } }

            let last = []
            _t.map(_item => {
              if (values.length == 0) {
                values = arr;
              }
              let cur = values.filter(({ goods_code }) => goods_code === _item);
              last = new Set([...last, ...cur])
            })
            return {
              key,
              last: [...last]
            }
          })

          sortList.unshift(obj1, obj2);
          let goodsArr = [...DIS, ...PKG, ...arr];    // 门店所有列表（一维数组）
          let goodsNew = sortList.filter(item => item.last.length > 0);
          goodsNew = new Set(goodsNew)
          goodsNew = [...goodsNew];
          app.globalData.goodsArr = goodsArr;  // 详情页，确认订单页使用
          app.globalData.goodsCommon = arr;   // 不包含折扣，套餐
          app.globalData.DIS = DIS;
          app.globalData.PKG = PKG;
          // 最终商品总数据
          // console.log(goodsNew)
          this.setData({
            shopGoodsAll: goodsNew,
            shopGoods: arr
          }, () => {
            let
              shopcartObj = {}, //商品列表 
              goodsList = my.getStorageSync({
                key: 'goodsList', // 缓存数据的key
              }).data;
            if (goodsList == null) {
              shopcartObj = {}
            };
            // 判断购物车商品是否在当前门店里
            for (let val in goodsList) {
              if (goodsList[val].goods_discount) {
                if (this.data.activityList) {
                  // 折扣
                  if (goodsList[val].goods_code.indexOf('PKG') == -1 && this.data.activityList.DIS != null) {
                    for (let ott of this.data.activityList.DIS) {
                      for (let fn of ott.goods_format) {
                        if (val == `${fn.goods_activity_code}_${fn.type}`) {
                          shopcartObj[val] = goodsList[val];
                        }
                      }
                    }
                  } else {
                    // 套餐
                    if (this.data.activityList.PKG != null) {
                      for (let ott of this.data.activityList.PKG) {
                        for (let fn of ott.goods_format) {
                          if (val == `${fn.goods_activity_code}_${fn.type}`) {
                            shopcartObj[val] = goodsList[val];
                          }
                        }
                      }
                    }

                  }
                }
              } else {
                // 普通不带折扣的
                for (let value of arr) {
                  for (let fn of value.goods_format) {
                    // 在门店
                    if (val == `${value.goods_channel}${value.goods_type}${value.company_goods_id}_${fn.type}`) {
                      shopcartObj[val] = goodsList[val];
                    }
                  }
                }
              }
            }
            my.setStorageSync({
              key: 'goodsList', // 缓存数据的key
              data: shopcartObj, // 要缓存的数据
            });
            // 获取商品模块的节点
            my.createSelectorQuery().selectAll('.goodsTypeEv').boundingClientRect().exec((ret) => {
              if (ret[0] == null) { return; }
              let top = ret[0][0].top;
              let arr = ret[0].map((item, index) => {
                return item.top = item.top - top - 37;
              })
              app.globalData.ret = arr;
            })
            my.createSelectorQuery().selectAll('#pagesinfo').boundingClientRect().exec((e) => {
              if (e[0] == null) { return; }
              if (!this.data.isSelf) {
                app.globalData.scrollTop = e[0][0].top
              }
            })
            let h = 0, heightArr = [];
            my.createSelectorQuery().selectAll('.sc_right_item').boundingClientRect().exec((rect) => {
              if (rect[0].length > 0) {
                rect[0].forEach((item) => {
                  h += item.height;
                  heightArr.push(h);
                })
                app.globalData.heightArr = heightArr;
              } else {
                app.globalData.heightArr = []
              }
            });
          })
          my.setStorageSync({
            key: 'shopGoods',
            data: goodsArr
          })

        },
      });

    })
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  //  活动跳转链接
  imageLink(e) {
    my.navigateTo({
      url: e.currentTarget.dataset.link
    });
  },
  // banner图跳转链接
  linkUrl(e) {
    my.navigateTo({
      url: e.currentTarget.dataset.link
    });
  },
  // 会员卡，卡券
  navigate(e) {
    if (my.getStorageSync({
      key: 'user_id', // 缓存数据的key
    }).data == null) {
      my.navigateTo({
        url: '/pages/login/auth/auth'
      });
      return
    }
    my.navigateTo({
      url: e.currentTarget.dataset.url
    });
  },
  onSubmit(e) {
    upformId(e.detail.formId);
  }
});
