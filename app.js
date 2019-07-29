import {loginByAliUid} from './pages/common/js/login'
import {baseUrl} from './pages/common/js/baseUrl'
App({
  onLaunch(options) {
    // 第一次打开
    var that=this;
    // options.query == {number:1}
    // 获取授权
    my.getAuthCode({
      scopes: ['auth_base'],
      success: (res) => {
        my.setStorageSync({
          key: 'authCode', // 缓存数据的key
          data: res.authCode, // 要缓存的数据
        });
      //  loginByAliUid(res.authCode).then((data) => {
      //   my.setStorageSync({
      //     key: 'ali_uid', // 缓存数据的key
      //     data: data.data.ali_uid, // 要缓存的数据
      //   });
      //   my.setStorageSync({
      //     key: '_sid', // 缓存数据的key
      //     data: data.data._sid, // 要缓存的数据
      //   });
      //  this.globalData._sid=data.data._sid
      //  })
      },
    });
  },
  onShow(options) {//多次执行
    // 从后台被 scheme 重新打开
    // console.log(options.query);
    // options.query == {number:1}
  },
  onHide(){
    // 当小程序从前台进入后台时触发
  },
  onError(error){
    // 小程序执行出错时
    console.log(error);
  },
  globalData: {
    location: { //获取地区
      longitude: null,
      latitude: null
    },
    address:null,
    _sid:null,
    userInfo: null, //拉去支付宝用户信息
    authCode:null, //静默授权
    phone:null, //获取手机号权限
    addressInfo:null,   //切换定位地址
    gifts:null,    //加购商品
  }



});
