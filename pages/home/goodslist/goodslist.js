import { imageUrl, imageUrl2, ak, jsonUrl } from '../../common/js/baseUrl'
import { bannerList, showPositionList, activityList, GetLbsShop, NearbyShop, GetShopGoods } from '../../common/js/home'
import { getuserInfo, loginByAuth } from '../../common/js/login'
import { cur_dateTime, compare, upformId } from '../../common/js/time'
import { bd_encrypt } from '../../common/js/map'
var app = getApp(); //放在顶部
Page({
  data: {
    loaded: false,
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
    shopcartObj: {}, 
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
    activityList: [],
		lastCityid: null,
		activity_channel: 1,
    pagescrollTop:0 //计算高度
  },
  onLoad() {
    //重写app.globalData
    //原因首页app页面会刷新两次
    var globalData = my.getStorageSync({ key: 'appglobalData' }).data;
    if (app.globalData && !app.globalData.address && globalData) {
      app.globalData = globalData;
    }
    if (globalData) {
      my.removeStorageSync({ key: 'appglobalData' });
    }
    this.initData();
    this.getInfo();
    // 这个貌似没用
    my.setStorageSync({
      key: 'vip_address',
      data: app.globalData.shopTakeOut
    })
    //判断用户是否授权，如果没有授权就弹出一次授权。
    my.getAuthCode({
      scopes: ['auth_user', 'auth_life_msg'],
      success: (res) => {},
      fail: (e) => {}
    });
  },
  onShow() {
		my.hideLoading();
    if(this.data.lastCityid) {
      if(this.data.lastCityid != app.globalData.position.cityAdcode) {
        my.setStorageSync({
          key: 'goodsList', // 缓存数据的key
          data: {}, // 要缓存的数据
        });
        this.setData({
          lastCityid: app.globalData.position.cityAdcode
        })
      }
    }else {
      this.setData({
        lastCityid: app.globalData.position.cityAdcode
      })
    }
    //判断是否切换tabbar还是地址和门店切换
    if(this.data.firstAddress !== app.globalData.address || this.data.type != app.globalData.type || this.data.shop_id !== app.globalData.shop_id){
      // 重置高度
      my.pageScrollTo({
        scrollTop: 0,
      });
      this.initData();
      this.getInfo();
      this.updateShopCart();
    }
    let goodsList = my.getStorageSync({ key: 'shopcartObj' }).data;
    // 购物车内容变化时更新
    // let oldSum = 0, newSum = 0;
    // for(let item in this.data.shopcartObj){
    //   oldSum += item.num;
    // }
    // for(let item in goodsList){
    //   newSum += item.num;
    // }
    //改成这样是因为第一次的时候是空，第二次才会好
    if(this.data.loaded) {
      this.getShopGoodsList(this.data.shopTakeOut.shop_id);
    }
    this.goToPage();
  },
  onReady() {
    // 页面加载完成 只加载一次 页面初始化用
  },
  onPullDownRefresh(e){
    // 页面下拉时触发。e.from的值是“code”表示startPullDownRefresh触发的事件；值是“manual”表示用户下拉触发的下拉事件
    if(e.from === 'manual'){
      console.log('触发下拉刷新的类型', e.from);
      this.onLoad();
      my.stopPullDownRefresh();
    }
  },
  initData () {
    // 设置定位地址
    this.setData({
      firstAddress: app.globalData.address,
      type: app.globalData.type
    })
    this.setData({
      shopTakeOut: {}
    })
    if (app.globalData.isSelf) {
      this.setData({
        isSelf: true
      })
    }
    // 初始化默认外卖
    let shopArray = [];
    // 如果当前全局中门店地址信息存在
    if (app.globalData.shopIng && !app.globalData.switchClick) {
      // 当前的门店ID和缓存的门店ID不一样
      if (my.getStorageSync({ key: 'shop_id' }).data != app.globalData.shop_id) {
        // 查看门店营业状态
        // 3 不足一小时 
        // 1  营业中
        // 2  未营业
        const status = cur_dateTime(app.globalData.shopIng.start_time, app.globalData.shopIng.end_time);
        // 设置门店信息
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
    // 如果当前全局中门店地址信息不存在
    } else if (!app.globalData.shopIng && !app.globalData.switchClick) {
      // 获取外卖的门店列表
      if (app.globalData.type == 1) {
        shopArray = my.getStorageSync({
          key: 'takeout', // 缓存数据的key
        }).data;
      } else {// 获取自提的门店列表
        shopArray = my.getStorageSync({
          key: 'self', // 缓存数据的key
        }).data;
      }
      // 设置门店信息
      const status = cur_dateTime(shopArray[0].start_time, shopArray[0].end_time);
      this.setData({
        isOpen: status,
        shopTakeOut: shopArray[0],
        jingxuan: true,
        shopGoodsAll: []
      })
      // 写入门店信息到本地缓存
      my.setStorageSync({ key: 'shop_id', data: shopArray[0].shop_id });
      app.globalData.shopTakeOut = shopArray[0];
      app.globalData.isOpen = status;
    } else {// app.globalData.switchClick为true的情况
      this.setData({
        shopTakeOut: app.globalData.shopTakeOut
      })
    }
    app.globalData.switchClick = null;
    if (app.globalData.activityList) {
      app.globalData.activityList.DIS = [];
      app.globalData.activityList.PKG = [];
    }
 },
  goToPage() {
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
  getInfo () {
    console.log('getInfo');
    let user_id = 1;
    if (my.getStorageSync({ key: 'user_id' }).data) {
      user_id = my.getStorageSync({ key: 'user_id' }).data
    }
    let local_shopTakeOut = this.data.shopTakeOut;
    this.getCompanyGoodsList(local_shopTakeOut.company_sale_id); //获取公司所有商品
    this.getBannerList(local_shopTakeOut.city_id, local_shopTakeOut.district_id, local_shopTakeOut.company_sale_id);//banner
    this.getShowpositionList(local_shopTakeOut.city_id, local_shopTakeOut.district_id, local_shopTakeOut.company_sale_id);
    this.getActivityList(local_shopTakeOut.city_id, local_shopTakeOut.district_id, local_shopTakeOut.company_sale_id, app.globalData.type, user_id, this.data.activity_channel)     //营销活动
  },
  // 关闭提醒
  closeOpen() {
    this.setData({
      isClose: true
    })
  },
	onCounterPlusOne(e) {
    // 点击左边去自提
    if (e.type == 1 && e.isType == "noShop") {
      console.log(e)
      this.setData({
        modalShow: e.modalShow,
        mask: e.mask,
        type: 2
      })
    } else {
      my.redirectTo({
        url: '/pages/home/selecttarget/selecttarget?type=true'
      });
    }
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
    let user_id = 1;
    
    // 切换为自提
    if (e.currentTarget.dataset.type == 'ziti') {
      console.log('ziti');
      let shopTakeOut = my.getStorageSync({ key: 'self' }).data[0] || '';
      this.setData({
        shopTakeOut,
        type: 2,
        jingxuan: true
      });
      app.globalData.type = 2;
    } else {// 切换为外卖
      console.log('外卖');
      //切换外卖
      // 按钮防抖
      if (!my.getStorageSync({ key: 'takeout' }).data) {
        this.setData({
          btnClick: true
        })
				this.setData({
          content: '您的定位地址无可配送门店',
          confirmButtonText: '去自提',
          cancelButtonText: '修改地址',
          modalShow: true,
          mask: true
        })
        return
      }
      let shopTakeOut = my.getStorageSync({ key: 'takeout' }).data[0] || '';
      this.setData({
        shopTakeOut,
        type: 1,
        jingxuan: true
      })
      app.globalData.type = 1;
    }
    // 请求数据
    let local_shopTakeout = this.data.shopTakeOut;
    if (my.getStorageSync({ key: 'user_id' }).data) {
      user_id = my.getStorageSync({ key: 'user_id' }).data
    }
    this.getActivityList(local_shopTakeout.city_id, local_shopTakeout.district_id, local_shopTakeout.company_sale_id, app.globalData.type, user_id, this.data.activity_channel)
    this.getCompanyGoodsList(local_shopTakeout.company_sale_id); //获取公司所有商品(第一个为当前门店)
    this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, local_shopTakeout.company_sale_id);//banner
    this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, local_shopTakeout.company_sale_id);


    app.globalData.shopTakeOut = local_shopTakeout;
    const status = cur_dateTime(local_shopTakeout.start_time, local_shopTakeout.end_time);
    this.setData({
      isOpen: status,
      btnClick: true
    })
    my.setStorageSync({
      key: 'shop_id', // 缓存数据的key
      data: local_shopTakeout.shop_id, // 要缓存的数据
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
  async getActivityList(city_id, district_id, company_id, buy_type, user_id, activity_channel) {
    await activityList(city_id, district_id, company_id, buy_type, user_id, activity_channel).then((res) => {
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
    my.showLoading({
      content: '加载中...'
    });
    this.setData({
      'loaded': true
    })
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
      for(let item of DIS){
        item.key='折扣';
      }
      // 套餐商品图片格式
      for (let item of PKG) {
        item.goods_img = [item.goods_img];
        item.goods_img_detail_origin = [item.goods_img_detail_origin];
        item.goods_img_intr_origin = [item.goods_img_intr_origin];
        item.key='套餐';
      }
      // 包邮活动
      if (this.data.activityList && this.data.activityList.FREE) {
        app.globalData.freeId = this.data.activityList.FREE.id;
        this.setData({
          freeMoney: this.data.activityList.FREE.money
        })
        app.globalData.freeMoney = this.data.activityList.FREE.money
      } else {
        app.globalData.freeId = null;
        app.globalData.freeMoney = null;
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
        url: `${jsonUrl}/goods/goods_sort.json?v=${str}`,
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
            this.updateShopCart();
            // 获取商品模块的节点
            my.createSelectorQuery().selectAll('.goodsTypeEv').boundingClientRect().exec((ret) => {
              if (ret[0] == null) { return; }
              let top = ret[0][0].top;
              let arr = ret[0].map((item, index) => {
                // return item.top = item.top - top - 37;
                return item.top = item.top - top;
              })
              app.globalData.ret = arr;
            })
            my.createSelectorQuery().selectAll('#pagesinfo').boundingClientRect().exec((e) => {
              if (e[0] == null) { return; }
              if (!this.data.isSelf) {
                app.globalData.scrollTop = e[0][0].top
              }
              this.setData({
                pagescrollTop: 99999999 //e[0][0].top
              })
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
  // 监听商品列表滚动
  onScroll(e) {
    //用于判断左侧显示的位置 
    if (e.detail.scrollTop > 0) {
      let retArr = [...goodsret];
      my.createSelectorQuery().select('.scrolllist').scrollOffset().exec((ret) => {
        let sum = 0;
        if (retArr.indexOf(ret[0].scrollTop) > -1) {
          retArr.push(ret[0].scrollTop + 1);
          retArr.sort((a, b) => a - b);
          sum = retArr.findIndex(item => (item == (ret[0].scrollTop + 1)));
        } else {
          retArr.push(ret[0].scrollTop);
          retArr.sort((a, b) => a - b);
          sum = retArr.findIndex(item => (item == ret[0].scrollTop));
        }
        if (this.data.goodsType != sum) {
          this.setData({
            goodsType: sum
          })
        }
      })
    }
  },
  //手势移开
  onTouchend(e) {
    //e没有可用参数所以用查询办法
    my.createSelectorQuery().select('.scrolllist').scrollOffset().exec((ret) => {
      if (ret[0].scrollTop > 0) {
        my.pageScrollTo({
          scrollTop: 999999 //这里可以给了最大的数字，来代表滚动到最底部就可以了  this.data.navbarInitTop
        })
      }
    })
  },
  // 加入购物车
  eveAddshopcart(e) {
    let goods_car = {};
    let goods_code = e.currentTarget.dataset.goods_code;
    let goods_format = e.currentTarget.dataset.goods_format;
    let goodlist = myGet('goodsList') || {};
    if (goodlist[`${goods_code}_${goods_format}`]) {
      goodlist[`${goods_code}_${goods_format}`].num += 1;
      goodlist[`${goods_code}_${goods_format}`].sumnum += 1;
    } else {
      let oneGood = {};

      if (e.currentTarget.dataset.goods_discount) {//是商品折扣的
        oneGood = {
          "goods_name": e.currentTarget.dataset.goods_name,
          "taste_name": e.currentTarget.dataset.taste_name,
          "goods_price": e.currentTarget.dataset.goods_price * 100,
          "num": 1,
          "sumnum": 1,
          "goods_code": e.currentTarget.dataset.goods_code,
          "goods_activity_code": e.currentTarget.dataset.goods_activity_code,
          "goods_discount": e.currentTarget.dataset.goods_discount,
          "goods_original_price": e.currentTarget.dataset.goods_original_price,
          "goods_discount_user_limit": e.currentTarget.dataset.goods_discount_user_limit,
          "goods_order_limit": e.currentTarget.dataset.goods_order_limit,
          "goods_format": goods_format,
          "goods_img": e.currentTarget.dataset.goods_img,
          "sap_code": e.currentTarget.dataset.sap_code
        }
      } else {//普通商品
        oneGood = {
          "goods_name": e.currentTarget.dataset.goods_name,
          "taste_name": e.currentTarget.dataset.taste_name,
          "goods_price": e.currentTarget.dataset.goods_price * 100,
          "num": 1,
          "sumnum": 1,
          "goods_code": e.currentTarget.dataset.goods_code,
          "goods_format": goods_format,
          "goods_img": e.currentTarget.dataset.goods_img,
          "sap_code": e.currentTarget.dataset.sap_code,
          "huangou": e.currentTarget.dataset.huangou
        }
      }
      goodlist[`${goods_code}_${goods_format}`] = oneGood;
    }
    let shopcartAll = [],
      priceAll = 0,
      shopcartNum = 0,
      priceFree = 0,
      repurse_price = 0;
    for (let keys in goodlist) {
      //判断是否含有必要参数,如果不含有就直接终止本次循环
      if (!goodlist[keys].goods_price || goodlist[keys].goods_price == 0) {
        continue;
      }

      //
      if (e.currentTarget.dataset.goods_discount) {
        if (goodlist[keys].goods_order_limit && goodlist[keys].goods_order_limit != null && goodlist[`${e.currentTarget.dataset.goods_code}_${goods_format}`].num > e.currentTarget.dataset.goods_order_limit) {
          my.showToast({
            content: `折扣商品限购${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}，超过${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}恢复原价`
          })
        }
      }
      //折扣和套餐的
      if (goodlist[keys].goods_order_limit && goodlist[keys].goods_order_limit != null && goodlist[keys].num > goodlist[keys].goods_order_limit) {
        priceAll += goodlist[keys].goods_price * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        if (keys.indexOf('PKG') == -1) {
          priceFree += (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        }
        //普通商品
      } else if (goodlist[keys].goods_price && goodlist[keys].num) {
        priceAll += goodlist[keys].goods_price * goodlist[keys].num;
      } else {

      }
      // 计算包邮商品价格
      if (!goodlist[keys].goods_discount) {
        priceFree += goodlist[keys].goods_price * goodlist[keys].num;
      }
      // 计算可换购商品价格
      if (app.globalData.repurseGoods && app.globalData.repurseGoods.length > 0) {
        if (goodlist[keys].huangou && goodlist[keys].goods_price && goodlist[keys].num) {
          repurse_price += goodlist[keys].goods_price * goodlist[keys].num;
        }
      } else {
        repurse_price = priceAll
      }
      shopcartAll.push(goodlist[keys]);
      shopcartNum += goodlist[keys].num
    }
    this.setData({
      'shopcartObj': shopcartObj
    })
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
        for (let value of this.data.shopGoods) {
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
