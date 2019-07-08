var app=getApp(); //放在顶部
Page({
  data: {
    scroll_y: false
  },
  onLoad(query) {
    // 页面加载
    console.log('onLoad');
    //判断定位地址是否存在
    if(app.globalData.location && app.globalData.location.longitude=== null && app.globalData.location.latitude=== null){
      my.redirectTo({
         url: '../../position/position'
      })
    }
  },
  onShow() {
    // 页面显示 每次显示都执行
    // my.alert({ title: 'onShow=='+app.globalData.authCode });
   
   
  },
  onReady() {
    // 页面加载完成 只加载一次 页面初始化用
    console.log('onready');
   
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
    console.log('监听',e);
  }
});
