import {imageUrl} from '../../common/js/baseUrl'
import {createOrder} from '../../common/js/home'
Component({
  mixins: [],
  data: {
    showShopcar:false ,  //购物车
    mask:false, //遮罩
    imageUrl,
    modalShow: false, //弹框
    mask1: false,
  },
  props: {},
  didMount() {
   
  },
  didUpdate() {
    this.setData({
     orderType:this.props.orderType
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
        modalShow: true 
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
      my.navigateTo({
        url:'/pages/home/orderform/orderform?orderType=' + this.data.orderType
      });
    }
  },
});
