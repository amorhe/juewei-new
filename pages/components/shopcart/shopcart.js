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
    companyGoodsList:[],   //公司所有商品
    activityAllObj:[],
    shopcartArr:[],     //购物车
    showAnmimation:false,
    windowHeight:'',
    animation:null,
    goodsItem:{},   //选择规格一条商品
    goodsResult:[],
    goodsKey:"",
    goodsLast:''
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
    // 初始化加入购物车的商品数量
    if(this.props.shopGoodsList){
      this.props.shopGoodsList.forEach(val => {
        val.last.forEach(v=> {
          v.count = 0;
          v.largeCount = 0;
          v.smallCount = 0;
        })
      })
      this.setData({
        shopGoodsList:this.props.shopGoodsList,
        companyGoodsList:this.props.companyGoodsList
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
    // 选规格
    chooseSizeTap(e){
      // console.log(e)
      this.setData({
        maskView:true,
        goodsModal:true,
        goodsItem: e.currentTarget.dataset.item,
        goodsKey: e.currentTarget.dataset.type,
        goodsLast: e.currentTarget.dataset.index
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
      //   // console.log(ret)
      //   let arr = ret[0].filter((item,index) => {
      //     return item.top<=104.5
      //   })
      //   this.setData({
      //     goodsType:arr.length + 1
      //   })
      // })
    },
    addshopcart(e){
      let{ shopGoodsList } = this.data
      shopGoodsList[e.currentTarget.dataset.type].last[e.currentTarget.dataset.index].count ++;
      let goodsResult=[];
      this.data.shopGoodsList = shopGoodsList;
      let buyArr = shopGoodsList.map(item =>  item.last.filter(_item=> _item.count > 0))
      goodsResult = buyArr.filter(item => item.length>0);
      if(my.getStorageSync({key:'goodsList'}).data){
        const oldArr = my.getStorageSync({key:'goodsList'}).data;
        goodsResult.concat(oldArr);
      } 
      this.data.goodsResult = goodsResult;
      this.setData({
        shopGoodsList,
        goodsResult: this.data.goodsResult
      })
        my.setStorageSync({
          key: 'goodsList', // 缓存数据的key
          data: goodsResult, // 要缓存的数据
        });
      // 加入购物车小红点动画效果
      // my.createSelectorQuery().select(`.ball${e.currentTarget.dataset.type}${e.currentTarget.dataset.index}`).boundingClientRect().exec((ret) => {
      //   this.animation1.translate(-ret[0].left+57,this.data.windowHeight - ret[0].top - 114).opacity(1).step();
      //   this.data.shopGoodsList[e.currentTarget.dataset.type].last[e.currentTarget.dataset.index].animationInfo = this.animation1.export();
      //   // this.animation2.translate(0,0).opacity(1).step();
      //   // this.data.shopGoodsList[e.currentTarget.dataset.type].last[e.currentTarget.dataset.index].animationInfo = this.animation2.export();
      //   // this.setData({
      //   //   shopGoodsList: this.data.shopGoodsList
      //   // });
      // })
      
    },
    reduceshopcart(e){
      this.data.shopGoodsList[e.currentTarget.dataset.type].last[e.currentTarget.dataset.index].count --;
       this.setData({
        shopGoodsList: this.data.shopGoodsList
      })
     
    },
    // 商品详情
    goodsdetailContent(e){
      my.navigateTo({
        url: '/pages/home/goodslist/goodsdetail/goodsdetail?goodsAll=' + JSON.stringify(e.currentTarget.dataset.goodsAll) + '&goods_id=' + e.currentTarget.dataset.goods_id
      });
    }
  }
});
