import {imageUrl} from '../../common/js/baseUrl'
var app=getApp(); //放在顶部
Page({
  data: {
    scroll_y: false,
    imageUrl,
    firstAddress:'紫檀大厦',  
    type:1,  //默认外卖
    isClose: false,  //是否营业，true为营业中
    indicatorDots: false,
    autoplay: false,
    vertical: false,
    interval: 1000,
    circular: true,
    imgUrls:['../../common/img/banner.png'],
    goodsType:1,   //系列
    goodsList:[
      {
        type:1
      },
      {
        type:2
      },
      // {
      //   type:3
      // },
      // {
      //   type:4
      // },
      // {
      //   type:5
      // },{
      //   type:6
      // },
      // {
      //   type:7
      // },
      // {
      //   type:8
      // },
      // {
      //   type:9
      // },
      // {
      //   type:10
      // },
      // {
      //   type:11
      // },
      // {
      //   type:12
      // },
      // {
      //   type:13
      // }
    ],
    toActive:1,
    scrollY:false,
    showShopcar:false
  },
  onLoad(query) {
    // 页面加载
    //判断定位地址是否存在
    // if(app.globalData.location && app.globalData.location.longitude=== null && app.globalData.location.latitude=== null){
    //   my.redirectTo({
    //      url: '../../position/position'
    //   })
    // }
    if(query.address1 || query.address2) {
      this.setData({
      firstAddress: query.address1 + query.address2
    })
    }
    if(this.data.imgUrls.length>1){
      this.setData({
        indicatorDots:true,
        autoplay:true
      })
    }
  },
  onShow() {
    // 页面显示 每次显示都执行
    // my.alert({ title: 'onShow=='+app.globalData.authCode });
   
   
  },
  onReady() {
    // 页面加载完成 只加载一次 页面初始化用

   
  },
    // 切换外卖自提
  chooseTypes(e){
    if(e.currentTarget.dataset.type=='ziti'){
        this.setData({
          type:2
        })
    }else{
     this.setData({
        type:1
     }) 
    }
  },
  // 选择系列
  chooseGoodsType(e) {
    this.setData({
      goodsType: e.currentTarget.dataset.type,
      toActive: e.currentTarget.dataset.type
    })
  },
  preventDefaultFn(e){
    
  },
  // 打开购物车
  openShopcart(){
    this.setData({
      showShopcar: true
    })
  },
  hiddenShopcart(){
    this.setData({
      showShopcar: false
    })
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onGetAuthorize(res) {
      my.getOpenUserInfo({
        success: (userinfo) => {
           my.alert({ title: 'getOpenUserInfo='+JSON.stringify(userinfo) });
         console.log(userinfo)
        },
        fail(){
           my.alert({ title:'获取用户信息失败' });
        }
      });
  },
  xiadan(){
    my.alert({ title: '点击' });
    //判断用户信息是否存在
    if(app.globalData.location.longitude!==null && app.globalData.userInfo=== null){
      //获取用户信息
       my.getOpenUserInfo({
        success: (userinfo) => {
           my.alert({ title: 'getOpenUserInfo='+JSON.stringify(userinfo) });
         console.log(userinfo)
        },
        fail(){
           my.alert({ title:'获取用户信息失败' });
        }
      });
    }
  },
  onPageScroll:function(e){
    my.createSelectorQuery().select('#pagesinfo').boundingClientRect().exec((ret)=>{
      console.log(ret[0].top)
      // if(ret[0].top == 127){
      //   this.setData({
      //     scrollY: true
      //   })
      // }else{
      //   this.setData({
      //     scrollY: false
      //   })
      // }
      if(ret[0].top==0){
        this.setData({
          scroll_y:true
        });
      }else{
        this.setData({
          scroll_y:false
        });
      }
    })
  },
});
