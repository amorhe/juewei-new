// 欢迎页面，定位授权并获取实时定位页面
var app=getApp(); //放在顶部
Page({
    data: {
     logtxt:''
    },
    onLoad() {
      var that=this;
      my.getLocation({
        success(res) {
          console.log('my.getLocation=',res)
          my.hideLoading();
          // app.globalData.location.longitude = res.longitude;
          // app.globalData.location.latitude = res.latitude;
          my.setStorageSync({
          key: 'lat', // 缓存数据的key
          data: res.latitude, // 要缓存的数据
        });
        my.setStorageSync({
          key: 'lng', // 缓存数据的key
          data: res.longitude, // 要缓存的数据
        });
          that.setData({
            logtxt: '定位成功'
          });
          setTimeout(function(){
            my.redirectTo({
                url: '/pages/home/goodslist/goodslist'
            })
          },1000)
        },
        fail() {
          my.hideLoading();
          my.alert({ title: '定位失败' });
        },
      })
    },
    onShow() {
      // 页面显示
    },
    onReady() {
      // 页面加载完成
      console.log('onready');
    },
    onHide() {
      // 页面隐藏
    },
    onUnload() {
      // 页面被关闭
    },
});
