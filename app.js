import { loginByAliUid } from './pages/common/js/login'
import { baseUrl } from './pages/common/js/baseUrl'
App({
  onLaunch(options) {
    // 第一次打开
    // 获取授权
    my.getAuthCode({
      scopes: ['auth_base'],
      success: (res) => {
        my.setStorageSync({
          key: 'authCode', // 缓存数据的key
          data: res.authCode, // 要缓存的数据
        });
        loginByAliUid(res.authCode).then((data) => {
          if (data.code == 0 && data.data.user_id) {
            my.setStorageSync({
              key: 'ali_uid', // 缓存数据的key
              data: data.data.ali_uid, // 要缓存的数据
            });
            my.setStorageSync({
              key: 'user_id', // 缓存数据的key
              data: data.data.user_id, // 要缓存的数据
            });
            my.setStorageSync({
              key: 'phone', // 缓存数据的key
              data: data.data.phone, // 要缓存的数据
            });
            my.setStorageSync({
              key: '_sid', // 缓存数据的key
              data: data.data._sid, // 要缓存的数据
            });
          } else {
            my.setStorageSync({
              key: 'ali_uid', // 缓存数据的key
              data: data.data.ali_uid, // 要缓存的数据
            });
            my.setStorageSync({
              key: '_sid', // 缓存数据的key
              data: data.data._sid, // 要缓存的数据
            });
          }
        })
      },
    });
  },
  onShow(options) {//多次执行
    //判断外部链接是否有参数值
    if (options.page && options.query) {
      //通过这个参数可以跳转到响应的连接中，注意这些链接需要
    }


    // my.clearStorageSync();
    // 从后台被 scheme 重新打开
    // console.log(options.query);
    // options.query == {number:1}
  },
  onHide() {
    // 当小程序从前台进入后台时触发
  },
  onError(error) {
    // 小程序执行出错时
    console.log(error);
  },
  
  globalData: {
    location: { //获取地区
      longitude: null,
      latitude: null
    },
    address: null,
    _sid: null,
    userInfo: null, //拉去支付宝用户信息
    authCode: null, //静默授权
    phone: null, //获取手机号权限
    addressInfo: null,   //切换定位地址
    gifts: null,    //加购商品
    type: 1,     // 默认外卖
    coupon_code: null   //优惠券
  }
});
