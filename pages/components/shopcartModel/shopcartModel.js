import {imageUrl} from '../../common/js/baseUrl'
import {confirmOrder} from '../../common/js/home'
Component({
  mixins: [],
  data: {
    showShopcar:true ,  //购物车
    mask:false, //遮罩
    imageUrl,
    modalShow: false, //弹框
    mask1: false,
    goodsArr:[],
    orderType:"",
    priceAll:''
  },
  props: {},
  didMount() {
  //  let data = JSON.parse(my.getStorageSync({key:'goodsList'}).data);
  //  console.log(data)
  //  if(data){
  //    this.setData({
  //     goodsResult: data
  //    })
  //  }
  },
  didUpdate() {
    this.setData({
     orderType:this.props.orderType
   })
   
    let data = my.getStorageSync({key:'goodsList'}).data;
    let arr1 = data.filter(item => {
        return item.count > 0
    }) 
    let arr2 = data.filter(item => {
        return item.largeCount > 0
    })
   let arr3 = data.filter(item => {
      return item.smallCount > 0
   })
   let price1 = 0,price2 = 0,price3 = 0;
   arr1.forEach(item => {
     price1 += item.goods_format[0].goods_price / 100 * item.count
   })
   arr2.forEach(item => {
     price2 += item.goods_format[1].goods_price * item.largeCount
   })
   arr3.forEach(item => {
     price3 += item.goods_format[0].goods_price * item.smallCount
   })
   console.log(data)
   this.setData({
     priceAll:price1 + price2 + price3,
    //  goodsArr:data
   })
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
        goodscartList:[]
      })
    },
    onCounterPlusOne(data) {
      this.setData({
        mask: data.mask,
        modalShow: data.modalShow
      })
    },
    // 立即购买
    goOrderSubmit(){
      if(this.data.goodsArr.length == 0) {
        my.showToast({
          content:"请至少选择一件商品"
        });
        return 
      }
      let goods = JSON.stringify(this.data.goodsArr);
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
      
      
    }
  },
});
