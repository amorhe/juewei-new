import { imageUrl, imageUrl2, imageUrl3, ak, img_url } from '../../common/js/baseUrl'
import { couponsExpire, MyNearbyShop, GetShopGoods } from '../../common/js/home'
import { datedifference, sortNum, getNowDate } from '../../common/js/time'
var app = getApp();
let tim = null;
Component({
  mixins: [],
  data: {
    imageUrl,
    imageUrl2,
    imageUrl3,
    img_url,
    goodsType: 1, //系列
    togoodsType: 1, //点击跳转
    maskView: false,
    goodsModal: false,
    scrollT: 0,
    couponsExpire: {},          // 优惠券过期提醒     
    isShow: false,  // 优惠券过期提醒是否显示
    companyGoodsList: [],   //公司所有商品
    activityAllObj: [],
    animation: null,
    animationX: null,
    animationY: null,
    goodsItem: {},   //选择规格一条商品
    shopcartList: {},
    priceAll: 0,   // 商品总价
    showBall: false,
    hide_good_box: true,
    ballX: 0,
    ballY: 0,
    shopcartAll: [],  //购物车数组
    shopcartNum: 0,   // 购物车显示总数
    activityText: '',   // 购物车活动提示内容
    priceFree: 0,    // 购物车包邮商品价格
    freeText: '', // 购物车包邮提示内容
    isScorll: true,
    isTab: false,
    type: {
      "折扣": 1,
      "套餐": 2,
      "爆款": 3,
      "超辣": 4,
      "甜辣": 5,
      "微辣": 6,
      "不辣": 7,
      "招牌系列": 8,
      "藤椒系列": 9,
      "素菜系列": 10,
      "黑鸭系列": 11,
      "五香系列": 12,
      "解辣神器": 13,
    },
    repurse_price: 0,    // 购物车换购商品价格
    pagescrollTop: 0,
    leftTop: 0,
    navbarInitTop: 0, //导航栏初始化距顶部的距离
    isFixedTop: false, //是否固定顶部
    shopcart_top: 0,
    shopcart_left: 0,
    togoodsType: 1, //点击跳转
    totalH: 0,
    bottomTabbar: 98,
    freeId: '',
    isiphonex: app.globalData.isIphoneX || false //判断是否是iphonex以上的全面屏
  },
  onInit() {
    // setTimeout(() => {
    //   var query = my.createSelectorQuery();
    //   query.select('.pagesScorll').boundingClientRect();
    //   query.exec((rect) => {
    //     if (rect[0] === null) return;
    //     this.setData({
    //       pagescrollTop: rect[0].top
    //     })
    //   });
    // }, 2000)
    my.createSelectorQuery().select(".e1").boundingClientRect((rect) => {
      this.setData({
        shopcart_top: rect.top
      })
    }).exec()
    //获取节点距离顶部的距离
    setTimeout(() => {
      my.createSelectorQuery().select('.pagesScorll ').boundingClientRect().exec((rect) => {
        if (rect[0] != null) {
          var navbarInitTop = parseInt(rect[0].top);
          this.setData({
            pagescrollTop: navbarInitTop * 200
          });
        }
      });
    }, 2000)
  },
  deriveDataFromProps(nextProps) {
    let
      num = 0, // 购物车总数量
      shopcartAll = [], // 购物车数组
      priceAll = 0, // 总价
      shopcartNum = 0, // 购物车总数量
      priceFree = 0, // 满多少包邮
      shopcartObj = {}, //商品列表 
      repurse_price = 0, // 换购活动提示价
      snum = 0,
      goodsList = my.getStorageSync({
        key: 'goodsList', // 缓存数据的key
      }).data;
    if (goodsList == null) {
      shopcartAll = [];
      shopcartNum = 0;
      priceFree = 0;
      priceAll = 0;
      repurse_price = 0
    };
    // 判断购物车商品是否在当前门店里
    for (let val in goodsList) {
      if (goodsList[val].goods_discount) {
        if (app.globalData.DIS != null || app.globalData.PKG != null) {
          // 折扣
          if (goodsList[val].goods_code.indexOf('PKG') == -1 && app.globalData.DIS != null) {
            for (let ott of app.globalData.DIS) {
              for (let fn of ott.goods_format) {
                if (val == `${fn.goods_activity_code}_${fn.type}`) {
                  shopcartObj[val] = goodsList[val];
                  // 判断购物车商品价格更新
                  if (goodsList[val].goods_price != fn.goods_price) {
                    snum += shopcartObj[val].num;
                    shopcartObj[val].goods_price = fn.goods_price
                  }
                }
              }
            }
          } else {
            // 套餐
            if (app.globalData.PKG != null) {
              for (let ott of app.globalData.PKG) {
                for (let fn of ott.goods_format) {
                  if (val == `${fn.goods_activity_code}_${fn.type}`) {
                    shopcartObj[val] = goodsList[val];
                    // 判断购物车商品价格更新
                    if (goodsList[val].goods_price != fn.goods_price) {
                      snum += shopcartObj[val].num;
                      shopcartObj[val].goods_price = fn.goods_price
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
                if (goodsList[val].goods_price != fn.goods_price) {
                  snum += shopcartObj[val].num;
                  shopcartObj[val].goods_price = fn.goods_price
                }
              }
            }
          }
        }
      }
      num += goodsList[val].num;
      // 计算购物车是否在门店内后筛选剩余商品价格
      if (shopcartObj[val]) {//判断商品是否存在
        if (shopcartObj[val].goods_discount && shopcartObj[val].num > shopcartObj[val].goods_order_limit) {
          priceAll += shopcartObj[val].goods_price * shopcartObj[val].goods_order_limit + (shopcartObj[val].num - goodsList[val].goods_order_limit) * shopcartObj[val].goods_original_price;
          priceFree += (shopcartObj[val].num - shopcartObj[val].goods_order_limit) * shopcartObj[val].goods_original_price;
        } else {
          priceAll += shopcartObj[val].goods_price * shopcartObj[val].num;
        }
        if (!shopcartObj[val].goods_discount) {
          priceFree += shopcartObj[val].goods_price * shopcartObj[val].num;
        }
        if (shopcartObj[val].huangou) {
          repurse_price += shopcartObj[val].goods_price * shopcartObj[val].num;
        }
        shopcartAll.push(shopcartObj[val]);
        shopcartNum += shopcartObj[val].num;
      }
    }
    // 购物车活动提示
    this.shopcartPrompt(nextProps.fullActivity, priceFree, repurse_price);
    if (!my.getStorageSync({ key: 'goodsList' }).data) {
      this.onchangeShopcart({}, [], 0, 0, 0);
    }
    this.setData({
      shopcartList: shopcartObj,
      priceAll,
      shopcartAll,
      shopcartNum,
      priceFree,
      freeMoney: nextProps.freeMoney,
      repurse_price
    })

  },
  didMount() {
    const _sid = my.getStorageSync({ key: '_sid' });
    this.getcouponsExpire(_sid.data);
  },
  didUpdate() {

  },
  didUnmount() { },
  methods: {
    // 优惠券过期提醒
    getcouponsExpire(_sid) {
      couponsExpire(_sid).then((res) => {
        // console.log(res)
        if (Object.keys(res.data).length > 0) {
          res.data.days = datedifference(getNowDate(), res.data.end_time)
          this.setData({
            couponsExpire: res.data,
            isShow: true
          })
        } else {
          this.setData({
            isShow: false
          })
        }

      })
    },
    closeCouponView() {
      this.setData({
        isShow: false
      })
    },
    // 选择系列
    chooseGoodsType(e) {
      // 获取scrolltop这个不太准确，无法获取准确的
      // console.log('this.data.pagescrollTop',this.data.pagescrollTop);

      // 加锁
      // this.setData({
      //   goodsType: e.currentTarget.dataset.type, //当前的节点
      //   togoodsType: e.currentTarget.dataset.type, //用于左侧选择右侧
      //   isTab: true
      // })
      // my.pageScrollTo({
      //   scrollTop: this.data.pagescrollTop,
      // });
    },
    // 选规格
    chooseSizeTap(e) {
      this.setData({
        maskView: true,
        goodsModal: true,
        goodsItem: e.currentTarget.dataset.item,
        goodsKey: e.currentTarget.dataset.key,
        goodsLast: e.currentTarget.dataset.index
      })
    },
    closeModal(data) {
      this.setData({
        maskView: data.maskView,
        goodsModal: data.goodsModal
      })
    },
    onTouchStart(e) {
      // this.setData({
      //   y1: e.changedTouches[0].pageY,
      //   isTab: false
      // })
    },
    // 滑动
    onTouchEnd(e) {
      // let that = this;
      // let y2 = e.changedTouches[0].pageY;
      // if (this.data.y1 - y2 > 50) {
      //   my.pageScrollTo({
      //     scrollTop: this.data.pagescrollTop,
      //   });
      // }
      // this.setData({
      //   isTab: false
      // })
      //手势移开
      //e没有可用参数所以用查询办法
      my.createSelectorQuery().select('.scrolllist').scrollOffset().exec((ret) => {
        if (ret[0].scrollTop > 0) {
          wx.pageScrollTo({
            scrollTop: 999999 //这里可以给了最大的数字，来代表滚动到最底部就可以了  this.data.pagescrollTop
          })
        }
      })
    },
    onScroll(e) {
      //只执行最后一次，其他中间次数不执行。
      //页面滚动一直触发。
      // var that=this;
      // if (!that.data.isTab) {
      //   let retArr = [...app.globalData.ret]; //已经排序好了
      //   my.createSelectorQuery().select('.scrolllist').scrollOffset().exec((ret) => {
      //     let sum =0;
      //     if(retArr.indexOf(ret[0].scrollTop)>-1){
      //         retArr.push(ret[0].scrollTop+1);
      //         retArr.sort((a, b) => a - b);
      //         sum = retArr.findIndex(item => (item == (ret[0].scrollTop+1)));
      //     }else{
      //         retArr.push(ret[0].scrollTop);
      //         retArr.sort((a, b) => a - b);
      //         sum = retArr.findIndex(item => (item == ret[0].scrollTop));
      //     }
      //     //sum 1开始  goodsType默认1开始
      //     if (that.data.goodsType != sum) {
      //           that.setData({
      //             goodsType: sum
      //           })
      //     }
      //   })
      // }
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
    },
    // 购物车
    onchangeShopcart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price) {
      this.onCart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price)
    },
    addshopcart(e) {
      let goods_car = {};
      let goods_code = e.currentTarget.dataset.goods_code;;
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
            "goods_original_price": e.currentTarget.dataset.goods_original_price,
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
          if (goodlist[keys].goods_order_limit != null && goodlist[`${e.currentTarget.dataset.goods_code}_${e.currentTarget.dataset.goods_format}`].num > e.currentTarget.dataset.goods_order_limit) {
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
        shopcartList: goodlist,
        shopcartAll,
        priceAll,
        shopcartNum,
        priceFree,
        repurse_price
      })
      my.setStorageSync({
        key: 'goodsList', // 缓存数据的key
        data: goodlist, // 要缓存的数据
      });
    },
    reduceshopcart(e) {
      let code = e.currentTarget.dataset.goods_code;
      let format = e.currentTarget.dataset.goods_format
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
      this.setData({
        shopcartList: goodlist,
        shopcartAll,
        priceAll,
        shopcartNum,
        priceFree,
        repurse_price
      })
      my.setStorageSync({
        key: 'goodsList', // 缓存数据的key
        data: goodlist, // 要缓存的数据
      });
    },
    // 购物车活动提示
    shopcartPrompt(oldArr, priceFree, repurse_price) {
      let activityText = '', freeText = '';
      if (oldArr == []) {
        return
      }
      for (let v of oldArr) {
        if (oldArr.findIndex(v => v > repurse_price) != -1) {
          if (oldArr.findIndex(v => v > repurse_price) == 0) {
            activityText = `只差${(oldArr[0] - repurse_price) / 100}元,超值福利等着你!`;
          } else if (oldArr.findIndex(v => v > repurse_price) > 0 && oldArr.findIndex(v => v > repurse_price) < oldArr.length) {
            activityText = `已购满${oldArr[oldArr.findIndex(v => v > repurse_price) - 1] / 100}元,去结算享受换购优惠;满${oldArr[oldArr.findIndex(v => v > repurse_price)] / 100}元更高福利等着你!`
          } else {
            activityText = `已购满${oldArr[oldArr.length - 1] / 100}元,去结算获取优惠!`;
          }
        } else {
          activityText = `已购满${oldArr[oldArr.length - 1] / 100}元,去结算获取优惠!`;
        }
      }
      if (this.data.freeMoney > 0) {
        if (priceFree == 0) {
          freeText = `满${this.data.freeMoney / 100}元 免配送费`
        } else if (priceFree < this.data.freeMoney) {
          freeText = `还差${(this.data.freeMoney / 100 - priceFree / 100).toFixed(2)}元 免配送费`
        } else {
          freeText = `已满${this.data.freeMoney / 100}元 免配送费`
        }
      }
      this.setData({
        activityText,
        freeText
      })
    },
    // 商品详情
    goodsdetailContent(e) {
      my.navigateTo({
        url: '/pages/home/goodslist/goodsdetail/goodsdetail?goods_code=' + e.currentTarget.dataset.goods_code + '&goodsKey=' + e.currentTarget.dataset.key + '&freeMoney=' + e.currentTarget.dataset.freeMoney
      });
    },
    // 清空购物车
    onClear() {
      this.setData({
        shopcartList: {}
      })
    }
  },
});
