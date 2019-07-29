import {imageUrl} from '../../common/js/baseUrl'
var app = getApp();
Component({
  mixins: [],
  data: {
    showShopcar:false ,  //购物车
    mask:false, //遮罩
    imageUrl,
    modalShow: false, //弹框
    mask1: false,
    shopGoods:[],
    shopcartGoods:[],
    orderType:"",
    priceAll:'',
    goodsInfo:'',
    send_price:"",   //起送费
    dispatch_price: '', // 邮费
    isType:'',
    content:''
  },
  props: {
    shopcartList:[]
  },
  onInit(){
    
  },
  didMount() {
    this.setData({
      orderType:this.props.orderType
    })
    this.getSendPrice();
     // 获取购物车数据
    let data = [];
    // data = this.props.shopcartList
    data = my.getStorageSync({key:'shopcartList'}).data;
    console.log(data)
    //  计算价格
    if(data.length>0){
      let priceAll = 0;
      data.forEach(item => {
        priceAll += item.goods_price * item.goods_quantity
      })
      this.setData({
        priceAll,
        shopcartGoods:data
      })
    }
     
  },
  deriveDataFromProps(){
  
  },
  didUpdate() {
    // 获取购物车数据
    // let data = [];
    // // data = this.props.shopcartList
    // data = my.getStorageSync({key:'shopcartList'}).data;
    // console.log(data)
    // //  计算价格
    // if(data.length>0){
    //   let priceAll = 0;
    //   data.forEach(item => {
    //     priceAll += item.goods_price * item.goods_quantity
    //   })
    //   this.setData({
    //     priceAll,
    //     shopcartGoods:data
    //   })
    // }
  },
  didUnmount() {},
  methods: {
    // 打开购物车
    openShopcart(){
      this.setData({
        showShopcar: true,
        mask1: true
      })
    },
    hiddenShopcart(){
      this.setData({
        showShopcar: false,
        mask1: false
      })
    },
    // 清空购物车
    clearShopcart(){
       this.setData({
        showShopcar: false,
        mask1:false,
        mask:true,
        modalShow: true,
        isType:'clearShopcart',
        content:'是否清空购物车'
      })
      
    },
    onCounterPlusOne(data) {
      console.log(data)
      this.setData({
        mask: data.mask,
        modalShow: data.modalShow
      })
      if(data.isType =='clearShopcart' && data.type == 1){
        // 清空购物车
        my.removeStorageSync({key:'goodsList'});
        my.removeStorageSync({key:'shopcartList'});
      }
    },
    // 立即购买
    goOrderSubmit(){
      if(this.data.shopcartGoods.length == 0) {
        my.showToast({
          content:"请至少选择一件商品"
        });
        return 
      }
      let goods = JSON.stringify(my.getStorageSync({key: 'goodsList'}).data);
      let shop_id;
      if(this.data.orderType == 1){
        shop_id = my.getStorageSync({
          key: 'takeout', // 缓存数据的key
        }).data[0].shop_id;
      }else {
        shop_id = my.getStorageSync({
          key: 'self', // 缓存数据的key
        }).data[0].shop_id;
      }
      my.navigateTo({
        url:'/pages/home/orderform/orderform?orderType=' + this.data.orderType
      });       
    },
    // 获取起送价格
    getSendPrice(){
      const timestamp = new Date().getTime();
      my.request({
        url: `https://imgcdnjwd.juewei.com/static/check/api/shop/open-city.json?v=${timestamp}`,
        success: (res) => {
          console.log(res)
          this.setData({
            send_price:res.data.data['110100'].shop_send_price,
            dispatch_price:res.data.data['110100'].shop_dispatch_price
          })
        },
      });
    }
  },
});
