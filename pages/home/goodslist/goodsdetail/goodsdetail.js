import { imageUrl, imageUrl2, imageUrl3, img_url, myGet, mySet } from '../../../common/js/baseUrl'
import { commentList, DispatchCommentList } from '../../../common/js/home'
var app = getApp();
Page({
  data: {
    activeTab: 0,
    tabActive: 0,
    tabs: [
      {
        title: '商品简介'
      },
      {
        title: '商品详情'
      }
    ],
    tabsT: [
      {
        title: '商品口味'
      },
      {
        title: '配送服务'
      }
    ],
    imageUrl,
    imageUrl2,
    imageUrl3,
    img_url,
    // 评论
    commentArr: {},//商品评价
    key: '',
    index: '',
    dispatchArr: {},//配送评论
    maskView: false,
    goodsItem: {},
    shopcartList: {},
    shopcartAll: [],
    priceAll: 0,
    goodsLast: '',
    shopcartNum: 0,
    goodsKey: '',
    activityText: '',
    pagenum: 1,
    pagesize: 10,
    freeText: '',
    freeMoney: 0,
    goodsInfo: {},
    repurse_price: 0,
    shopcarShow:false
  },
  onLoad: function(e) {
    my.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    this.setData({
      goods_code: e.goods_code
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    my.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  onShow(e) {
    my.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    let isPhone = app.globalData.isIphoneX;
    let
      num = 0, // 购物车总数量
      shopcartAll = [], // 购物车数组
      priceAll = 0, // 总价
      shopcartNum = 0, // 购物车总数量
      priceFree = 0, // 满多少包邮
      shopcartObj = {}, //商品列表 
      repurse_price = 0, // 换购活动提示价
      snum = 0,
      goodsInfo = {},
      goods = app.globalData.goodsArr,
      shop_id = myGet('shop_id') || {},
      DIS = app.globalData.DIS,
      PKG = app.globalData.PKG,
      goodsList = myGet('goodsList');
    if (goodsList == undefined) {
      shopcartAll = [];
      shopcartNum = 0;
      priceFree = 0;
      priceAll = 0;
      repurse_price = 0
    };
    for (let value of goods) {
      // 折扣套餐爆款
      if (value.goods_discount_user_limit || value.goods_discount_id) {
        if (value.goods_format[0].goods_activity_code == this.data.goods_code) {
          goodsInfo = value;
        }
      } else {
        if (value.goods_channel + value.goods_type + value.company_goods_id == this.data.goods_code) {
          goodsInfo = value;
        }
      }
    }
    // 判断购物车商品是否在当前门店里
    for (let val in goodsList) {
      if (goodsList[val].goods_discount) {
        if (DIS != null || PKG != null) {
          // 折扣
          if (goodsList[val].goods_code.indexOf('PKG') == -1 && DIS != null) {
            for (let ott of DIS) {
              for (let fn of ott.goods_format) {
                if (val == `${fn.goods_activity_code}_${fn.type}`) {
                  shopcartObj[val] = goodsList[val];
                  // 判断购物车商品价格更新
                  if (goodsList[val].goods_price != parseInt(fn.goods_price)) {
                    snum += shopcartObj[val].num;
                    shopcartObj[val].goods_price = parseInt(fn.goods_price)
                  }
                }
              }
            }
          } else {
            // 套餐
            if (PKG != null) {
              for (let ott of PKG) {
                for (let fn of ott.goods_format) {
                  if (val == `${fn.goods_activity_code}_${fn.type != undefined ? fn.type : ''}`) {
                    shopcartObj[val] = goodsList[val];
                    // 判断购物车商品价格更新
                    if (goodsList[val].goods_price !=  parseInt(fn.goods_price)) {
                      snum += shopcartObj[val].num;
                      shopcartObj[val].goods_price =  parseInt(fn.goods_price)
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        // 普通不带折扣的
        if (app.globalData.goodsCommon) {
          for (let value of app.globalData.goodsCommon) {
            for (let fn of value.goods_format) {
              // 在门店
              if (val == `${value.goods_channel}${value.goods_type}${value.company_goods_id}_${fn.type}`) {
                shopcartObj[val] = goodsList[val];
                // 判断购物车商品价格更新
                if (goodsList[val].goods_price !=  parseInt(fn.goods_price)) {
                  snum += shopcartObj[val].num;
                  shopcartObj[val].goods_price =  parseInt(fn.goods_price)
                }
              }
            }
          }
        }
      }
      num += goodsList[val].num;
      // 计算购物车是否在门店内后筛选剩余商品价格
      if (shopcartObj[val]) { //判断商品是否存在
        if (shopcartObj[val].goods_discount && shopcartObj[val].num > shopcartObj[val].goods_order_limit) {
          priceAll += parseInt(shopcartObj[val].goods_price) * shopcartObj[val].goods_order_limit + (shopcartObj[val].num - goodsList[val].goods_order_limit) * shopcartObj[val].goods_original_price;
          priceFree += (shopcartObj[val].num - shopcartObj[val].goods_order_limit) * shopcartObj[val].goods_original_price;
        } else if (shopcartObj[val].goods_price && shopcartObj[val].num) {
          priceAll += parseInt(shopcartObj[val].goods_price) * shopcartObj[val].num;
        } else {

        }
        // 计算包邮商品价格
        if (!shopcartObj[val].goods_discount) {
          priceFree += shopcartObj[val].goods_price * shopcartObj[val].num;
        }
        // 计算可换购商品价格
        if (app.globalData.repurseGoods && app.globalData.repurseGoods.length > 0) {
          if (shopcartObj[val].huangou && shopcartObj[val].goods_price && shopcartObj[val].num) {
            repurse_price += parseInt(shopcartObj[val].goods_price) * shopcartObj[val].num;
          }
        } else {
          repurse_price = parseInt(priceAll)
        }
        shopcartAll.push(shopcartObj[val]);
        shopcartNum += shopcartObj[val].num;
      }
    }
    // 购物车活动提示
    if (!myGet('goodsList')) {
      let data = {}
      this.onchangeShopcart(data);
    } else {
      this.shopcartPrompt(app.globalData.fullActivity, priceFree, repurse_price)
    }
    this.setData({
      shopcartList: shopcartObj,
      priceAll,
      shopcartAll,
      shopcartNum,
      priceFree,
      repurse_price,
      goodsInfo,
      freeMoney: app.globalData.freeMoney || -1,
      repurse_price,
      freeId: app.globalData.freeId,
      type: app.globalData.type
    })
    mySet('goodsList', shopcartObj);
    // 评论
    this.getCommentList(this.data.goods_code, this.data.pagenum, this.data.pagesize);
    this.getDispatchCommentList(shop_id, this.data.pagenum, this.data.pagesize)
  },
  closeModal(data) {
    this.setData({
      maskView: data.detail.maskView,
      goodsModal: data.detail.goodsModal
    })
  },
  funOpenShopcar(data){
    this.setData({
      shopcarShow: data.detail
    })
  },
  changeMenu(e) {
    this.setData({
      activeTab: e.currentTarget.dataset.cur
    })
  },
  changeTab(e) {
    this.setData({
      tabActive: e.currentTarget.dataset.cur,
      pagenum: 1
    });
  },
  // sku商品
  onCart(data) {
    if (Object.keys(data).length == 0) {
      return
    }
    console.log('onCart',data);
    this.setData({
      shopcartList: data.detail.goodlist || {},
      shopcartAll: data.detail.shopcartAll || [],
      priceAll: data.detail.priceAll || 0,
      shopcartNum: data.detail.shopcartNum || 0,
      priceFree: data.detail.priceFree || 0,
      repurse_price: data.detail.repurse_price || 0
    })
    // 购物车活动提示
    this.shopcartPrompt(app.globalData.fullActivity, data.detail.priceFree || 0, data.detail.repurse_price || 0);
  },
  // 购物车
  onchangeShopcart(data) {
    this.onCart(data)
  },
  addshopcart(e) {
    let goods_car = {};
    let goods_code = e.currentTarget.dataset.goods_code;
    let goods_format = e.currentTarget.dataset.goods_format;
    let goodlist = my.getStorageSync({ key: 'goodsList' }).data || {};
    if (goodlist[`${goods_code}_${goods_format}`]) {
      goodlist[`${goods_code}_${goods_format}`].num += 1;
      goodlist[`${goods_code}_${goods_format}`].sumnum += 1;
    } else {
      let oneGood = {};
      if (e.currentTarget.dataset.goods_discount) {
        oneGood = {
          "goods_name": e.currentTarget.dataset.goods_name,
          "taste_name": e.currentTarget.dataset.taste_name,
          "goods_price": parseInt(parseFloat(e.currentTarget.dataset.goods_price) * 100),
          "num": 1,
          "sumnum": 1,
          "goods_code": e.currentTarget.dataset.goods_code,
          "goods_activity_code": e.currentTarget.dataset.goods_activity_code,
          "goods_discount": e.currentTarget.dataset.goods_discount,
          "goods_original_price": parseInt(e.currentTarget.dataset.goods_original_price * 100),
          "goods_discount_user_limit": e.currentTarget.dataset.goods_discount_user_limit,
          "goods_order_limit": e.currentTarget.dataset.goods_order_limit,
          "goods_format": goods_format,
          "goods_img": e.currentTarget.dataset.goods_img,
          "sap_code": e.currentTarget.dataset.sap_code
        }
      } else {
        oneGood = {
          "goods_name": e.currentTarget.dataset.goods_name,
          "taste_name": e.currentTarget.dataset.taste_name,
          "goods_price": parseInt(parseFloat(e.currentTarget.dataset.goods_price) * 100),
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
    let shopcartAll = [], priceAll = 0, shopcartNum = 0, priceFree = 0, repurse_price = 0;
    for (let keys in goodlist) {
      if (!goodlist[keys].goods_price) {
        continue;
      }
      if (e.currentTarget.dataset.goods_discount) {
        if (goodlist[keys].goods_order_limit && goodlist[keys].goods_order_limit != null && goodlist[`${e.currentTarget.dataset.goods_code}_${goods_format}`].num > e.currentTarget.dataset.goods_order_limit) {
          my.showToast({
            content: `折扣商品限购${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}，超过${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}恢复原价`
          })
        }
      }
      if (goodlist[keys].goods_order_limit && goodlist[keys].goods_order_limit != null && goodlist[keys].num > goodlist[keys].goods_order_limit) {
        priceAll += parseInt(goodlist[keys].goods_price) * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        if (keys.indexOf('PKG') == -1) {
          priceFree += (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        }
      } else if (goodlist[keys].goods_price && goodlist[keys].num) {
        priceAll += parseInt(goodlist[keys].goods_price) * goodlist[keys].num;
      } else {

      }
      // 计算包邮商品价格
      if (!goodlist[keys].goods_discount) {
        priceFree += goodlist[keys].goods_price * goodlist[keys].num;
      }
      // 计算可换购商品价格
      if (app.globalData.repurseGoods && app.globalData.repurseGoods.length > 0) {
        if (goodlist[keys].huangou && goodlist[keys].goods_price && goodlist[keys].num) {
          repurse_price += parseInt(goodlist[keys].goods_price) * goodlist[keys].num;
        }
      } else {
        repurse_price = parseInt(priceAll)
      }
      shopcartAll.push(goodlist[keys]);
      shopcartNum += goodlist[keys].num
    }
    let datas = {
      detail: {
        goodlist,
        shopcartAll,
        priceAll,
        shopcartNum,
        priceFree,
        repurse_price
      }
    };
    this.onchangeShopcart(datas)
    this.setData({
      shopcartList: goodlist,
      shopcartAll,
      priceAll,
      shopcartNum
    })
    mySet('goodsList', goodlist)
  },
  reduceshopcart(e) {
    let code = e.currentTarget.dataset.goods_code;
    let format = e.currentTarget.dataset.goods_format;
    let goodlist = my.getStorageSync({ key: 'goodsList' }).data;
    let shopcartAll = [], priceAll = 0, shopcartNum = 0, priceFree = 0, repurse_price = 0, newGoodlist = {};
    goodlist[`${code}_${format}`].num -= 1;
    goodlist[`${code}_${format}`].sumnum -= 1;
    for (let keys in goodlist) {
      if (!goodlist[keys].goods_price) {
        continue;
      }
      if (goodlist[keys].goods_order_limit && goodlist[keys].goods_order_limit != null && goodlist[keys].num > goodlist[keys].goods_order_limit) {
        priceAll += parseInt(goodlist[keys].goods_price) * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        if (keys.indexOf('PKG') == -1) {
          priceFree += (parseInt(goodlist[keys].num) - parseInt(goodlist[keys].goods_order_limit)) * parseInt(goodlist[keys].goods_original_price);
        }
      } else if (goodlist[keys].goods_price && goodlist[keys].num){
        priceAll += parseInt(goodlist[keys].goods_price) * goodlist[keys].num;
      } else {

      }
      // 计算包邮商品价格
      if (!goodlist[keys].goods_discount) {
        priceFree += goodlist[keys].goods_price * goodlist[keys].num;
      }
      // 计算可换购商品价格
      if (app.globalData.repurseGoods && app.globalData.repurseGoods.length > 0) {
        if (goodlist[keys].huangou && goodlist[keys].goods_price && goodlist[keys].num) {
          repurse_price += parseInt(goodlist[keys].goods_price) * goodlist[keys].num;
        }
      } else {
        repurse_price = parseInt(priceAll)
      }
      if (goodlist[keys].num > 0) {
        newGoodlist[keys] = goodlist[keys]
        shopcartAll.push(goodlist[keys]);
        shopcartNum += goodlist[keys].num
      }
    }
    let datas = {
      detail: {
        goodlist,
        shopcartAll,
        priceAll,
        shopcartNum,
        priceFree,
        repurse_price
      }
    };
    this.onchangeShopcart(datas)
    this.setData({
      shopcartList: newGoodlist,
      shopcartAll,
      priceAll,
      shopcartNum
    })
    mySet('goodsList',newGoodlist)
  },
  // 购物车活动提示
  shopcartPrompt(oldArr, priceFree, repurse_price) {
    let activityText = '',
      freeText = '';
    for (let v of oldArr) {
      if (oldArr.findIndex(v => v > repurse_price) != -1) {
        if (oldArr.findIndex(v => v > repurse_price) == 0) {
          activityText = `只差${(oldArr[0] - repurse_price) / 100}元,超值福利等着你!`
        } else if (oldArr.findIndex(v => v > repurse_price) > 0 && oldArr.findIndex(v => v > repurse_price) < oldArr.length) {
          activityText = `已购满${oldArr[oldArr.findIndex(v => v > repurse_price) - 1] / 100}元,去结算享受换购优惠;满${oldArr[oldArr.findIndex(v => v > repurse_price)] / 100}元更高福利等着你!`
        } else {
          activityText = `已购满${oldArr[oldArr.length - 1] / 100}元,去结算获取优惠!`
        }
      } else {
        activityText = `已购满${oldArr[oldArr.length - 1] / 100}元,去结算获取优惠!`
      }
    }
    if (this.data.freeMoney > 0) {
      app.globalData.freetf = false; //orderconform中是否传送freeid
      if (priceFree == 0) {
        freeText = `满${this.data.freeMoney / 100}元 免配送费`
      } else if (priceFree < this.data.freeMoney) {
        freeText = `还差${(this.data.freeMoney / 100 - priceFree / 100).toFixed(2)}元 免配送费`
      } else {
        freeText = `已满${this.data.freeMoney / 100}元 免配送费`
        //加入变量说明可以免配送
        app.globalData.freetf = true;
      }
    } else if (this.data.freeMoney == 0) {
      freeText = '免配送费'
      //加入变量说明可以免配送
      app.globalData.freetf = true;
    }
    this.setData({
      activityText,
      freeText
    })
  },
  // 清空购物车
  onClear() {
    this.setData({
      shopcartList: {}
    })
  },
  funGetMoreComment() {
    this.data.pagenum++;
    this.getCommentList(this.data.goodsInfo.goods_code, this.data.pagenum, this.data.pagesize);
  },
  funGetMoreDispatch() {
    this.data.pagenum++;
    const shop_id = myGet('shop_id') || '';
    this.getDispatchCommentList(shop_id, this.data.pagenum, this.data.pagesize)
  },
  // 商品评价
  getCommentList(goods_code, pagenum, pagesize) {
    let that = this;
    commentList(goods_code, pagenum, pagesize, 1).then((res) => {
      // 这里判断一下
      if (that.data.commentArr.data && that.data.commentArr.data.length > 0) {
        res.data = [...that.data.commentArr.data, ...res.data];
      }
      this.setData({
        commentArr: res
      })
    })
  },
  // 配送评价
  getDispatchCommentList(shop_id, pagenum, pagesize) {
    let that = this;
    DispatchCommentList(shop_id, pagenum, pagesize, 1).then((res) => {
      // 这里判断一下
      if (that.data.dispatchArr.data && that.data.dispatchArr.data.length > 0) {
        res.data = [...that.data.dispatchArr.data, ...res.data];
      }
      this.setData({
        dispatchArr: res
      })
    })
  },
  // 选规格
  chooseSizeTap(e) {
    this.setData({
      maskView: true,
      goodsModal: true,
      goodsItem: e.currentTarget.dataset.item
    })
  },
  onReachBottom() {
    this.data.pagenum++;
    const shop_id = my.getStorageSync({ key: 'shop_id' }).data;
    this.getCommentList(this.data.goodsInfo.goods_code, this.data.pagenum, this.data.pagesize);
    this.getDispatchCommentList(shop_id, this.data.pagenum, this.data.pagesize)
  }
});
