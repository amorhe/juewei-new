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
    shopcartGoods:[[{"cate_name":"招牌系列","company_goods_id":"898","company_goods_name":"招牌鸭头","company_id":"51","count":1,"goods_buy_sum":33324,"goods_category_id":"1","goods_channel":"A1","goods_code":"A1QLT42","goods_format":[{"goods_price":"200","type":""}],"goods_id":42,"goods_img":["http://imgcdnjwd.juewei.com/goods/1462871563big_img.jpg"],"goods_img_detail":["http://imgcdnjwd.juewei.com/goods/1462871563img1.jpg"],"goods_img_detail_origin":["/goods/1462871563img1.jpg"],"goods_img_intr":["http://imgcdnjwd.juewei.com/img_intr/A1QLT42.jpg"],"goods_img_intr_origin":["/img_intr/A1QLT42.jpg"],"goods_img_origin":["/goods/1462871563big_img.jpg"],"goods_introduce":"小小的鸭头，大大的用心，老汤是上等的，配方是秘制的，就冲着这份诚意，泥萌也该尝尝。","goods_is_del":"0","goods_is_on":"1","goods_is_recommend":"0","goods_name":"招牌鸭头","goods_sap_code":"300004","goods_small_img":["http://imgcdnjwd.juewei.com/goods/1462871563small_img.jpg"],"goods_small_img_origin":["/goods/1462871563small_img.jpg"],"goods_taste_id":"2","goods_type":"QLT","goods_unit":"个","largeCount":0,"sap_code":"300004","smallCount":0,"taste_name":"超辣"}]],
    orderType:"",
    priceAll:''
  },
  props: {},
  onInit(){
    
  },
  didMount() {

  },
  deriveDataFromProps(){
  
  },
  didUpdate() {
    this.setData({
      orderType:this.props.orderType
    })
    let data = my.getStorageSync({key:'goodsList'}).data;
    console.log(data)
    // 无规格商品
    let arr1 = data.filter(item => {
        return item.count > 0
    }) 
    // 大份
    let arr2 = data.filter(item => {
        return item.largeCount > 0
    })
    // 小份
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

  //  this.setData({
  //    priceAll:price1 + price2 + price3,
  //    shopcartGoods:data
  //  })
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
   
  },
});
