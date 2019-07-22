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
    windowHeight:'',
    animation:null,
    goodsBuy:[],
    goodsResult:[]
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
    this.animation1 = my.createAnimation({
      duration: 400,
      timingFunction: 'linear', 
      transformOrigin: '50% 50% 0',
      success: function(res) { 
      }
    })
    this.animation2 = my.createAnimation({
      duration: 0,
      timingFunction: 'linear', 
      transformOrigin: '50% 50% 0',
      success: function(res) { 
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
      // console.log(e)
      // my.createSelectorQuery().selectAll('.goodsTypeEv').boundingClientRect().exec((ret)=>{
      //   // console.log(ret)
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
      // 加入购物车小红点动画效果
      my.createSelectorQuery().select(`.ball${e.currentTarget.dataset.type}${e.currentTarget.dataset.index}`).boundingClientRect().exec((ret) => {
        this.animation1.translate(-ret[0].left+57,this.data.windowHeight - ret[0].top - 114).opacity(1).step();
        this.data.shopGoodsList[e.currentTarget.dataset.type].last[e.currentTarget.dataset.index].animationInfo = this.animation1.export();
        // this.animation2.translate(0,0).opacity(1).step();
        // this.data.shopGoodsList[e.currentTarget.dataset.type].last[e.currentTarget.dataset.index].animationInfo = this.animation2.export();
        // this.setData({
        //   shopGoodsList: this.data.shopGoodsList
        // });
      })
      let obj = {
          "goods_code":e.currentTarget.dataset.goods_code,
          "goods_format":e.currentTarget.dataset.goods_format,
          "goods_quantity": e.currentTarget.dataset.goods_quantity,
          "goods_price": e.currentTarget.dataset.price,
          "goods_name": e.currentTarget.dataset.goods_name,
          "taste_name": e.currentTarget.dataset.taste_name
        }
        this.data.goodsResult.push(obj);
        // let shopcartArr = [];
        // if(my.getStorageSync({key: 'goodsList'}).data){
        //   shopcartArr = my.getStorageSync({key: 'goodsList'}).data
        // }else{
        //   shopcartArr = []
        // }
        // let a =  this.data.goodsBuy.map(item => {
        //   if(shopcartArr.length == 0) {
        //     shopcartArr.push(item);
        //   }else{
        //     // shopcartArr.filter(_item => {
        //     //   if(item.goods_code != _item.goods_code) {
        //     //     shopcartArr.push(item);
        //     //   }else{
        //     //     //  shopcartArr.filter(items => items.goods_code == _item.goods_code);
        //     //     //  return shopcartArr
        //     //   }
        //     // }) 
        //   }
        // })
        console.log(this.data.goodsResult)
        this.setData({
          goodsResult:this.data.goodsResult,
          shopGoodsList: this.data.shopGoodsList
        });
        // my.setStorageSync({
        //   key: 'goodsList', // 缓存数据的key
        //   data: this.data.goodsResult, // 要缓存的数据
        // });
    },
    reduceshopcart(e){
      this.data.shopGoodsList[e.currentTarget.dataset.type].last[e.currentTarget.dataset.index].count --;
      this.setData({
        shopGoodsList: this.data.shopGoodsList
      })
    },
  }
});
