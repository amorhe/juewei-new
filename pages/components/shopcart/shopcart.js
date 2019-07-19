import {imageUrl,imageUrl2,ak} from '../../common/js/baseUrl'
import {couponsExpire,MyNearbyShop,GetShopGoods} from '../../common/js/home'
import {datedifference} from '../../common/js/time'
Component({
  mixins: [],
  data: {
    scroll_y:false, 
    imageUrl,
    imageUrl2,
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
    activityAllObj:[],
    shopcartArr:[],     //购物车
    showAnmimation:true,
    windowHeight:''
  },
  onInit() {
    
  },
  didMount() {
    const _sid = my.getStorageSync({key: '_sid'});
    this.getcouponsExpire(_sid.data);
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },
  didUpdate() {
    this.setData({
      scroll_y:this.props.scrollY,
      type:this.props.type
    })
    if(!this.props.scrollY) {
      this.setData({
        goodsType:0
      })
    }
    if(this.props.shopGoodsList){
      this.props.shopGoodsList.forEach(val => {
        val.last.forEach(v=> {
          v.count = 0;
        })
      })
      this.setData({
        shopGoodsList:this.props.shopGoodsList
      })
    }
    if(this.props.activityAllObj){
      this.setData({
        activityAllObj:this.props.activityAllObj
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
      this.data.shopGoodsList[e.currentTarget.dataset.type].last[e.currentTarget.dataset.index].count ++;
      const animation = my.createAnimation({
        duration: 400,
        timingFunction: 'ease-in-out', 
        transformOrigin: '50% 50% 0',
        success: function(res) { 
        }
      })
      my.createSelectorQuery().select(`.ball${e.currentTarget.dataset.type}${e.currentTarget.dataset.index}`).boundingClientRect().exec((ret) => {
        animation.translate(-ret[0].left+57 ,this.data.windowHeight - ret[0].top - 114).step();
        this.data.shopGoodsList[e.currentTarget.dataset.type].last[e.currentTarget.dataset.index].animationInfo = animation.export();
        this.setData({
          shopGoodsList: this.data.shopGoodsList
        });
      })
     
      
    },
    reduceshopcart(e){
      this.data.shopGoodsList[e.currentTarget.dataset.type].last[e.currentTarget.dataset.index].count --;
      this.setData({
        shopGoodsList: this.data.shopGoodsList
      })
    },
  }
});
