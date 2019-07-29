import {imageUrl} from '../../common/js/baseUrl'
import {couponsList,confirmOrder} from '../../common/js/home'
var app = getApp();
Page({
  data: {
    imageUrl,
    isCheck: false,  //协议
    // 换购商品列表
    repurseList:[
      {
        img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3858629,3224043760&fm=26&gp=0.jpg',
        goods_name: '黑鸭鸡膝软骨',
        taste_name: '超辣',
        goods_quantity: 2,
        goods_price: 4,
        goods_old_price: 10,
        goods_count:0
      },
      // {
      //   img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3898176482,3211240837&fm=26&gp=0.jpg',
      //   goods_name: '如来鸭掌',
      //   taste_name: '甜辣',
      //   goods_quantity: 20,
      //   goods_price: 10,
      //   goods_old_price: 20
      // }
    ],
    countN:0,
    mask:false,
    modalShow:false,
    type:0,
    content:"",
    orderType:2,  //1为外卖，2为自提
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
    goodsInfo:''
  },
  onLoad(e) {
    // // 获取商品
    const data = my.getStorageSync({key: 'goodsList'}).data;
    const shopGoods = JSON.parse(my.getStorageSync({key:'shopGoods'}).data);
    let arr = []
    arr = shopGoods
    .map(_item => _item.last.filter(item =>
      data.some(value => value.goods_code == item.goods_code)
    ))
    // 获取购物车商品
    let shopcartGoods = [];
    arr.forEach(item => {
      if(item.length>0){
          shopcartGoods=[...shopcartGoods, ...item];
      }
    })
    //  计算价格
    let priceAll = 0;
    data.forEach(item => {
      priceAll += item.goods_price * item.goods_quantity
    })
    this.setData({
      shopcartGoods,
      goodsInfo:data,
      priceAll,
      orderType:e.orderType
    })

    const shop_id = my.getStorageSync({key: 'shop_id'}).data;
    if(e.orderType == 2) {
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
      console.log(arr)
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

    // switch(this.data.type) {
    //   case 0:
    //     this.setData({
    //       content: "有5个商品已失效，系统已清除，是否确认结算"
    //     })
    //      break;
    //   case 1:
    //     this.setData({
    //       content: "有5个商品价格更新，系统已清更新，是否确认结算"
    //     })
    //      break;
    //   case 2:
    //     this.setData({
    //       content: "有1个商品已失效，有5个商品价格更新，系统已清更新，是否确认结算"
    //     })
    //      break;
    // }
  },
  // 换购显示
  addRepurseTap(){
    this.setData({
      countN:1
    })
  },
  // 减
  reduceBtnTap(e){
    // this.setData({
    //   countN: this.data.countN - 1
    // })
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
    // this.setData({
    //   countN: this.data.countN + 1
    // })
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
  onCounterPlusOne(){
    this.setData({
      mask: false,
      modalShow: false
    })
  },
  // 支付
  confirmPay(){
    this.setData({
      mask: true,
      modalShow: true
    })
  },
  // 同意协议
  checkedTrueTap(){
    this.setData({
      isCheck: !this.data.isCheck
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
  }
  
});
