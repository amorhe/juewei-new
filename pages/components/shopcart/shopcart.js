import {imageUrl,ak} from '../../common/js/baseUrl'
import {couponsExpire,MyNearbyShop,GetShopGoods} from '../../common/js/home'
import {datedifference} from '../../common/js/time'
Component({
  mixins: [],
  data: {
    scroll_y:false, 
    imageUrl,
    goodsType:0, //系列
    maskView:false,
    goodsModal:false,
    scrollT:0,
    couponsExpire:{
      full_money: 10,
      money: 7,
      days:1
    },          // 优惠券过期提醒     
    isShow: true,  // 优惠券过期提醒是否显示
    shopGoodsList:[],   // 门店商品列表
  },
  props: {
    scrollY:"",
    shop_id:""
  },
  onInit() {
    const _sid = my.getStorageSync({key: '_sid'});
    this.getcouponsExpire(_sid.data);
  },
  didMount() {},
  didUpdate() {
    this.setData({
      scroll_y:this.props.scrollY
    })
    if(!this.props.scrollY) {
      this.setData({
        goodsType:0
      })
    }
    if(this.props.shop_id!=''){
      this.getGoodsList(this.props.shop_id);
    }
  },
  didUnmount() {},
  methods: {
    // 门店商品列表
    getGoodsList(shop_id){
      GetShopGoods(shop_id).then((res) => {
        console.log(res)
      })
    },
     // 优惠券过期提醒
    getcouponsExpire(_sid){
      couponsExpire(_sid).then((res) => {
        res.data.days = datedifference(res.data.start_time,res.data.end_time)
        this.setData({
          couponsExpire:res.data
        })
        
      })
    },
    closeCouponView(){
      this.setData({
        isShow: false
      })
    },
    // 选择系列
    chooseGoodsType(e) {
      my.pageScrollTo({
        scrollTop: 510
      })
      this.setData({
        goodsType: e.currentTarget.dataset.type
      })
    },
    // 选择规格
    chooseSizeTap(){
      this.setData({
        maskView:true,
        goodsModal:true
      })
    },
    closeModal(data){
      this.setData({
        maskView:data.maskView,
        goodsModal:data.goodsModal
      })
    },
    scrollEvent(e){
      // 套餐
      // my.createSelectorQuery().select('.taocan').boundingClientRect().exec((ret)=>{
      //  if(ret[0].top<114) {
      //   this.setData({
      //     goodsType: 2
      //   })
      //  }
      // })
      // 爆款
      // my.createSelectorQuery().select('.baokuan').boundingClientRect().exec((ret)=>{
      //  if(ret[0].top<114) {
      //   this.setData({
      //     goodsType: 3
      //   })
      //  }
      // })
    }
  }
});
