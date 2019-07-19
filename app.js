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
       loginByAliUid(res.authCode).then((data) => {
        my.setStorageSync({
          key: 'ali_uid', // 缓存数据的key
          data: data.data.ali_uid, // 要缓存的数据
        });
       })
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
    userInfo: null, //拉去支付宝用户信息
    authCode:null, //静默授权
    phone:null //获取手机号权限
    // 消息模板权限
  }



});
