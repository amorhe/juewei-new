import { loginByAliUid } from './pages/common/js/login'
import { baseUrl } from './pages/common/js/baseUrl'
App({
  onLaunch(options) {
    // 加入小程序检查更新
    const updateManager = my.getUpdateManager()

    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function() {
          my.confirm({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })

        updateManager.onUpdateFailed(function() {
          // 新版本下载失败
        })
      }
    })


    // page是拿不到的信息，只有query可以拿到
    if (options.query && options.query.go) {
      this.globalData.query = options.query.go;
      my.setStorageSync({
        key: 'query', // 缓存数据的key
        data: options.query.go, // 要缓存的数据
      });
    }
    // 第一次打开
    my.getNetworkType({
      success: (res) => {
        if (res.networkType == "NOTREACHABLE") {
          my.reLaunch({
            url: '/pages/noNet/noNet', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
          });
          return
        }
      }
    })
    my.onNetworkStatusChange((res) => {
      if (res.networkAvailable == true) {
        my.reLaunch({
          url: '/pages/position/position'
        })
      }
    })
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
            // console.log('loginByAliUid',data);
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
    // page是拿不到的信息，只有query可以拿到
    if (options.query && options.query.go) {
      this.globalData.query = options.query.go;
      my.setStorageSync({
        key: 'query', // 缓存数据的key
        data: options.query.go, // 要缓存的数据
      });
    }

    let that = this;
    my.getSystemInfo({
      success: res => {
        let modelmes = res.model;
        //判断iphone x以上的手机
        if (modelmes.search('iPhone') > -1 && res.statusBarHeight > 20) {
          that.globalData.isIphoneX = true
        } else {
          that.globalData.isIphoneX = false
        }
      }
    })
  },
  onHide() {
    // 当小程序从前台进入后台时触发
  },
  onError(error) {
    // 小程序执行出错时
    console.log(error);
  },
  onShareAppMessage() {
    return {
      title: '绝味鸭脖',
      desc: '会员专享服务，便捷 实惠 放心',
      imageUrl: 'https://cdn-wap.juewei.com/m/ali-mini/image/jwdlogo.png',
      bgImgUrl: 'https://cdn-wap.juewei.com/m/ali-mini/image/share_default.png',
      path: 'pages/position/position',
    };
  },
  globalData: {
    query: null,
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
    coupon_code: null,   //优惠券
    scrollTop: null,
    isOpen: '',
    province: null,
    city: null,
    chooseBool: false,
    isSelf: false,
    refresh: false, // 当前页面是否需要刷新
    gopages: '', //跳转到相应文件
    isIphoneX: false,
  }
});
