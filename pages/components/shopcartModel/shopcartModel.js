import { imageUrl, jsonUrl, myGet, mySet } from '../../common/js/baseUrl'
import { compare, upformId } from '../../common/js/time'
var app = getApp();
Component({
  data: {
    showShopcar: false,  //购物车
    mask: false, //遮罩
    imageUrl,
    modalShow: false, //弹框
    mask1: false,
    send_price: "",   //起送费
    dispatch_price: '', // 配送费
    isType: '',
    content: '',
    otherGoods: [],
    confirmButtonText: '',
    cancelButtonText: '',
    type: '',
    btnClick: true,
    freeId: false,   // 是否有包邮活动
    isTake: false,
    isOpen: ''
  },
  props: {
    shopcartAll: [],
    shopcartNum: 0,
    priceAll: 0,
    activityText: '',
    freeText: '',
    mask1:false,
    onOpenShopcar:(data) => {console.log(data)}
  },
  //组件创建时触发
  onInit() { },
  //组件创建时和更新前触发
  deriveDataFromProps(nextProps) {
    // 判断是不是起送
    if (app.globalData.type == 1) {
      this.setData({
        type: 1,
        isTake: true
      })
    } else {
      this.setData({
        type: 2,
        isTake: false
      })
    }
    if (app.globalData.freeId) {
      this.setData({
        freeId: true
      })
    } else {
      this.setData({
        freeId: false
      })
    }
    this.setData({
      isOpen: app.globalData.isOpen
    })
    //更新起送价
    this.getSendPrice();
  },
  //组件创建完毕后触发
  didMount() {
    this.getSendPrice();
  },
  //组件更新完毕触发
  didUpdate() { 

  },
  //组件删除时触发
  didUnmount() { },
  methods: {
    // 打开购物车
    openShopcart() {
      this.setData({
        showShopcar: true,
        mask1: true
      })
   
       this.props.onOpenShopcar({
        detail: true
      });
    },
    // 隐藏购物车
    hiddenShopcart() {
      this.setData({
        showShopcar: false,
        mask1: false
      })
      
      this.props.onOpenShopcar({
        detail: false
      });
    },
    // 清空购物车
    clearShopcart() {
      this.setData({
        showShopcar: false,
        mask1: false,
        mask: true,
        modalShow: true,
        isType: 'clearShopcart',
        content: '是否清空购物车',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
      this.props.onOpenShopcar({
        detail: false
      });
    },
    onCounterPlusOne(data) {
      this.setData({
        mask: data.mask,
        modalShow: data.modalShow
      })
      if (data.isType == 'clearShopcart' && data.type == 1) {
        // 清空购物车
        app.globalData.goodsBuy = [];
        my.removeStorageSync({ key: 'goodsList' });
        this.changeshopcart({}, [], 0, 0, 0, 0);
      }
      if (data.isType == 'checkshopcart' && data.type == 0 && this.props.shopcartNum > 0) {
        app.globalData.goodsBuy = this.props.shopcartAll;
        my.navigateTo({
          url: '/pages/home/orderform/orderform'
        })
      }
    },
    changeshopcart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price) {
      let data = {
        goodlist,
        shopcartAll,
        priceAll,
        shopcartNum,
        priceFree,
        repurse_price
      }
      //运行父级函数，向上传递更新的参数
      this.props.onChangeShopcart({
        detail: data
      });
    },
    addshopcart(e) {
      let goodlist = myGet('goodsList') || {};
      let goods_code = e.currentTarget.dataset.goods_code;
      let goods_format = e.currentTarget.dataset.goods_format
      goodlist[`${goods_code}_${goods_format}`].num += 1;
      let shopcartAll = [],
        priceAll = 0,
        shopcartNum = 0,
        priceFree = 0,
        repurse_price = 0;
      for (let keys in goodlist) {
        if (!goodlist[keys].goods_price) {
          continue;
        }
        if (e.currentTarget.dataset.goods_discount) {
          if (goodlist[keys].goods_order_limit != null && goodlist[`${e.currentTarget.dataset.goods_code}_${goods_format}`].num > e.currentTarget.dataset.goods_order_limit) {
            my.showToast({
              content: `折扣商品限购${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}，超过${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}恢复原价`
            })
          }
        }
        if (goodlist[keys].goods_order_limit != null && goodlist[keys].num > goodlist[keys].goods_order_limit) {
          priceAll += parseInt(goodlist[keys].goods_price) * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
          //套餐不算在内
          if (keys.indexOf('PKG') == -1) {
            priceFree += (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
          }
        } else if (goodlist[keys].goods_price && goodlist[keys].num) {
          priceAll += parseInt(goodlist[keys].goods_price) * goodlist[keys].num;
        } else {

        }
        //计算包邮价格
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
      let arr = shopcartAll.filter(item => item.goods_code == goods_code)
      for (let item of arr) {
        goodlist[`${item.goods_code}_${item.goods_format}`].sumnum += 1;
      }
      this.changeshopcart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price)
      mySet('goodsList', goodlist)
    },
    reduceshopcart(e) {
      let code = e.currentTarget.dataset.goods_code;
      let format = e.currentTarget.dataset.goods_format
      let goodlist = myGet('goodsList') || {};
      goodlist[`${code}_${format}`].num -= 1;
      // 删除
      let shopcartAll = [],
        priceAll = 0,
        shopcartNum = 0,
        priceFree = 0,
        repurse_price = 0,
        newGoodlist = {};
      let arr = this.props.shopcartAll.filter(item => item.goods_code == code)
      for (let item of arr) {
        goodlist[`${item.goods_code}_${item.goods_format}`].sumnum -= 1;
      }
      for (let keys in goodlist) {
        if (!goodlist[keys].goods_price) {
          continue;
        }
        if (goodlist[keys].goods_order_limit && goodlist[keys].num > goodlist[keys].goods_order_limit) {
          priceAll +=  parseInt(goodlist[keys].goods_price) * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
          //套餐不算在内
          if (keys.indexOf('PKG') == -1) {
            priceFree += (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
          }
        } else if (goodlist[keys].goods_price && goodlist[keys].num) {
          priceAll += parseInt(goodlist[keys].goods_price) * goodlist[keys].num;
        } else {

        }
        //计算包邮价格
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
          newGoodlist[keys] = goodlist[keys];
          shopcartAll.push(goodlist[keys]);
          shopcartNum += goodlist[keys].num
        }
      }
      this.changeshopcart(newGoodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price);
      mySet('goodsList', newGoodlist)
      // 购物车全部为空
      if (Object.keys(newGoodlist).length == 0) {
        this.setData({
          showShopcar: false,
          mask1: false
        })
      }
    },
    // 去结算
    goOrderSubmit() {
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

      //  数据加载完成前防止点击
      if (!app.globalData.goodsArr) {
        return
      }
      // 未登录
      if (!my.getStorageSync({ key: 'user_id' }) || !my.getStorageSync({ key: 'user_id' }).data) {
        my.navigateTo({
          url: '/pages/login/auth/auth?next=true'
        })
        return
      }
      // 未选择商品
      if (this.props.shopcartGoods) {
        my.showToast({
          content: "请至少选择一件商品"
        });
        return
      }

      let goodsList = my.getStorageSync({
        key: 'goodsList', // 缓存数据的key
      }).data;
      let
        num = 0, // 购物车总数量
        shopcartAll = [], // 购物车数组
        priceAll = 0, // 总价
        shopcartNum = 0, // 购物车总数量
        priceFree = 0, // 满多少包邮
        shopcartObj = {}, //商品列表 
        repurse_price = 0, // 换购活动提示价
        snum = 0,
        DIS = app.globalData.DIS || [],
        PKG = app.globalData.PKG || [],
        isfresh1 = false,
        isfresh2 = false,
        isfresh3 = false;
      if (goodsList == null) return;
      // 判断购物车商品是否在当前门店里
      for (let val in goodsList) {
        if (goodsList[val].goods_discount) {
          // 折扣
          if (goodsList[val].goods_code.indexOf('PKG') == -1) {
            for (let ott of DIS) {
              for (let fn of ott.goods_format) {
                if (val == `${fn.goods_activity_code}_${fn.type}`) {
                  shopcartObj[val] = goodsList[val];
                  // 判断购物车商品价格更新
                  if (parseInt(goodsList[val].goods_price) != parseInt(fn.goods_price)) {
                    snum += shopcartObj[val].num;
                    shopcartObj[val].goods_price = fn.goods_price;
                    isfresh1 = true;
                  }
                }
              }
            }

          } else {
            // 套餐
            for (let ott of PKG) {
              for (let fn of ott.goods_format) {
                if (val == `${fn.goods_activity_code}_${(fn.type ? fn.type : '')}`) {
                  shopcartObj[val] = goodsList[val];
                  // 判断购物车商品价格更新
                  if (parseInt(goodsList[val].goods_price) != parseInt(fn.goods_price)) {
                    snum += shopcartObj[val].num;
                    shopcartObj[val].goods_price = fn.goods_price;
                    isfresh2 = true;
                  }
                }
              }
            }
          }
        } else {
          // 普通不带折扣的
          for (let value of app.globalData.goodsCommon) {
            for (let fn of value.goods_format) {
              // 在门店
              if (val == `${value.goods_channel}${value.goods_type}${value.company_goods_id}_${fn.type}`) {
                shopcartObj[val] = goodsList[val];
                // 判断购物车商品价格更新
                if (parseInt(goodsList[val].goods_price) != parseInt(fn.goods_price)) {
                  snum += shopcartObj[val].num;
                  shopcartObj[val].goods_price = fn.goods_price;
                  isfresh3 = true;
                }
              }
            }
          }
        }
        num += goodsList[val].num;
        // 计算购物车是否在门店内后筛选剩余商品价格
        if (shopcartObj[val]) {//判断商品是否存在
          if (shopcartObj[val].goods_discount && shopcartObj[val].num > shopcartObj[val].goods_order_limit) {
            priceAll += parseInt(shopcartObj[val].goods_price) * shopcartObj[val].goods_order_limit + (shopcartObj[val].num - goodsList[val].goods_order_limit) * shopcartObj[val].goods_original_price;
          } else {
            priceAll += parseInt(shopcartObj[val].goods_price) * shopcartObj[val].num;
          }
          // 计算包邮价格
          if (!shopcartObj[val].goods_discount) {
            priceFree += parseInt(shopcartObj[val].goods_price) * shopcartObj[val].num;
          }else{

          }
          //计算换购价格
          if (app.globalData.repurseGoods && app.globalData.repurseGoods.length > 0) {
            if (goodlist[keys].huangou && goodlist[keys].goods_price && goodlist[keys].num) {
               repurse_price += parseInt(shopcartObj[val].goods_price) * shopcartObj[val].num;
            }
          }else{
            repurse_price = parseInt(priceAll)
          }
          shopcartAll.push(shopcartObj[val]);
          shopcartNum += shopcartObj[val].num;
        }
      }
      // 购物车筛选后剩余数量
      shopcartNum = Object.entries(shopcartObj).reduce((pre, cur) => {
        const { num } = cur[1]
        return pre + num
      }, 0)
      this.changeshopcart(shopcartObj, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price);
      my.setStorageSync({
        key: 'goodsList',
        data: shopcartObj
      })
      app.globalData.goodsBuy = this.props.shopcartAll;
      // console.log(app.globalData.goodsBuy)
      if (num - shopcartNum > 0 && snum > 0) {
        return this.setData({
          showShopcar: false,
          mask1: false,
          mask: true,
          modalShow: true,
          isType: 'checkshopcart',
          content: `有${num - shopcartNum}个商品已失效，${snum}个商品价格已更新，是否继续下单`,
          confirmButtonText: '重新选择',
          cancelButtonText: '继续结算',
          btnClick: true
        })
      } else if (num - shopcartNum > 0 && snum == 0) {
        return this.setData({
          showShopcar: false,
          mask1: false,
          mask: true,
          modalShow: true,
          isType: 'checkshopcart',
          content: `有${num - shopcartNum}个商品已失效，是否继续下单`,
          confirmButtonText: '重新选择',
          cancelButtonText: '继续结算',
          btnClick: true
        })
      } else if (num - shopcartNum == 0 && snum > 0 && (isfresh1 || isfresh2 || isfresh3)) {
        return this.setData({
          showShopcar: false,
          mask1: false,
          mask: true,
          modalShow: true,
          isType: 'checkshopcart',
          content: `有${snum}个商品价格已更新，是否继续下单`,
          confirmButtonText: '重新选择',
          cancelButtonText: '继续结算',
          btnClick: true
        })
      }
      my.hideLoading();
      my.navigateTo({
        url: '/pages/home/orderform/orderform'
      })
    },
    // 获取起送价格
    getSendPrice() {
      const timestamp = new Date().getTime();
      let opencity = (my.getStorageSync({ key: 'opencity' }).data || null);
      if (!app.globalData.position.cityAdcode || app.globalData.position.cityAdcode == '') { return; }
      if (opencity) {
        this.setData({
          send_price: opencity[app.globalData.position.cityAdcode].shop_send_price,
          dispatch_price: opencity[app.globalData.position.cityAdcode].shop_dispatch_price
        });
        //存储一个起送起购价格
        my.setStorageSync({
          key: 'send_price',
          data: opencity[app.globalData.position.cityAdcode].shop_send_price
        });
        //存储一个起送起购价格
        my.setStorageSync({
          key: 'dispatch_price',
          data: opencity[app.globalData.position.cityAdcode].shop_dispatch_price
        });
      } else {
        console.log('opencity');
        my.request({
          url: `${jsonUrl}/api/shop/open-city.json?v=${timestamp}`,
          success: (res) => {
            //app.globalData.position.cityAdcode这个参数在手动修改地址的时候缺失。
            //这里采用通过门店的具体地址来确定起送价地址
            if(res.data.data[app.globalData.position.cityAdcode] && res.data.data[app.globalData.position.cityAdcode].shop_send_price){
                this.setData({
                  send_price: res.data.data[app.globalData.position.cityAdcode].shop_send_price,
                  dispatch_price: res.data.data[app.globalData.position.cityAdcode].shop_dispatch_price
                })
                //存储一个起送起购价格
                my.setStorageSync({
                  key: 'send_price',
                  data: res.data.data[app.globalData.position.cityAdcode].shop_send_price
                });
                //存储一个起送起购价格
                my.setStorageSync({
                  key: 'dispatch_price',
                  data: res.data.data[app.globalData.position.cityAdcode].shop_dispatch_price
                });
            }
            //
            my.setStorageSync({
              key: 'opencity',
              data: res.data.data
            });
          },
          fail:(e=>{
            //出现获取错误
          })
        });
      }
    },
    // 上传模版消息
    onSubmit(e) {
      upformId(e.detail.formId);
    },
    touchstart() {
      return false
    }
  }
});
