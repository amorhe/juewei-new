import { imageUrl, imageUrl2, imageUrl3, img_url } from '../../common/js/baseUrl'
import { couponsList, confirmOrder, createOrder, useraddressInfo, add_lng_lat, AliMiniPay, useraddress } from '../../common/js/home'
import { upformId } from '../../common/js/time'
import { gd_decrypt } from '../../common/js/map'
var app = getApp();
Page({
  data: {
    imageUrl,
    imageUrl2,
    imageUrl3,
    img_url,
    isCheck: true,  //协议
    // 换购商品列表
    repurseList: [],
    countN: 0,
    mask: false,
    modalShow: false,
    address: false,
    type: 0,
    content: "",
    orderType: 1,  //1为外卖，2为自提
    longitude: '',
    latitude: '',
    markersArray: [],
    shopObj: {},   // 自提商店的详细信息
    couponslist: [],   //优惠券列表
    couponsDefault: null,
    full_money: 0,
    goodsInfo: '',
    addressInfo: {},
    dispatch_price: 0,    // 配送费
    remark: '口味偏好等要求',    // 备注
    goodsReal: [],          // 非赠品
    goodsInvented: [],      // 赠品
    gifts: {},         // 选择的换购商品
    gifts_price: '',   // 换购商品价格
    gift_id: '',     // 换购商品id
    order_price: '',    //订单总价
    showRepurse: false,  // 是否显示换购商品
    coupon_money: 0,     // 优惠金额
    goodsList: [],
    notUse: false,
    isClick: true,
    phone: '',   // 手机号
    newArr: [],    // 变更商品列表
    addressList: [],
  },
  onLoad(e) {
    // 外卖默认地址
    if (app.globalData.type == 1) {
      this.getDefault();
    }
    let goodsList = my.getStorageSync({
      key: 'goodsList', // 缓存数据的key
    }).data;
    let obj1 = {}, obj2 = {}, obj3 = {}, obj4 = {}, obj5 = {}, obj6 = {}, goodlist = [];
    for (let key in goodsList) {
      if (goodsList[key].goods_discount) {
        if (key.indexOf('PKG') == -1) {
          if (goodsList[key].num > goodsList[key].goods_order_limit) {
            // 非折扣部分
            obj1['goods_price'] = goodsList[key].goods_original_price;
            obj1['goods_quantity'] = goodsList[key].num - goodsList[key].goods_order_limit;
            obj1['goods_code'] = goodsList[key].goods_activity_code;
            obj1['goods_format'] = goodsList[key].goods_format;
            //  折扣部分
            obj2['goods_price'] = goodsList[key].goods_price;
            obj2['goods_quantity'] = goodsList[key].goods_order_limit;
            obj2['goods_code'] = goodsList[key].goods_code;
            obj2['goods_format'] = goodsList[key].goods_format;
            goodlist.push(obj1, obj2);
          } else {
            obj4['goods_price'] = goodsList[key].goods_price;
            obj4['goods_quantity'] = goodsList[key].num;
            obj4['goods_code'] = goodsList[key].goods_code;
            obj4['goods_format'] = goodsList[key].goods_format;
            goodlist.push(obj4);
          }
        } else {
          // 套餐
          if (goodsList[key].num > goodsList[key].goods_order_limit) {
            // 非折扣部分
            obj5['goods_price'] = goodsList[key].goods_original_price;
            obj5['goods_quantity'] = goodsList[key].num - goodsList[key].goods_order_limit;
            obj5['goods_code'] = goodsList[key].goods_activity_code;
            obj5['goods_format'] = goodsList[key].goods_format;
            // 折扣部分
            obj3['goods_price'] = goodsList[key].goods_price;
            obj3['goods_quantity'] = goodsList[key].goods_order_limit;
            obj3['goods_code'] = goodsList[key].goods_code;
            obj3['goods_format'] = goodsList[key].goods_format;
            goodlist.push(obj3, obj5)
          } else {
            obj6['goods_price'] = goodsList[key].goods_price;
            obj6['goods_quantity'] = goodsList[key].num;
            obj6['goods_code'] = goodsList[key].goods_code;
            obj6['goods_format'] = goodsList[key].goods_format;
            goodlist.push(obj6);
          }
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
      const shop_id = my.getStorageSync({ key: 'shop_id' }).data;
      const phone = my.getStorageSync({
        key: 'phone', // 缓存数据的key
      }).data;
      let ott = gd_decrypt(my.getStorageSync({ key: 'lng' }).data, my.getStorageSync({ key: 'lat', }).data);
      let location_s = gd_decrypt(self.location[0], self.location[1]);
      let arr = [
        {
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
            color: "#333",
            fontSize: 11,
            borderRadius: 30,
            bgColor: "#ffffff",
            padding: 8,
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
  onShow() {
    // 备注
    if (app.globalData.remarks) {
      this.setData({
        remark: app.globalData.remarks
      })
    }
    if (app.globalData.coupon_code) {
      this.setData({
        coupon_code: app.globalData.coupon_code,
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
      this.getAddress(app.globalData.address_id)
    }

    let gifts = [];
    if (this.data.gifts[this.data.gift_id]) {
      gifts.push(this.data.gifts[this.data.gift_id]);
      this.setData({
        gifts
      })
    }

    this.confirmOrder(my.getStorageSync({ key: 'shop_id' }).data, JSON.stringify(this.data.goodsList));
  },
  // 换购显示
  addRepurseTap(e) {
    // console.log(e)
    let gifts = {}, gifts_price = '', order_price = '';
    gifts[e.currentTarget.dataset.id] = {
      "activity_id": e.currentTarget.dataset.activity_id,
      "gift_id": e.currentTarget.dataset.gift_id,
      "id": e.currentTarget.dataset.id,
      "num": 1,
      "cash": e.currentTarget.dataset.cash,
      "point": e.currentTarget.dataset.point,
      "gift_price": e.currentTarget.dataset.gift_price
    }
    if (e.currentTarget.dataset.cash == 0 && e.currentTarget.dataset.point == 0) {
      gifts_price = `¥0`;
      order_price = `¥${this.data.orderInfo.real_price / 100}`;
    }
    if (e.currentTarget.dataset.cash == 0 && e.currentTarget.dataset.point != 0) {
      gifts_price = `${e.currentTarget.dataset.point}积分`;
      order_price = `¥${this.data.orderInfo.real_price / 100}+${e.currentTarget.dataset.point}积分`
    }
    if (e.currentTarget.dataset.cash != 0 && e.currentTarget.dataset.point == 0) {
      gifts_price = ` ¥${e.currentTarget.dataset.cash / 100}`;
      order_price = `¥${e.currentTarget.dataset.cash / 100 + this.data.orderInfo.real_price / 100}`
    }
    if (e.currentTarget.dataset.cash != 0 && e.currentTarget.dataset.point != 0) {
      gifts_price = `¥${e.currentTarget.dataset.cash / 100}+${e.currentTarget.dataset.point}积分`;
      order_price = `¥${e.currentTarget.dataset.cash / 100 + this.data.orderInfo.real_price / 100}+${e.currentTarget.dataset.point}积分`
    }
    this.setData({
      gifts,
      gift_id: e.currentTarget.dataset.id,
      gifts_price,
      order_price
    })
  },
  // 减
  reduceBtnTap(e) {
    this.setData({
      gifts: {},
      gift_id: '',
      order_price: `¥${this.data.orderInfo.real_price / 100}`
    })
  },
  // 弹框事件回调
  onCounterPlusOne(data) {
    let goodlist = my.getStorageSync({
      key: 'goodsList'
    }).data;
    let newShopcart = {},
      newGoodsArr = [],
      obj1 = {},
      obj2 = {};
    if (this.data.newArr.length > 0) {
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
        }
      }
    } else {
      my.removeStorageSync({
        key: 'goodsList'
      })
      my.navigateBack({
        delta: 1
      });
    }
    for (let ott in newShopcart) {
      newGoodsArr.push(newShopcart[ott])
    }
    my.setStorageSync({
      key: 'goodsList', // 缓存数据的key
      data: newShopcart, // 要缓存的数据
    });
    this.setData({
      goodsList: newGoodsArr
    })
    // 重新选择商品
    if (data.isType == 'orderConfirm' && data.type == 1) {
      my.navigateBack({
        delta: 1
      });
    }
    // 继续结算
    if (data.isType == 'orderConfirm' && data.type == 0) {
      this.confirmOrder(my.getStorageSync({ key: 'shop_id' }).data, JSON.stringify(newGoodsArr));
    }
    this.setData({
      mask: false,
      modalShow: false
    })
  },
  // 确认支付
  confirmPay() {

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
    const goods = JSON.stringify(this.data.goodsReal);
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
    if (Object.keys(this.data.gifts).length > 0) {
      giftObj['activity_id'] = this.data.gifts[this.data.gift_id].activity_id;
      giftObj['gift_id'] = this.data.gifts[this.data.gift_id].gift_id;
      giftObj['id'] = this.data.gifts[this.data.gift_id].id;
      gift_arr.push(giftObj);
      str_gift = JSON.stringify(gift_arr);
    }
    // 创建订单
    createOrder(app.globalData.type, shop_id, goods, shop_id, 11, remark, '阿里小程序', address_id, lng, lat, type, str_gift, this.data.orderInfo.use_coupons[0], notUse, app.globalData.freeId).then((res) => {
      // console.log(res);
      if (res.code == 0) {
        if (app.globalData.type == 2 && this.data.orderInfo.real_price == 0) {
          this.setData({
            isClick: true,
            coupon_code: ''
          })
          app.globalData.coupon_code = '';
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
  // 同意协议
  checkedTrueTap() {
    this.setData({
      isCheck: !this.data.isCheck
    })
  },
  // 选择地址
  getAddress(address_id) {
    useraddressInfo(address_id).then((res) => {
      this.setData({
        address: true,
        addressInfo: res.data
      })
    })
  },
  // 获取默认地址
  getDefault() {
    useraddress(my.getStorageSync({ key: 'shop_id' }).data).then((res) => {
      let addressList = [];
      for (let value of res.data) {
        if (value.is_dis == 1) {
          addressList.push(value)
        }
      }
      if (addressList[0].user_address_id) {
        app.globalData.address_id = addressList[0].user_address_id;
        this.setData({
          address: true,
          addressInfo: addressList[0],
          addressList
        })
      }

    })
  },
  // 选择优惠券
  chooseCoupon(e) {
    my.navigateTo({
      url: '/pages/home/orderform/chooseCoupon/chooseCoupon?coupon=' + e.currentTarget.dataset.coupon + '&money=' + e.currentTarget.dataset.money
    });
  },
  // 订单确认
  confirmOrder(shop_id, goods) {
    let notUse = 0;
    if (app.globalData.notUse) {
      notUse = app.globalData.notUse
    }
    confirmOrder(this.data.orderType, shop_id, goods, shop_id, this.data.coupon_code, this.data.repurseList, notUse, app.globalData.freeId).then((res) => {
      // console.log(res)
      let goodsList = my.getStorageSync({ key: 'goodsList' }).data;
      if (res.code == 0) {
        let goodsReal = [], goodsInvented = [];
        for (let item of res.data.activity_list[''].goods_list) {
          if (item.is_gifts == 1) {
            // 赠品
            goodsInvented.push(item)
          } else {
            // 非赠品
            goodsReal.push(item)
          }
        }
        for (let val of goodsReal) {
          if (val.goods_type == 'PKG') {
            val['goods_img'] = img_url + app.globalData.goodsArr[app.globalData.goodsArr.findIndex(item => item.goods_code == val.goods_code)].goods_img[0];
          } else {
            val['goods_img'] = app.globalData.goodsArr[app.globalData.goodsArr.findIndex(item => item.sap_code == val.sap_code)].goods_img[0];
          }
        }
        // 参与加价购的商品
        // 加购商品列表
        const gifts = app.globalData.gifts;
        let repurseTotalPrice = 0, arr_money = [];
        // console.log(gifts)
        if (app.globalData.repurseGoods) {
          if (Object.keys(gifts).length > 0) {
            for (let key in gifts) {
              gifts[key].forEach(val => {
                val.goods_count = 0;
                val.goods_choose = true
              })
              arr_money.push(key);
            }
          }
          // 换购商品不指定
          if (app.globalData.repurseGoods.length == 0) {
            arr_money.push(res.data.activity_list[''].real_price);
            arr_money.sort((a, b) => {
              return a - b;
            });
            let k = arr_money.findIndex(item => item == res.data.activity_list[''].real_price);
            if (res.data.activity_list[''].real_price >= arr_money[k - 1]) {
              this.setData({
                showRepurse: true,
                repurseList: gifts[arr_money[k - 1]]
              })
            }
            if (res.data.activity_list[''].real_price >= arr_money[k]) {
              this.setData({
                showRepurse: true,
                repurseList: gifts[arr_money[k]]
              })
            }
          } else {   // 换购商品为指定
            for (let item of app.globalData.repurseGoods) {
              for (let value of goodsReal) {
                if (item.goods_code == value.sap_code && value.goods_type != "DIS") {
                  repurseTotalPrice += value.goods_price * value.goods_quantity;
                }
              }
            }
            arr_money.push(repurseTotalPrice);
            arr_money.sort((a, b) => {
              return a - b;
            });
            let i = arr_money.findIndex(item => item == repurseTotalPrice);
            if (repurseTotalPrice >= arr_money[i - 1]) {
              this.setData({
                showRepurse: true,
                repurseList: gifts[arr_money[i - 1]]
              })
            }
          }
        }


        //  优惠券
        let coupon_money = 0;
        if (res.data.activity_list[''].reduce_detail.length == 1) {
          coupon_money = res.data.activity_list[''].reduce_detail[0].coupon.reduce
        } else if (res.data.activity_list[''].reduce_detail.length > 1) {
          coupon_money = res.data.activity_list[''].reduce_detail[res.data.activity_list[''].reduce_detail.findIndex(val => Math.max(val.coupon.reduce))].coupon.reduce;
        }

        this.setData({
          goodsReal,
          goodsInvented,
          orderInfo: res.data.activity_list[''],
          order_price: `¥${res.data.activity_list[''].real_price / 100}`,
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
      } else {
        this.setData({
          mask: true,
          modalShow: true,
          showShopcar: false,
          isType: 'orderConfirm',
          content: res.msg + '系统已经更新,是否确认结算',
          newArr: []
        })
      }
    })
  },
  // 模版消息
  onSubmit(e) {
    upformId(e.detail.formId);

  }
});
