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
    activityList:[],
    goods_num:0
  },
  onInit() {
    
  },
  didMount() {
    const _sid = my.getStorageSync({key: '_sid'});
    this.getcouponsExpire(_sid.data);
  },
  didUpdate() {
    this.setData({
      scroll_y:this.props.scrollY
    })
    if(!this.props.scrollY) {
      this.setData({
        goodsType:0
      })
    }
    if(this.props.shopGoodsList){
      this.setData({
        shopGoodsList:this.props.shopGoodsList
      })
    }
    if(this.props.activityList){
      this.setData({
        activityList:this.props.activityList
      })
    }
  },
  didUnmount() {},
  methods: {
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
      // my.createSelectorQuery().selectAll('.goodsTypeEv').boundingClientRect().exec((ret)=>{
      //   let arr = ret[0].filter((item,index) => {
      //     return item.top<=104.5
      //   })
      //   this.setData({
      //     goodsType:arr.length
      //   })
      // })
    },
    addshopcart(e){
      this.setData({
        goods_num:this.data.goods_num += 1
      })
      ;
    },
    reduceshopcart(){
      this.setData({
        goods_num:this.data.goods_num -= 1
      })
    }
  }
});
