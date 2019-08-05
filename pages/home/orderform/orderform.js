import {imageUrl} from '../../common/js/baseUrl'
import {couponsList,confirmOrder,createOrder,useraddressInfo,add_lng_lat,AliMiniPay} from '../../common/js/home'
var app = getApp();
Page({
  data: {
    imageUrl,
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
    markersArray:[
      // {
      //   longitude: 116.30051,
      //   latitude: 40.0511,
      //   iconPath:`${imageUrl}position_map1.png`,
      //   width: 45,
      //   height: 45,
      //   rotate:270
      // },
      // {
      //   longitude:116.3005,
      //   latitude: 40.1,
      //   iconPath:`${imageUrl}position_map2.png`,
      //   width: 72,
      //   height: 72,
      //   label:{
      //     content:"距你2.5公里",
      //     color:"#333",
      //     fontSize:11,
      //     borderRadius:30,
      //     bgColor:"#ffffff",
      //     padding:8,
      //   }
      // }
    ],
    shopObj:{},   // 自提商店的详细信息
    couponsList:[],   //优惠券
    couponsDefault:null,
    full_money:0,
    shopcartGoods:[],   //商品列表
    priceAll:'',
    goodsInfo:'',
    addressInfo:{},
    dispatch_price:0,    // 配送费
    remark:'口味偏好等要求'    // 备注
  },
  onLoad(e) {
    this.setData({
      priceAll:app.globalData.priceAll,
      orderType:app.globalData.type,
      dispatch_price: app.globalData.dispatch_price
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
    this.getCouponsList();   //优惠券
    let goodsList = app.globalData.goodsBuy;
    for(let item of goodsList){
      item['goods_quantity'] = item['num']
    }
    let goods = [],goodsObj = {};
    app.globalData.goodsBuy.forEach(item => {
      goodsObj['goods_code'] = item.goods_code;
      goodsObj['goods_format'] = item.goods_format;
      goodsObj['goods_quantity'] = item.goods_quantity;
      goodsObj['goods_price'] = item.goods_price
      goods.push(goodsObj)
    })
    this.confirmOrder(shop_id,JSON.stringify(goods));
  // 加购商品
    console.log(app.globalData.gifts);
    const gifts = app.globalData.gifts;
    if(gifts.length>0){
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
    if(my.getStorageSync({key:'remark'}).data) {
      this.setData({
        remark:my.getStorageSync({key:'remark'}).data
      })
    }
  },
  // 换购显示
  addRepurseTap(){
    this.setData({
      countN:1
    })
  },
  // 减
  reduceBtnTap(e){
    this.data.repurseList[e.currentTarget.dataset.index].goods_count --;
    this.data.repurseList.forEach((item,index) => {
      if(index != e.currentTarget.dataset.index && this.data.repurseList[e.currentTarget.dataset.index].goods_count == 0){
        item.goods_choose = true
      }
    })
    this.setData({
      repurseList:this.data.repurseList
    })
  },
  // 加
  addBtnTap(e){
    this.data.repurseList[e.currentTarget.dataset.index].goods_count ++;
    this.data.repurseList.forEach((item,index) => {
      if(index != e.currentTarget.dataset.index){
        item.goods_choose = false
      }
    })
    this.setData({
      repurseList:this.data.repurseList
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
    const goodsList = app.globalData.goodsBuy;
    for(let item of goodsList){
      item['goods_quantity'] = item['num']
    }
    const goods = JSON.stringify(goodsList);
    // let shops ='';
    // for(let value of arr) {
    //   shops += value.shop_id + ','
    // }
    // shops = shops.substr(0,shops.length-1);
    let type = '',typeClass=''
    if(app.globalData.type == 1) {
      type = 1;
      typeClass = 2;
    }
    if(app.globalData.type == 2) {
      type = 3;
      typeClass = 4
    }
    const address_id = my.getStorageSync({key:'address_id'}).data;
    // 创建订单
    createOrder(app.globalData.type,shop_id,goods,shop_id,11,this.data.remark,'阿里小程序',address_id,lng,lat,type).then((res) => {
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
  // 查找用户可用优惠券
  getCouponsList(){
    const _sid = my.getStorageSync({key:'_sid'}).data;
    couponsList(_sid,'use').then((res) => {
      console.log(res)
      if(res.DATA.use){
        this.setData({
          couponsList:res.DATA.use,
          couponsDefault:res.DATA.max
        })
      }
      
    })
  },
  // 订单确认
  confirmOrder(shop_id,goods){
    confirmOrder(this.data.orderType,shop_id,goods,shop_id).then((res) => {
      console.log(res)    
      if(res.code == 0){
        let goodsList = my.getStorageSync({key:'goodsList'}).data;
        let goodsReal=[],goodsInvented=[],shopcartGoods=[]
        for(let item of res.data.activity_list[''].goods_list){
          if (item.is_gifts == 1&&item.goods_code=="") { 
                goodsInvented.push(item)//赠品
            } else if(item.is_gifts == 1&&item.goods_code!="") { 
                if(item.gift_type==3||item.gift_type==4){
                    goodsReal.push(item)
                }else{
                    goodsInvented.push(item)//赠品
                }
            }else { //非赠品
                goodsReal.push(item)
            } 
        }
        for(let val of goodsReal){
          val['good_img'] = goodsList[`${val.goods_code}_${val.goods_format}`].goods_img;
        }
        shopcartGoods = [...goodsReal,...goodsInvented];
        console.log(shopcartGoods)
        this.setData({
          shopcartGoods,
          orderInfo:res.data.activity_list['']
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
