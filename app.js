import { loginByAliUid } from './pages/common/js/login'
import { baseUrl } from './pages/common/js/baseUrl'
App({
  onLaunch(options) {
    // 第一次打开
 
    var that = this;
    //贝塞尔曲线
    this.screenSize();
    // options.query == {number:1}
    // 获取授权
    my.getAuthCode({
      scopes: ['auth_base'],
      success: (res) => {
        my.setStorageSync({
          key: 'authCode', // 缓存数据的key
          data: res.authCode, // 要缓存的数据
        });
        loginByAliUid(res.authCode).then((data) => {
          console.log(data, 'data')
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
          }else{
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
    //my.clearStorageSync();
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
  //获取屏幕[宽、高]
  screenSize() {
    var that = this;
    my.getSystemInfo({
      success: function(res) {
        that.globalData.ww = res.windowWidth;
        that.globalData.hh = res.windowHeight;
      }
    })
  },

  /**

      * @param sx 起始点x坐标

      * @param sy 起始点y坐标

      * @param cx 控制点x坐标

      * @param cy 控制点y坐标

      * @param ex 结束点x坐标

      * @param ey 结束点y坐标

      * @param part 将起始点到控制点的线段分成的份数，数值越高，计算出的曲线越精确

      * @return 贝塞尔曲线坐标

    */
  bezier(points, part) {
    let sx = points[0]['x'];
    let sy = points[0]['y'];
    let cx = points[1]['x'];
    let cy = points[1]['y'];
    let ex = points[2]['x'];
    let ey = points[2]['y'];
    var bezier_points = [];
    // 起始点到控制点的x和y每次的增量
    var changeX1 = (cx - sx) / part;
    var changeY1 = (cy - sy) / part;
    // 控制点到结束点的x和y每次的增量
    var changeX2 = (ex - cx) / part;
    var changeY2 = (ey - cy) / part;
    //循环计算
    for (var i = 0; i <= part; i++) {
      // 计算两个动点的坐标
      var qx1 = sx + changeX1 * i;

      var qy1 = sy + changeY1 * i;

      var qx2 = cx + changeX2 * i;

      var qy2 = cy + changeY2 * i;
      // 计算得到此时的一个贝塞尔曲线上的点
      var lastX = qx1 + (qx2 - qx1) * i / part;

      var lastY = qy1 + (qy2 - qy1) * i / part;

      // 保存点坐标
      var point = {};

      point['x'] = lastX;

      point['y'] = lastY;

      bezier_points.push(point);

    }

    // console.log(bezier_points)

    return {

      'bezier_points': bezier_points

    };

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
    coupon_code:null   //优惠券
  }
});
