import {
  imageUrl,
  imageUrl2,
  imageUrl3,
  img_url,
  myGet,
  mySet
} from '../../common/js/baseUrl'
import {
  couponsList,
  confirmOrder,
  createOrder,
  useraddressInfo,
  add_lng_lat,
  payment,
  useraddress,
  AliMiniPay
} from '../../common/js/home'
import {
  upformId
} from '../../common/js/time'
import {
  gd_decrypt
} from '../../common/js/map'
import {
  navigateTo,
  redirectTo,
  reLaunch,
  switchTab
} from '../../common/js/router'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl,
    imageUrl2,
    imageUrl3,
    img_url,
    isCheck: true, //协议
    // 换购商品列表
    repurseList: [],
    countN: 0,
    mask: false,
    modalShow: false,
    address: false,
    type: 0,
    content: "",
    orderType: 1, //1为外卖，2为自提
    longitude: '',
    latitude: '',
    markersArray: [],
    shopObj: {}, // 自提商店的详细信息
    couponslist: [], //优惠券列表
    couponsDefault: null,
    coupon_code: '', // 优惠券码
    full_money: 0,
    goodsInfo: '',
    addressInfo: {},
    dispatch_price: 0, // 配送费
    remark: '口味偏好等要求', // 备注
    goodsReal: [], // 非赠品
    goodsInvented: [], // 赠品
    gifts: [], // 选择的换购商品
    gifts_price: '', // 换购商品价格
    gift_id: '', // 换购商品id
    order_price: '', //订单总价
    showRepurse: false, // 是否显示换购商品
    coupon_money: 0, // 优惠金额
    goodsList: [],
    notUse: false,
    isClick: true,
    phone: '', // 手机号
    newArr: [], // 变更商品列表
    addressList: [],
    trueprice: 0, //真实的总价价格
    send_price: 0,
    price_no_count: false,
    goodsOrder: {},
    is_allow_coupon:false//是否可以优惠

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 外卖默认地址
    if (app.globalData.type == 1) {
      this.funGetDefault();
    }
    let goodsList = myGet('goodsList');
    let obj1 = {},
      obj2 = {},
      obj3 = {},
      obj4 = {},
      obj5 = {},
      obj6 = {},
      goodlist = [];
    for (let key in goodsList) {
      if (goodsList[key].goods_discount) {
        if (goodsList[key].num > goodsList[key].goods_order_limit) {
          goodlist.push({
            goods_price: goodsList[key].goods_price,
            goods_quantity: goodsList[key].goods_order_limit,
            goods_code: goodsList[key].goods_code,
            goods_format: goodsList[key].goods_format,
            goods_order_limit: goodsList[key].goods_order_limit
          }, {
            goods_price: goodsList[key].goods_original_price,
            goods_quantity: goodsList[key].num - goodsList[key].goods_order_limit,
            goods_code: goodsList[key].goods_activity_code,
            goods_format: goodsList[key].goods_format,
          });
        } else {
          goodlist.push({
            goods_price: goodsList[key].goods_price,
            goods_quantity: goodsList[key].num,
            goods_code: goodsList[key].goods_code,
            goods_format: goodsList[key].goods_format,
            goods_order_limit: goodsList[key].goods_order_limit
          });
        }
      } else {
        //  普通商品
        goodsList[key]['goods_quantity'] = goodsList[key].num
        goodlist.push(goodsList[key])
      }
    }
    const self = app.globalData.shopTakeOut;
    this.setData({
      goodsList: goodlist,
      shopObj: self
    })
    if (app.globalData.type == 2) {
      const shop_id = myGet('shop_id');
      const phone = myGet('userInfo').phone;
      let ott = gd_decrypt(myGet('lng'), myGet('lat'));
      let location_s = gd_decrypt(self.location[0], self.location[1]);
      let arr = [{
        longitude: ott.lng,
        latitude: ott.lat,
        iconPath: `${imageUrl}position_map1.png`,
        width: 20,
        height: 20,
        rotate: 0
      },
      {
        longitude: location_s.lng,
        latitude: location_s.lat,
        iconPath: `${imageUrl}position_map2.png`,
        width: 36,
        height: 36,
        label: {
          content: `距你${self.distance}米`,
          color: "#333333",
          fontSize: 11,
          borderRadius: 30,
          bgColor: "#ffffff",
          padding: 5,
          anchorX: -36,
          anchorY: -60
        }
      }
      ]
      this.setData({
        longitude: location_s.lng,
        latitude: location_s.lat,
        markersArray: arr,
        orderType: app.globalData.type,
        phone
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 备注
    if (app.globalData.remarks) {
      this.setData({
        remark: app.globalData.remarks
      })
    }
    if (app.globalData.coupon_code && app.globalData.coupon_code != '') {
      this.setData({
        coupon_code: app.globalData.coupon_code,
      })
    } else {
      this.setData({
        coupon_code: '',
      })
    }
    if (app.globalData.notUse == 1) {
      this.setData({
        notUse: true
      })
    } else {
      this.setData({
        notUse: false
      })
    }
    if (app.globalData.address_id) {
      this.funGetAddress(app.globalData.address_id, myGet('_sid'))
    } else {
      this.setData({
        address: false,
        addressList: []
      })
    }
    this.funConfirmOrder(myGet('shop_id'), JSON.stringify(this.data.goodsList));
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 换购显示
  eveAddRepurseTap(e) {
    let gifts = [],
      gifts_price = '',
      order_price = '',
      trueprice = 0;

    gifts.push({
      "activity_id": e.currentTarget.dataset.activity_id,
      "gift_id": e.currentTarget.dataset.gift_id,
      "id": e.currentTarget.dataset.id,
      "num": 1,
      "cash": e.currentTarget.dataset.cash,
      "point": e.currentTarget.dataset.point,
      "gift_price": e.currentTarget.dataset.gift_price
    });
    if (e.currentTarget.dataset.cash == 0 && e.currentTarget.dataset.point == 0) {
      gifts_price = `¥0`;
      order_price = `¥${this.data.orderInfo.real_price / 100}`;
      trueprice = this.data.orderInfo.sum_price / 100 - this.data.orderInfo.dispatch_price / 100;
    }
    if (e.currentTarget.dataset.cash == 0 && e.currentTarget.dataset.point != 0) {
      gifts_price = `${e.currentTarget.dataset.point}积分`;
      order_price = `¥${this.data.orderInfo.real_price / 100}+${e.currentTarget.dataset.point}积分`
      trueprice = this.data.orderInfo.sum_price / 100 - this.data.orderInfo.dispatch_price / 100;
    }
    if (e.currentTarget.dataset.cash != 0 && e.currentTarget.dataset.point == 0) {
      gifts_price = ` ¥${e.currentTarget.dataset.cash / 100}`;
      order_price = `¥${e.currentTarget.dataset.cash / 100 + this.data.orderInfo.real_price / 100}`;
      trueprice = e.currentTarget.dataset.cash / 100 + this.data.orderInfo.sum_price / 100 - this.data.orderInfo.dispatch_price / 100;
    }
    if (e.currentTarget.dataset.cash != 0 && e.currentTarget.dataset.point != 0) {
      gifts_price = `¥${e.currentTarget.dataset.cash / 100}+${e.currentTarget.dataset.point}积分`;
      order_price = `¥${e.currentTarget.dataset.cash / 100 + this.data.orderInfo.real_price / 100}+${e.currentTarget.dataset.point}积分`
      trueprice = e.currentTarget.dataset.cash / 100 + this.data.orderInfo.sum_price / 100 - this.data.orderInfo.dispatch_price / 100;
    }
    this.setData({
      gifts,
      gift_id: e.currentTarget.dataset.id,
      gifts_price,
      order_price,
      trueprice
    })
  },
  // 减
  eveReduceBtnTap(e) {
    this.setData({
      gifts: [],
      gift_id: '',
      order_price: `¥${this.data.orderInfo.real_price / 100}`,
      trueprice: this.data.orderInfo.sum_price / 100 - this.data.orderInfo.dispatch_price / 100
    })
  },
  // 弹框事件回调
  onCounterPlusOne(data) {
    let goodlist = myGet('goodsList');
    let newShopcart = {},
      newGoodsArr = [],
      obj1 = {},
      obj2 = {};
    if (this.data.newArr.length > 0 && !this.data.newArr[0].user_id) {
      for (let _item of this.data.newArr) {
        for (let item of this.data.goodsList) {
          // 商品价格变更
          if (_item.type == 1) {
            if (`${_item.goodsCode}${_item.goodsFormat}` == `${item.goods_code}${item.goods_format}`) {
              item.goods_price = _item.goodsPrice;
            }
            obj1[`${item.goods_code}_${item.goods_format}`] = item;  //多
          } else {
            // 商品下架
            if (`${_item.goodsCode}${_item.goodsFormat}` != `${item.goods_code}${item.goods_format}`) {
              obj2[`${item.goods_code}_${item.goods_format}`] = item;  //少
            }
          }
        }
      }
    }
    if (Object.keys(obj2).length > 0 && Object.keys(obj1).length == 0) {
      newShopcart = obj2;
    } else if (Object.keys(obj1).length > 0 && Object.keys(obj2).length == 0) {
      newShopcart = obj1;
    } else if (Object.keys(obj1).length > 0 && Object.keys(obj2).length > 0) {
      for (let key in obj1) {
        if (obj2[key]) {
          newShopcart[key] = obj1[key];
        } else {
          my.removeStorage({
            key: 'goodsList'
          })
          switchTab({
            url: '/pages/home/goodslist/goodslist'
          })
          return;
        }

        for (let ott in newShopcart) {
          newGoodsArr.push(newShopcart[ott])
        }
        mySet('goodsList', goodlist);
        this.setData({
          goodsList: newGoodsArr
        })
        // 重新选择商品
        if (data.isType == 'orderConfirm' && data.type == 1) {
          switchTab({
            url: '/pages/home/goodslist/goodslist'
          })
          return;
        }
        // 继续结算
        if (data.isType == 'orderConfirm' && data.type == 0) {
          this.funConfirmOrder(myGet('shop_id'), JSON.stringify(newGoodsArr));
        }
        this.setData({
          mask: false,
          modalShow: false
        })
      }
    }
  },
  // 同意协议
  checkedTrueTap() {
    this.setData({
      isCheck: !this.data.isCheck
    })
  },
  // 选择地址
  funGetAddress(address_id, _sid) {
    useraddressInfo(address_id, _sid).then((res) => {
      if (res.code == 0) {
        this.setData({
          address: true,
          addressInfo: res.data
        })
      } else {
        this.setData({
          address: false,
          addressInfo: {}
        })
      }
    })
  },
  // 获取默认地址
  funGetDefault() {
    useraddress(myGet('shop_id'), myGet('_sid')).then((res) => {
      let addressList = [];
      for (let value of res.data) {
        if (value.is_dis == 1) {
          addressList.push(value)
        }
      }
      if (addressList.length > 0 && addressList[0].user_address_id) {
        app.globalData.address_id = addressList[0].user_address_id;
        this.setData({
          address: true,
          addressInfo: addressList[0],
          addressList
        })
      } else {
        this.setData({
          address: false,
          addressList: []
        })
      }
    })
  },
  // 选择优惠券
  eveChooseCoupon(e) {
    navigateTo({
      url: '/pages/home/orderform/chooseCoupon/chooseCoupon?coupon=' + (e.currentTarget.dataset.coupon?e.currentTarget.dataset.coupon:'') + '&money=' + e.currentTarget.dataset.money+'&is_allow_coupon='+e.currentTarget.dataset.is_allow_coupon
    });
  },
  // 订单确认
  funConfirmOrder(shop_id, goods) {
    let notUse = 0;
    const gifts = app.globalData.gifts;
    let giftslist = [];
    if (app.globalData.notUse) {
      notUse = app.globalData.notUse
    }

    //提交确认订单
    // 这里面遇到了选中的换商品字符串无法传入到后台的情况
    let gift_list_confirm = [];
    confirmOrder(this.data.orderType, shop_id, goods, shop_id, this.data.coupon_code, JSON.stringify([]), notUse, (app.globalData.freetf ? app.globalData.freeId : ''), myGet('_sid'), 2).then((res) => {
      let goodsList = myGet('goodsList');
      if (res.code == 0) {
        let goodsReal = [],
          goodsInvented = [];
        for (let item of res.data.activity_list[''].goods_list) {
          if (item.is_gifts == 1 && (item.gift_type == 1 || item.gift_type == 2)) {
            // 赠品虚拟
            goodsInvented.push(item)
          } else {
            // 非赠品和赠品实物
            goodsReal.push(item)
          }
        }
        if (goodsReal.length > 0) {
          for (let val of goodsReal) {
            if (!val.is_gifts) {
              if (val.goods_type == 'PKG') {
                val['goods_img'] = img_url + app.globalData.goodsArr[app.globalData.goodsArr.findIndex(item => item.goods_code == val.goods_code)].goods_img[0];
              } else {
                val['goods_img'] = app.globalData.goodsArr[app.globalData.goodsArr.findIndex(item => item.sap_code == val.sap_code || item.goods_sap_code == val.sap_code)].goods_img[0].indexOf('http://imgcdnjwd.juewei.com/') == -1 ? 'http://imgcdnjwd.juewei.com/' + app.globalData.goodsArr[app.globalData.goodsArr.findIndex(item => item.sap_code == val.sap_code || item.goods_sap_code == val.sap_code)].goods_img[0] : app.globalData.goodsArr[app.globalData.goodsArr.findIndex(item => item.sap_code == val.sap_code || item.goods_sap_code == val.sap_code)].goods_img[0];
              }
            }
          }
        }
        // 参与加价购的商品
        // 加购商品列表
        let repurseTotalPrice = 0,
          arr_money = [];
        if (app.globalData.repurseGoods) {
          if (Object.keys(gifts).length > 0) {
            for (let key in gifts) {
              gifts[key].forEach(val => {
                val.goods_count = 0;
                val.goods_choose = true
              })
              arr_money.push(parseInt(key));
            }
          }
          // 换购商品不指定,全部换购
          if (app.globalData.repurseGoods.length == 0) {
            let sort_real_price = parseInt(res.data.activity_list[''].real_price);
            if (arr_money.indexOf(sort_real_price) == -1) { //没有重复的
              arr_money.push(sort_real_price);
            } else { //和价格相互重复了
              sort_real_price = sort_real_price + 1;
              arr_money.push(sort_real_price);
            }
            arr_money.sort((a, b) => {
              return a - b;
            });
            let k = arr_money.findIndex(item => item == sort_real_price); //这里永远会大于
            this.setData({
              showRepurse: true,
              repurseList: gifts[arr_money[k - 1]]
            })
          } else { // 换购商品为指定
            for (let item of app.globalData.repurseGoods) {
              for (let value of goodsReal) {
                if (item.goods_code == value.sap_code && value.goods_type != "DIS") {
                  repurseTotalPrice += value.goods_price * value.goods_quantity;
                }
              }
            }
            let all_repurseTotalPrice = repurseTotalPrice;
            if (arr_money.indexOf(all_repurseTotalPrice) == -1) { //没有重复的
              arr_money.push(all_repurseTotalPrice);
            } else { //和价格相互重复了
              all_repurseTotalPrice = all_repurseTotalPrice + 1;
              arr_money.push(all_repurseTotalPrice);
            }
            arr_money.sort((a, b) => {
              return a - b;
            });
            let i = arr_money.findIndex(item => item == all_repurseTotalPrice);
            this.setData({
              showRepurse: true,
              repurseList: gifts[arr_money[i - 1]]
            })
          }
        }
        //  优惠券
        let coupon_money = 0;
        if (res.data.activity_list[''].reduce_detail.length == 1) {
          coupon_money = res.data.activity_list[''].reduce_detail[0].coupon.reduce
        } else if (res.data.activity_list[''].reduce_detail.length > 1) {
          coupon_money = res.data.activity_list[''].reduce_detail[res.data.activity_list[''].reduce_detail.findIndex(val => Math.max(val.coupon.reduce))].coupon.reduce;
        }

        //由于orderconfirm不能承接换购商品，所以采用了前端判断换购商品策略
        let order_price_num = (res.data.activity_list[''].real_price / 100);
        let order_price_point = '';
        if (this.data.gifts && this.data.gifts.length > 0) {
          if (parseInt(this.data.gifts[0].cash) > 0) {
            order_price_num = order_price_num + (this.data.gifts[0].cash / 100);
          }
          if (parseInt(this.data.gifts[0].point) > 0) {
            order_price_point = '+' + this.data.gifts[0].point + '积分';
          }
        }
        this.setData({
          goodsReal,
          goodsInvented,
          orderInfo: res.data.activity_list[''],
          is_allow_coupon:res.data.is_allow_coupon,//是否优惠两单
          order_price: `¥${order_price_num}${order_price_point}`,
          trueprice: res.data.activity_list[''].sum_price / 100 - res.data.activity_list[''].dispatch_price / 100,
          coupon_money,
          orderDetail: res.data
        })
      } else if (res.code == 277) {
        this.setData({
          mask: true,
          modalShow: true,
          showShopcar: false,
          isType: 'orderConfirm',
          content: res.msg + '，系统已经更新,是否确认结算',
          newArr: res.data
        })
      } else if (res.code == 'A123') {
        my.showModal({
          content: res.msg,
          showCancel: false,
          confirmText: '重新选择',
          confirmColor: '#E60012',
          success(conf) {
            switchTab({
              url: '/pages/home/goodslist/goodslist'
            })
          }
        })


      } else if (res.code == 30106) {
        //用户未登录状态
        // 直接跳转

      } else {
        this.setData({
          mask: true,
          modalShow: true,
          showShopcar: false,
          isType: 'orderConfirm',
          content: res.msg,
          newArr: []
        })
      }
    })
  },
  // 确认支付
  eveConfirmPay() {

    if (app.globalData.type == 2 && !this.data.isCheck) {
      my.alert({
        content: '请同意到店自提协议',
        buttonText: '我知道了'
      });
      return
    }
    const lng = my.getStorageSync({ key: 'lng' }).data;
    const lat = my.getStorageSync({ key: 'lat' }).data;
    const shop_id = my.getStorageSync({ key: 'shop_id' }).data;
    const goods = JSON.stringify(this.data.goodsList);
    let type = '', typeClass = '', gift_arr = [], giftObj = {}, notUse = 0, remark = '', str_gift = '';
    if (app.globalData.type == 1) {
      type = 1;
      typeClass = 2;
    }
    if (app.globalData.type == 2) {
      type = 3;
      typeClass = 4
    }

    let address_id = app.globalData.address_id;
    if (app.globalData.type == 1) {
      if (!address_id) {
        my.showToast({
          content: '请选择收货地址'
        })
        return
      }
    }
    // js节流防短时间重复点击
    if (this.data.isClick == false) {
      return
    }
    this.setData({
      isClick: false
    })

    if (app.globalData.notUse) {
      notUse = app.globalData.notUse;
    }
    // 备注
    if (app.globalData.remarks) {
      remark = app.globalData.remarks
    }
    if (this.data.gifts.length > 0) {
      giftObj['activity_id'] = this.data.gifts[0].activity_id;
      giftObj['gift_id'] = this.data.gifts[0].gift_id;
      giftObj['id'] = this.data.gifts[0].id;
      gift_arr.push(giftObj);
      str_gift = JSON.stringify(gift_arr);
    }
    // 创建订单
    let use_coupons = ''
    if (this.data.orderInfo.use_coupons[0] != undefined) {
      use_coupons = this.data.orderInfo.use_coupons[0]
    }
    createOrder(app.globalData.type, shop_id, goods, shop_id, 11, remark, '阿里小程序', address_id, lng, lat, type, str_gift, use_coupons, notUse, app.globalData.freeId, this.data.activity_channel).then((res) => {
      // console.log(res);
      if (res.code == 0) {
        if (app.globalData.type == 2 && this.data.orderInfo.real_price == 0) {
          this.setData({
            isClick: true,
            coupon_code: ''
          })
          app.globalData.coupon_code = '';
          app.globalData.remarks = '';
          add_lng_lat(res.data.order_no, typeClass, lng, lat).then((conf) => {
            my.removeStorageSync({
              key: 'goodsList', // 缓存数据的key
            });
            my.reLaunch({
              url: '/pages/home/orderfinish/orderfinish?order_no=' + res.data.order_no, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
            });
          })
          return
        }
        AliMiniPay(res.data.order_no).then((val) => {
          if (val.code == 0) {
            // 支付宝调起支付
            this.setData({
              isClick: true,
              coupon_code: ''
            })
            app.globalData.coupon_code = '';
            app.globalData.remarks = '';
            my.tradePay({
              tradeNO: val.data.tradeNo, // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
              success: (value) => {
                // 支付成功
                if (value.resultCode == 9000) {
                  add_lng_lat(res.data.order_no, typeClass, lng, lat).then((conf) => {
                    my.removeStorageSync({
                      key: 'goodsList', // 缓存数据的key
                    });
                    my.reLaunch({
                      url: '/pages/home/orderfinish/orderfinish?order_no=' + res.data.order_no, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
                    });
                  })
                } else if (value.resultCode == 4000) {    // 支付失败
                  my.reLaunch({
                    url: '/pages/home/orderError/orderError', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
                  });
                } else {
                  // 待支付
                  my.removeStorageSync({
                    key: 'goodsList', // 缓存数据的key
                  });
                  my.redirectTo({
                    url: '/package_order/pages/orderdetail/orderdetail?order_no=' + res.data.order_no, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
                  })
                }
              }
            });
          }
        })
      } else {
        my.showToast({
          content: res.msg,
        })
        this.setData({
          isClick: true,
        })
      }
    })

  },
})