import {imageUrl,ak} from '../../common/js/baseUrl'
import {couponsExpire,MyNearbyShop} from '../../common/js/home'
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
    shopList:[],   // 附近门店列表
  },
  props: {
    scrollY:""
  },
  onInit() {
    const _sid = my.getStorageSync({key: '_sid'});
    this.getcouponsExpire(_sid.data);
    // this.nearShop();


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
    // 获取附近门店
    nearShop(){
      const lng = my.getStorageSync({key:'lng'});
      const lat = my.getStorageSync({key:'lat'});
      my.request({
        url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=134917&location=${lng}%2C${lat}&ak=${ak}&radius=3000&sortby=distance%3A1&_=1504837396593&page_index=0&page_size=50&_=1563263791821`,
        success: (res) => {
          const obj = res.data.contents;
          MyNearbyShop(JSON.stringify(obj)).then((conf) => {
            console.log(conf)
            this.setData({
              shopList:conf
            })
          })
        },
      });
    },
    closeCouponView(){
      this.setData({
        isShow: false
      })
    },
    // 选择系列
    chooseGoodsType(e) {
      my.pageScrollTo({
        scrollTop: 610
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
