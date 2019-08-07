import {imageUrl,imageUrl2} from '../../common/js/baseUrl'
import {couponsList,confirmOrder,createOrder,useraddressInfo,add_lng_lat,AliMiniPay} from '../../common/js/home'
var app = getApp();
Page({
  data: {
    imageUrl,
    imageUrl2,
    isCheck: false,  //协议
    // 换购商品列表
    repurseList:[],
    countN:0,
    mask:false,
    modalShow:false,
    address:false,
    type:0,
    content:"",
    orderType:1,  //1为外卖，2为自提
    longitude: 116.30051,
    latitude: 40.0511,
    markersArray:[],
    shopObj:{},   // 自提商店的详细信息
    couponsList:[],   //优惠券
    couponsDefault:null,
    full_money:0,
    goodsInfo:'',
    addressInfo:{},
    dispatch_price:0,    // 配送费
    remark:'口味偏好等要求',    // 备注
    goodsReal:[],          // 非赠品
    goodsInvented:[],      // 赠品
    gifts:{},         // 选择的换购商品
    gifts_price:'',   // 换购商品价格
    gift_id:'',     // 换购商品id
    order_price:'',    //订单总价
    showRepurse:false  // 是否显示换购商品
  },
  onLoad(e) {
    this.setData({
      orderType:app.globalData.type,
    })

    const shop_id = my.getStorageSync({key: 'shop_id'}).data;
    if(app.globalData.type == 2) {
      const self = my.getStorageSync({key: 'self'}).data;
      let arr = [
        {
          longitude: this.data.longitude,
          latitude: this.data.latitude,
          iconPath:`${imageUrl}position_map1.png`,
          width: 45,
          height: 45,
          rotate:270
        },
        {
          longitude:self[0].location[0],
          latitude: self[0].location[1],
          iconPath:`${imageUrl}position_map2.png`,
          width: 72,
          height: 72,
          label:{
            content:`距你${self[0].distance}米`,
            color:"#333",
            fontSize:11,
            borderRadius:30,
            bgColor:"#ffffff",
            padding:8,
          }
        }
      ]
      this.setData({
        shopObj:self[0],
        longitude:my.getStorageSync({key: 'lng'}).data,
        latitude: my.getStorageSync({key: 'lat', }).data,
        markersArray: arr
      })
    }else{
      const self = my.getStorageSync({key: 'takeout'}).data;
      this.setData({
        shopObj:self[0]
      })
    }
    let goodsList = app.globalData.goodsBuy;
    for(let item of goodsList){
      item['goods_quantity'] = item['num']
    }
    // console.log(goodsList)  
    this.confirmOrder(shop_id,JSON.stringify(goodsList));
  // 加购商品列表
    const gifts = app.globalData.gifts;
    console.log(gifts)
    if(Object.keys(gifts).length>0){
      for(let key in gifts){
        gifts[key].forEach(val => {
          val.goods_count = 0;
          val.goods_choose = true
        })
        this.setData({
          full_money:key,
          repurseList:gifts[key]
        })
     }
    }
  },
  onShow(){
    if(my.getStorageSync({key: 'address_id'}).data!=null) {
      this.getAddress(my.getStorageSync({key: 'address_id'}).data)
    }
    if(app.globalData.remarks) {
      this.setData({
        remark:app.globalData.remarks
      })
    }
  },
  // 换购显示
  addRepurseTap(e){
    let gifts = {},gifts_price='',order_price='';
    gifts[e.currentTarget.dataset.id] = {
      "activity_id": e.currentTarget.dataset.activity_id,
      "gift_id": e.currentTarget.dataset.gift_id,
      "id": e.currentTarget.dataset.id,
      "num": 1,
      "cash": e.currentTarget.dataset.cash,
      "point": e.currentTarget.dataset.point,
      "gift_price": e.currentTarget.dataset.gift_price
    }
    if(e.currentTarget.dataset.cash==0 && e.currentTarget.dataset.point==0){
      gifts_price = `¥0`;
      order_price = `¥${this.data.orderInfo.allow_order_coupon_price/100}`;
    }
    if(e.currentTarget.dataset.cash==0 && e.currentTarget.dataset.point!=0){
      gifts_price = `${e.currentTarget.dataset.point}积分`;
      order_price = `¥${this.data.orderInfo.allow_order_coupon_price/100}+${e.currentTarget.dataset.point}积分`
    }
    if(e.currentTarget.dataset.cash!=0 && e.currentTarget.dataset.point==0){
      gifts_price = ` ¥${e.currentTarget.dataset.cash/100}`;
      order_price = `¥${e.currentTarget.dataset.cash/100 + this.data.orderInfo.allow_order_coupon_price/100}`
    }
    if(e.currentTarget.dataset.cash!=0 && e.currentTarget.dataset.point!=0){
      gifts_price = `¥${e.currentTarget.dataset.cash/100}+${e.currentTarget.dataset.point}积分`;
      order_price = `¥${e.currentTarget.dataset.cash/100+ this.data.orderInfo.allow_order_coupon_price/100}+${e.currentTarget.dataset.point}积分`
    }
    this.setData({
      gifts,
      gift_id:e.currentTarget.dataset.id,
      gifts_price,
      order_price
    })
  },
  // 减
  reduceBtnTap(e){
    this.setData({
      gifts:{},
      gift_id:'',
      order_price:`¥${this.data.orderInfo.allow_order_coupon_price/100}`
    })
  },
  // 弹框事件回调
  onCounterPlusOne(data){
    // 重新选择商品
    if(data.isType == 'orderConfirm' && data.type == 1){
      my.navigateBack({
        delta:1
      });
    }
    this.setData({
      mask: false,
      modalShow: false
    })
  },
  // 确认支付
  confirmPay(){
    if(app.globalData.type == 2 && !this.data.isCheck){
      my.showToast({
        content:'请同意到店自提协议'
      });
      return
    }
    const lng = my.getStorageSync({key:'lng'}).data;
    const lat = my.getStorageSync({key:'lat'}).data;
    const shop_id = my.getStorageSync({key:'shop_id'}).data;
    const goods = JSON.stringify(this.data.goodsReal);
    let type = '',typeClass=''
    if(app.globalData.type == 1) {
      type = 1;
      typeClass = 2;
    }
    if(app.globalData.type == 2) {
      type = 3;
      typeClass = 4
    }
    
    let address_id = my.getStorageSync({key:'address_id'}).data;
    if(app.globalData.type==1){
      if(!address_id){
        my.showToast({
          content:'请选择收货地址'
        })
        return
      }
    }
    let gift = [],coupon_code='',notUse=0;
    if(this.data.gifts[this.data.gift_id]){
      gift.push(this.data.gifts[this.data.gift_id]);
    }
    if(!app.globalData.coupon_code){
      coupon_code = this.data.orderInfo.use_coupons[0]
    }else{
      coupon_code = app.globalData.coupon_code;
      notUse = 1
    }
    // 创建订单
    createOrder(app.globalData.type,shop_id,goods,shop_id,11,this.data.remark,'阿里小程序',address_id,lng,lat,type,JSON.stringify(gift),coupon_code,notUse).then((res) => {
      console.log(res);
      if(res.code == 0){
        AliMiniPay(res.data.order_no).then((val) => {
          if(val.code==0){
            // 支付宝调起支付
            my.tradePay({
              tradeNO: val.data.tradeNo, // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
              success: (value) => {
                // 支付成功
                if(value.resultCode == 9000){
                  add_lng_lat(res.data.order_no,typeClass,lng,lat).then((conf) => {
                    my.reLaunch({
                      url: '/pages/home/orderfinish/orderfinish?order_no=' + res.data.order_no, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
                    });
                  })
                }else if(value.resultCode == 4000){    // 支付失败
                  my.reLaunch({
                    url: '/pages/home/orderError/orderError', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
                  });
                }else {
                  my.redirectTo({
                    url: '/package_order/pages/orderdetail/orderdetail?order_no=' + res.data.order_no, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
                  })
                }
              }
            });
          }
        }) 
      }
    })

  },
  // 同意协议
  checkedTrueTap(){
    this.setData({
      isCheck: !this.data.isCheck
    })
  },
  // 选择地址
  getAddress(address_id){
    useraddressInfo(address_id).then((res) => {
      console.log(res)
      this.setData({
        address:true,
        addressInfo:res.data
      })
    })
  },
  // 选择优惠券
  chooseCoupon(){
    my.navigateTo({
      url: '/pages/home/orderform/chooseCoupon/chooseCoupon'
    });
  },
  // 订单确认
  confirmOrder(shop_id,goods){
    confirmOrder(this.data.orderType,shop_id,goods,shop_id,"",[],0).then((res) => {
      console.log(res)
      let goodsList = my.getStorageSync({key:'goodsList'}).data;
      if(res.code == 0){
        let goodsReal=[],goodsInvented=[];
        for(let item of res.data.activity_list[''].goods_list){
          if(item.is_gifts == 1) {
            // 赠品
            goodsInvented.push(item)
          }else{
            // 非赠品
            goodsReal.push(item)
          }
        }
        for(let val of goodsReal){
          val['good_img'] = goodsList[`${val.goods_code}_${val.goods_format}`].goods_img;
        }
        // 参与加价购的商品
        let repurseTotalPrice=0;
        let repurseGoods = app.globalData.repurseGoods;
        for(let item of repurseGoods){
          for(let value of goodsReal){
            if(item.goods_code == value.sap_code && value.goods_type!="DIS"){
              repurseTotalPrice += value.goods_price * value.goods_quantity;
              if(repurseTotalPrice >= this.data.full_money){
                this.setData({
                  showRepurse:true
                })
              }
            }
          }
        }


        this.setData({
          goodsReal,
          goodsInvented,
          orderInfo:res.data.activity_list[''],
          order_price:`¥${res.data.activity_list[''].allow_order_coupon_price/100}`
        })
      }else{
        this.setData({
          mask:true,
          modalShow:true,
          showShopcar:false,
          isType:'orderConfirm',
          content: res.msg + '系统已清更新,是否确认结算'
        })
      }
    })
  },
  
});
