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
    firstAddress: '紫檀大厦',
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
    btnClick: true
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
    // setTimeout(() =>{
    //   var query = my.createSelectorQuery();
    //   query.select('.pagesScorll').boundingClientRect();
    //   query.exec((rect) => {
    //     if (rect[0] === null) return;
    //     this.setData({
    //       marginBM: rect[0].height + 10
    //     })
    //   });
    // }, 2000)
  },
  onShow() {
    // 定位地址
    this.setData({
      firstAddress: app.globalData.address,
      type: app.globalData.type
    })
    if (app.globalData.isSelf) {
      this.setData({
        isSelf: true
      })
    }
    // 初始化默认外卖
    let shopArray = [];
    if (app.globalData.shopIng) {
      if (my.getStorageSync({ key: 'shop_id' }).data != app.globalData.shop_id) {
        this.getCompanyGoodsList(app.globalData.shopIng.company_sale_id); //获取公司所有商品
        this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, app.globalData.shopIng.company_sale_id);//banner
        this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, app.globalData.shopIng.company_sale_id);
        const status = cur_dateTime(app.globalData.shopIng.start_time, app.globalData.shopIng.end_time);
        this.setData({
          isOpen: status,
          shopTakeOut: app.globalData.shopIng
        })
        my.setStorageSync({ key: 'shop_id', data: app.globalData.shopIng.shop_id });
      }
      this.setData({
        jingxuan: app.globalData.shopIng.jingxuan || false
      })
      app.globalData.shopIng = null;

    } else {
      if (app.globalData.type == 1) {
        shopArray = my.getStorageSync({
          key: 'takeout', // 缓存数据的key
        }).data;
      } else {
        shopArray = my.getStorageSync({
          key: 'self', // 缓存数据的key
        }).data;
      }
      this.getCompanyGoodsList(shopArray[0].company_sale_id); //获取公司所有商品
      this.getBannerList(shopArray[0].city_id, shopArray[0].district_id, shopArray[0].company_sale_id);//banner
      this.getShowpositionList(shopArray[0].city_id, shopArray[0].district_id, shopArray[0].company_sale_id);
      const status = cur_dateTime(shopArray[0].start_time, shopArray[0].end_time);
      this.setData({
        isOpen: status,
        shopTakeOut: shopArray[0]
      })
      my.setStorageSync({ key: 'shop_id', data: shopArray[0].shop_id });
    }
    app.globalData.shopTakeOut = this.data.shopTakeOut;

    let user_id = 1;
    if (my.getStorageSync({ key: 'user_id' }).data) {
      user_id = my.getStorageSync({ key: 'user_id' }).data
    }
    this.getActivityList(this.data.shopTakeOut.city_id, this.data.shopTakeOut.district_id, this.data.shopTakeOut.company_sale_id, app.globalData.type, user_id)     //营销活动
    my.setStorageSync({
      key: 'vip_address',
      data: app.globalData.shopTakeOut
    })

     // 自定义跳转页面
    let topage=(app.globalData.page || my.getStorageSync({ key: 'query' }).data || '');
    app.globalData.page = null; //删除
    my.removeStorageSync({key: 'query'}); //删除
    console.log('topage',topage);
    if (topage != '') {
      switch (topage) {
        // vip
        case '/pages/vip/index/index':
          my.navigateTo({
            url: topage
          });
          break;
        // 订单
        case '/pages/order/list/list':
          my.navigateTo({
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
          my.navigateTo({
            url: topage
          });
          break;
        // 会员卡
        case '/package_my/pages/membercard/membercard':
          my.navigateTo({
            url: topage
          });
          break;
        //  附近门店
        case '/package_my/pages/nearshop/nearshop':
          my.navigateTo({
            url: topage
          });
          break;
        default:
          my.navigateTo({
            url: topage
          });
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
    // js节流防短时间重复点击
    if (this.data.btnClick == false) {
      return
    }
    this.setData({
      btnClick: false
    })
    setTimeout(() => {
      this.setData({
        btnClick: true
      })
    }, 1000)
    if (!my.getStorageSync({ key: 'takeout' }).data) {
      return
    }
    if (e.currentTarget.dataset.type == 'ziti') {
      let shopTakeOut = '';
      if (app.globalData.shopIng) {
        shopTakeOut = app.globalData.shopIng
        this.setData({
          jingxuan: (app.globalData.shopIng.jingxuan || false)
        });
      } else {
        shopTakeOut = my.getStorageSync({ key: 'self' }).data[0];
        this.setData({
          jingxuan: true
        });
      }
      this.setData({
        shopTakeOut,
        type: 2
      });

      app.globalData.type = 2;
      this.getCompanyGoodsList(shopTakeOut.company_sale_id); //获取公司所有商品(第一个为当前门店)
      this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut.company_sale_id);//banner
      this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut.company_sale_id);
    } else {

      let shopTakeOut = '';
      if (app.globalData.shopIng) {
        shopTakeOut = app.globalData.shopIng;
        this.setData({
          jingxuan: (app.globalData.shopIng.jingxuan || false)
        });
      } else {
        shopTakeOut = my.getStorageSync({ key: 'takeout' }).data[0]
        this.setData({
          jingxuan: true
        });
      }
      this.setData({
        shopTakeOut,
        type: 1
      })
      app.globalData.type = 1;
      this.getCompanyGoodsList(shopTakeOut.company_sale_id); //获取公司所有商品(第一个为当前门店)
      this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut.company_sale_id);//banner
      this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut.company_sale_id);
    }
    app.globalData.shopTakeOut = this.data.shopTakeOut;

  },
  // 首页banner列表
  async getBannerList(city_id, district_id, company_id) {
    await bannerList(city_id, district_id, company_id, 1).then((data) => {
      if (data.data.length > 1) {
        this.setData({
          indicatorDots: true,
          autoplay: true
        })
      }
      this.setData({
        imgUrls: data.data
      })
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
        this.getShopGoodsList(this.data.shopTakeOut.shop_id);
      }
    });
  },
  // 门店营销活动(折扣和套餐)
  async getActivityList(city_id, district_id, company_id, buy_type, user_id) {
    await activityList(city_id, district_id, company_id, buy_type, user_id).then((res) => {
      app.globalData.activityList = res.data;
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
    })
  },
  // 门店商品列表
  async getShopGoodsList(shop_id) {
    await GetShopGoods(shop_id).then((res) => {
      const shopGoodsList = res.data[`${shop_id}`];
      const companyGoodsList = this.data.companyGoodsList;
      //  获取某公司下的某一个门店的所有商品
      let arr = companyGoodsList.filter(item => {
        return shopGoodsList.includes(item.sap_code)
      })
      // 获取参与加价购商品的列表（可换购）
      if (app.globalData.activityList && app.globalData.activityList.MARKUP != null) {
        if (app.globalData.activityList.MARKUP.goods.length == 0) {
          app.globalData.repurseGoods = [];
        } else {
          app.globalData.repurseGoods = app.globalData.activityList.MARKUP.goods;
        }
        for (let item of app.globalData.activityList.MARKUP.goods) {
          for (let value of arr) {
            if (item.goods_code == value.sap_code) {
              value['huangou'] = 1;
            }
          }
        }
      }
      // 筛选在当前门店里面的折扣商品
      let DIS = [], PKG = [], obj1 = {}, obj2 = {}
      if (app.globalData.activityList && app.globalData.activityList.DIS) {
        DIS = app.globalData.activityList.DIS.filter(item => arr.findIndex(value => value.sap_code == item.goods_sap_code) != -1)
      }
      // 筛选在当前门店里面的套餐商品  
      if (app.globalData.activityList && app.globalData.activityList.PKG) {
        PKG = app.globalData.activityList.PKG.filter(item => item.pkg_goods.map(ott => arr.findIndex(value => value.sap_code == ott.sap_code) != -1));
      }
      // 套餐商品图片格式
      for (let item of PKG) {
        item.goods_img = [item.goods_img];
        item.goods_img_detail_origin = [item.goods_img_detail_origin]
        item.goods_img_intr_origin = [item.goods_img_intr_origin]
      }

      // 包邮活动
      if (app.globalData.activityList && app.globalData.activityList.FREE) {
        app.globalData.freeId = app.globalData.activityList.FREE.id;
        this.setData({
          freeMoney: app.globalData.activityList.FREE.money
        })
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
          // 最终商品总数据
          // console.log(goodsNew)
          this.setData({
            shopGoodsAll: goodsNew,
            shopGoods: arr
          }, () => {
            // 获取商品模块的节点
            my.createSelectorQuery().selectAll('.goodsTypeEv').boundingClientRect().exec((ret) => {
              // console.log(ret)
              let top = ret[0][0].top;
              let arr = ret[0].map((item, index) => {
                return item.top = item.top - top - 37;
              })
              app.globalData.ret = arr;
            })
            my.createSelectorQuery().selectAll('#pagesinfo').boundingClientRect().exec((e) => {
              if (!this.data.isSelf) {
                app.globalData.scrollTop = e[0][0].top
              }
            })
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
