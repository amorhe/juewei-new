import {imageUrl,imageUrl2} from '../../common/js/baseUrl'
import {bannerList} from '../../common/js/home'
import {loginByAliUid} from '../../common/js/login'
var app=getApp(); //放在顶部
Page({
  data: {
    scroll_y: false,
    imageUrl,
    imageUrl2,
    firstAddress:'紫檀大厦',  
    type:1,  //默认外卖
    isClose: false,  //是否营业，true为营业中
    indicatorDots: false,
    autoplay: false,
    vertical: false,
    interval: 1000,
    circular: true,
    imgUrls:['../../common/img/banner.png']
  },
  onLoad(query) {
    // 页面加载
    //判断定位地址是否存在
    // if(app.globalData.location && app.globalData.location.longitude=== null && app.globalData.location.latitude=== null){
    //   my.redirectTo({
    //      url: '../../position/position'
    //   })
    // }

    // 定位地址
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
    this.getBannerList(110100,110105,1,1);
  },
  onShow() {
    // 页面显示 每次显示都执行
    // my.alert({ title: 'onShow=='+app.globalData.authCode });
   
   
  },
  onReady() {
    // 页面加载完成 只加载一次 页面初始化用

   
  },
  onGetAuthorize() {
    my.getAuthCode({
      success: (ref) => {
        my.getOpenUserInfo({
          fail: (res) => {
          },
          success: (res) => {
            let userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
            const data = loginByAliUid(ref.authCode,userInfo.nickName,userInfo.avatar);
          }
        });
      },
    });
  },
  onGetPhone(){
    my.getPhoneNumber({
      success: (res) => {
          let encryptedData = res.response;
          console.log(encryptedData)
      },
      fail: (res) => {
          console.log(res);
          console.log('getPhoneNumber_fail');
      },
    });
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
  // 首页banner列表
  getBannerList(city_id,district_id,company_id,release_channel){
     bannerList(city_id,district_id,company_id,release_channel).then((data) => {
       this.setData({
        imgUrls:data.data
       })
     });
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
      if(ret[0].top<=127){
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
