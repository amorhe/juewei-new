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
    goodsResult:[],
    orderType:""
  },
  props: {},
  didMount() {
   
  },
  didUpdate() {
    this.setData({
     orderType:this.props.orderType
   })
   if(my.getStorageSync({key:'goodsList'}).data){
     this.setData({
      goodsResult: this.props.goodsResult
    })
   }else{
     this.setData({
      goodsResult: this.props.goodsResult
    })
   }
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
      if(this.data.goodscartList.length == 0) {
        my.showToast({
          content:"请至少选择一件商品"
        });
        return 
      }
      let goods = JSON.stringify(this.data.goodscartList);
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
      })
      my.navigateTo({
        url:'/pages/home/orderform/orderform?orderType=' + this.data.orderType + '&goodsList=' + JSON.stringify(this.data.goodscartList)
      });
    }
  },
});
