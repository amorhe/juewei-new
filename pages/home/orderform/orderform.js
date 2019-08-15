import { imageUrl, imageUrl2 } from '../../common/js/baseUrl'
import { couponsList, confirmOrder, createOrder, useraddressInfo, add_lng_lat, AliMiniPay } from '../../common/js/home'
import { upformId } from '../../common/js/time'
var app = getApp();
Page({
  data: {
    imageUrl,
    imageUrl2,
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
    longitude: null,
    latitude: null,
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
  },
  onLoad(e) {
    let goodsList = app.globalData.goodsBuy;
    for (let item of goodsList) {
      item['goods_quantity'] = item['num'];
      if (item.goods_discount) {
        item.goods_code = item.goods_activity_code
      }
    }
    const shop_id = my.getStorageSync({ key: 'shop_id' }).data;
    const self = app.globalData.shopTakeOut;
    const phone = my.getStorageSync({
      key: 'phone', // 缓存数据的key
    }).data;
    const longitude = my.getStorageSync({ key: 'lng' }).data;
    const latitude = my.getStorageSync({ key: 'lat', }).data;
    let arr = [
      {
        longitude: self.location[0],
        latitude: self.location[1],
        iconPath: `${imageUrl}position_map1.png`,
        width: 20,
        height: 20,
        rotate: 270
      },
      {
        longitude: self.location[0],
        latitude: self.location[1],
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
      shopObj: self,
      longitude,
      latitude,
      markersArray: arr,
      goodsList,
      orderType: app.globalData.type,
      phone
    })
    // 加购商品列表
    const gifts = app.globalData.gifts;
    // console.log(gifts)
    if (Object.keys(gifts).length > 0) {
      for (let key in gifts) {
        gifts[key].forEach(val => {
          val.goods_count = 0;
          val.goods_choose = true
        })
        this.setData({
          full_money: key,
          repurseList: gifts[key]
        })
      }
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

    let gift = [];
    if (this.data.gifts[this.data.gift_id]) {
      gift.push(this.data.gifts[this.data.gift_id]);
      this.setData({
        gift
      })
    }
    this.confirmOrder(my.getStorageSync({ key: 'shop_id' }).data, JSON.stringify(this.data.goodsList));
  },
  // 换购显示
  addRepurseTap(e) {
    console.log(e)
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
    let newShopcart = {},newGoodsArr=[],newGoodsArr1 = [],newGoodsArr2=[];
    if (this.data.newArr.length > 0) {
      for (let _item of this.data.newArr) {
        for (let item of this.data.goodsList) {
          // 商品价格变更
          if (_item.type == 1) {
            if (`${_item.goodsCode}${_item.goodsFormat}` == `${item.goods_code}${item.goods_format}`) {
              item.goods_price = _item.goodsPrice;
            }
            newShopcart[`${item.goods_code}_${item.goods_format}`] = item;
            newGoodsArr1.push(item);
            newGoodsArr1 = [...newGoodsArr1];
          } else {
            // 商品下架
            if (`${_item.goodsCode}${_item.goodsFormat}` != `${item.goods_code}${item.goods_format}`) {
              newShopcart[`${item.goods_code}_${item.goods_format}`] = item;
              newGoodsArr2.push(item);
              newGoodsArr2 = [...newGoodsArr2];
            }
          }
        }
      }
    } else {
      newShopcart = goodlist;
    }
    let goods = [...newGoodsArr1,...newGoodsArr2];
    for(let ott of goods){
      for(let item of this.data.goodsList){
        if(ott.goods_code = item.goods_code){
          newGoodsArr.push(ott);
          newGoodsArr = [...newGoodsArr];
        }
      }
    }
    console.log(goods,  newGoodsArr)
    my.setStorageSync({
      key: 'goodsList', // 缓存数据的key
      data: newShopcart, // 要缓存的数据
    });
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
      my.showToast({
        content: '请同意到店自提协议'
      });
      return
    }
    const lng = my.getStorageSync({ key: 'lng' }).data;
    const lat = my.getStorageSync({ key: 'lat' }).data;
    const shop_id = my.getStorageSync({ key: 'shop_id' }).data;
    const goods = JSON.stringify(this.data.goodsReal);
    let type = '', typeClass = ''
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
    setTimeout(() => {
      this.setData({
        isClick: true
      })
    }, 1000);

    let notUse = 0;
    if (app.globalData.notUse) {
      notUse = app.globalData.notUse;
    }
    let remark = '';
    if (app.globalData.remarks) {
      remark = app.globalData.remarks
    }
    // 创建订单
    createOrder(app.globalData.type, shop_id, goods, shop_id, 11, remark, '阿里小程序', address_id, lng, lat, type, this.data.gift, this.data.orderInfo.use_coupons[0], notUse).then((res) => {
      // console.log(res);
      if (res.code == 0) {
        if (app.globalData.type == 2 && this.data.orderInfo.real_price == 0) {
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
          content: res.msg
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
      // console.log(res)
      this.setData({
        address: true,
        addressInfo: res.data
      })
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
    confirmOrder(this.data.orderType, shop_id, goods, shop_id, this.data.coupon_code, this.data.couponslist, notUse, app.globalData.freeId).then((res) => {
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
            val['goods_img'] = imageUrl2 + app.globalData.goodsArr[app.globalData.goodsArr.findIndex(item => item.sap_code == val.sap_code)].goods_img[0]
          } else {
            val['goods_img'] = app.globalData.goodsArr[app.globalData.goodsArr.findIndex(item => item.sap_code == val.sap_code)].goods_img[0];
          }
        }
        // 参与加价购的商品
        let repurseTotalPrice = 0;
        if (app.globalData.repurseGoods) {
          if (app.globalData.repurseGoods.length == 0) {
            if (res.data.activity_list[''].real_price >= this.data.full_money) {
              this.setData({
                showRepurse: true
              })
            }
          } else {
            for (let item of app.globalData.repurseGoods) {
              for (let value of goodsReal) {
                if (item.goods_code == value.sap_code && value.goods_type != "DIS") {
                  repurseTotalPrice += value.goods_price * value.goods_quantity;
                  if (repurseTotalPrice >= this.data.full_money) {
                    this.setData({
                      showRepurse: true
                    })
                  }
                }
              }
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
          coupon_money
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
