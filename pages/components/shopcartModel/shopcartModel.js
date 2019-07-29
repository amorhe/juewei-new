import {imageUrl} from '../../common/js/baseUrl'
import {confirmOrder} from '../../common/js/home'
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
  },
  props: {},
  onInit(){
    
  },
  didMount() {
    const shopGoods = JSON.parse(my.getStorageSync({key:'shopGoods'}).data);
    this.setData({
      shopGoods 
    }) 
    this.getSendPrice();
    // 获取购物车数据
    let data = my.getStorageSync({key:'goodsList'}).data;
    let arr = []
    if(data!=null){
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
        priceAll
      })
    }
  },
  deriveDataFromProps(){
  
  },
  didUpdate() {
    // this.setData({
    //   orderType:this.props.orderType
    // })
    // // 获取购物车数据
    // let data = my.getStorageSync({key:'goodsList'}).data;
    // const {shopGoods} = this.data;
    // let arr = []
    // if(data!=null){
    //   arr = shopGoods
    //   .map(_item => _item.last.filter(item =>
    //     data.some(value => value.goods_code == item.goods_code)
    //   ))
    //   //获取购物车商品
    //   let shopcartGoods = [];
    //   arr.forEach(item => {
    //     if(item.length>0){
    //         shopcartGoods=[...shopcartGoods, ...item];
    //     }
    //   })
    // //  计算价格
    //   let priceAll = 0;
    //   data.forEach(item => {
    //     priceAll += item.goods_price * item.goods_quantity
    //   })
    //   // console.log(shopcartGoods)
    //   this.setData({
    //     shopcartGoods,
    //     goodsInfo:data,
    //     priceAll
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
        modalShow: true
      })
    },
    onCounterPlusOne(data) {
      console.log(data)
      this.setData({
        mask: data.mask,
        modalShow: data.modalShow
      })
    },
    // 立即购买
    goOrderSubmit(){
      if(this.data.shopcartGoods.length == 0) {
        my.showToast({
          content:"请至少选择一件商品"
        });
        return 
      }
      let goods = JSON.stringify(this.data.shopcartGoods);
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
      confirmOrder(this.data.orderType,shop_id,goods,shop_id).then((res) => {
        console.log(res)
        my.navigateTo({
          url:'/pages/home/orderform/orderform?orderType=' + this.data.orderType 
        }); 
      })
        
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
