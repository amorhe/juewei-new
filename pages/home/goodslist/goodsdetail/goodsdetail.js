import { imageUrl, imageUrl2, imageUrl3, img_url } from '../../../common/js/baseUrl'
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
    commentArr: [],
    key: '',
    index: '',
    dispatchArr: [],
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
    repurse_price: 0
  },
  onLoad(e) {
    console.log(e)
    let goods = app.globalData.goodsArr
    let goodlist = my.getStorageSync({ key: 'goodsList' }).data || {};
    let goodsInfo = {}, priceAll = 0, shopcartAll = [], shopcartNum = 0, priceFree = 0, repurse_price = 0;
    for (let value of goods) {
      if (value.goods_code == e.goods_code) {
        goodsInfo = value;
        goodsInfo['key'] = e.goodsKey
      }
    }
    for (let keys in goodlist) {
      if (goodlist[keys].goods_order_limit != null && goodlist[keys].num > goodlist[keys].goods_order_limit) {
        priceAll += goodlist[keys].goods_price * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        if (keys.indexOf('PKG') == -1) {
          priceFree += (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        }
      } else {
        priceAll += goodlist[keys].goods_price * goodlist[keys].num;
      }
      // 计算包邮商品价格
      if (!goodlist[keys].goods_discount) {
        priceFree += goodlist[keys].goods_price * goodlist[keys].num;
      }
      // 计算可换购商品价格
      if (goodlist[keys].huangou) {
        repurse_price += goodlist[keys].goods_price * goodlist[keys].num;
      }
      shopcartAll.push(goodlist[keys]);
      shopcartNum += goodlist[keys].num
    }
    this.setData({
      goodsInfo,
      shopcartList: goodlist,
      priceAll,
      shopcartAll,
      shopcartNum,
      goodsKey: e.goodsKey,
      freeMoney: e.freeMoney,
      repurse_price
    })
    const shop_id = my.getStorageSync({ key: 'shop_id' }).data;
    // 购物车活动提示
    this.shopcartPrompt(app.globalData.fullActivity, priceFree, repurse_price)
    // 评论
    this.getCommentList(goodsInfo.goods_code, this.data.pagenum, this.data.pagesize);
    this.getDispatchCommentList(shop_id, this.data.pagenum, this.data.pagesize)
  },
  closeModal(data) {
    this.setData({
      maskView: data.maskView,
      goodsModal: data.goodsModal
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
  onCart(shopcartList, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price) {
    this.setData({
      shopcartList,
      shopcartAll,
      priceAll,
      shopcartNum,
      priceFree,
      repurse_price
    })
    this.shopcartPrompt(app.globalData.fullActivity, priceFree, repurse_price);
  },
  // 购物车
  onchangeShopcart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price) {
    this.onCart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price)
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
          "goods_price": e.currentTarget.dataset.goods_price * 100,
          "num": 1,
          "sumnum": 1,
          "goods_code": e.currentTarget.dataset.goods_code,
          "goods_activity_code": e.currentTarget.dataset.goods_activity_code,
          "goods_discount": e.currentTarget.dataset.goods_discount,
          "goods_original_price": e.currentTarget.dataset.goods_original_price * 100,
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
    let shopcartAll = [], priceAll = 0, shopcartNum = 0, priceFree = 0, repurse_price = 0;
    for (let keys in goodlist) {
      if (e.currentTarget.dataset.goods_discount) {
        if (goodlist[keys].goods_order_limit!=null && goodlist[`${e.currentTarget.dataset.goods_code}_${e.currentTarget.dataset.goods_format}`].num > e.currentTarget.dataset.goods_order_limit) {
          my.showToast({
            content: `折扣商品限购${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}，超过${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}恢复原价`
          });
          priceAll += goodlist[keys].goods_price * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
          if (e.currentTarget.dataset.key == '折扣') {
            priceFree += (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
          }
        } else {
          priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        }
      } else {
        priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        priceFree += goodlist[keys].goods_price * goodlist[keys].num;
      }
      // 计算可换购商品价格
      if (goodlist[keys].huangou) {
        repurse_price += goodlist[keys].goods_price * goodlist[keys].num;
      }
      shopcartAll.push(goodlist[keys]);
      shopcartNum += goodlist[keys].num
    }
    // 购物车活动提示
    this.shopcartPrompt(app.globalData.fullActivity, priceFree, repurse_price);
    this.onchangeShopcart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price)
    this.setData({
      shopcartList: goodlist,
      shopcartAll,
      priceAll,
      shopcartNum
    })
    my.setStorageSync({
      key: 'goodsList', // 缓存数据的key
      data: goodlist, // 要缓存的数据
    });
  },
  reduceshopcart(e) {
    let code = e.currentTarget.dataset.goods_code;
    let format = e.currentTarget.dataset.goods_format;
    let goodlist = my.getStorageSync({ key: 'goodsList' }).data;
    let shopcartAll = [], priceAll = 0, shopcartNum = 0, priceFree = 0, repurse_price = 0;
    goodlist[`${code}_${format}`].num -= 1;
    goodlist[`${code}_${format}`].sumnum -= 1;
    for (let keys in goodlist) {
      if (goodlist[keys].goods_order_limit != null && goodlist[keys].num > goodlist[keys].goods_order_limit) {
        priceAll += goodlist[keys].goods_price * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        if (keys.indexOf('PKG') == -1) {
          priceFree += (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
        }
      } else {
        priceAll += goodlist[keys].goods_price * goodlist[keys].num;
      }
      // 计算包邮商品价格
      if (!goodlist[keys].goods_discount) {
        priceFree += goodlist[keys].goods_price * goodlist[keys].num;
      }
      // 计算可换购商品价格
      if (goodlist[keys].huangou) {
        repurse_price += goodlist[keys].goods_price * goodlist[keys].num;
      }
      shopcartAll.push(goodlist[keys]);
      shopcartNum += goodlist[keys].num
    }
    // 删除
    if (goodlist[`${code}_${format}`].num == 0) {
      shopcartAll = this.data.shopcartAll.filter(item => `${item.goods_code}_${format}` != `${code}_${format}`)
      delete (goodlist[`${code}_${format}`]);
    }
    // 购物车活动提示
    this.shopcartPrompt(app.globalData.fullActivity, priceFree, repurse_price);
    this.onchangeShopcart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price)
    this.setData({
      shopcartList: goodlist,
      shopcartAll,
      priceAll,
      shopcartNum
    })
    my.setStorageSync({
      key: 'goodsList', // 缓存数据的key
      data: goodlist, // 要缓存的数据
    });
  },
  // 购物车活动提示
  shopcartPrompt(oldArr, priceFree, repurse_price) {
    let activityText = '', freeText = '';
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
    if (priceFree == 0) {
      freeText = `满${this.data.freeMoney / 100}元 免配送费`
    } else if (priceFree < this.data.freeMoney) {
      freeText = `还差${(this.data.freeMoney / 100 - priceFree / 100).toFixed(2)}元 免配送费`
    } else {
      freeText = `已满${this.data.freeMoney / 100}元 免配送费`
    }
    // console.log(activityText)
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
  // 商品评价
  getCommentList(goods_code, pagenum, pagesize) {
    commentList(goods_code, pagenum, pagesize, 1).then((res) => {
      // console.log(res)
      this.setData({
        commentArr: res
      })
    })
  },
  // 配送评价
  getDispatchCommentList(shop_id, pagenum, pagesize) {
    DispatchCommentList(shop_id, pagenum, pagesize, 1).then((res) => {
      // console.log(res);
      this.setData({
        dispatchArr: res
      })
    })
  },
  closeModal(data) {
    this.setData({
      maskView: data.maskView,
      goodsModal: data.goodsModal
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
