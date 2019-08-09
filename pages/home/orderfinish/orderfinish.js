import { imageUrl } from '../../common/js/baseUrl'
import { ajax, log } from '../../common/js/li-ajax'
Page({
  data: {
    imageUrl,
    order_no: '',
    show: false,
    new_user: [],
    newUserShow: false,
  },
  async onLoad(e) {
    const { order_no } = e
    this.setData({
      order_no
    }, async () => {
      await this.isNewUser()
    })
  },


  checkOrder() {
    my.redirectTo({
      url: '/package_order/pages/orderdetail/orderdetail?order_no=' + this.data.order_no, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
    })
  },

  /**
   * @function 判断是否是新用户
   */
  // 订单详情接口  
  // 中会返回一个 new_user 参数   
  // new_user如果为空或者不存在或者为0   都说明不是新用户首单  
  // 如果new_user==1则是新用户首单 新用户下单当天只弹一次  
  // 不同用户同一设备都要弹  弹框内容是百元大礼包券（请求coupon/list接口  和vip新人礼包券一样）

  async isNewUser() {
    const { order_no } = this.data
    let new_user = my.getStorageSync({
      key: 'new_user', // 缓存数据的key
    }).data;
    // 说明不是 第一次
    if (new_user == 1) { return }
    let res = await ajax('/juewei-api/order/detail', { order_no })
    if (res.code == 0) {
      // 说明是新用户
      if (res.data.new_user == 1) {
        my.setStorage({
          key: 'new_user', // 缓存数据的key
          data: 1, // 要缓存的数据
          success: async (res) => {
            await this.getCouponsList()
            this.setData({
              newUserShow: true
            })
          },
        });

      }
    }

  },


  close() {
    this.setData({
      newUserShow:false
    })
  },

  /**
  * @function 获取礼包列表
  */

  async getCouponsList() {
    let res = await ajax('/mini/coupons/list', { get_type: 'new_user' })
    if (res.CODE === 'A100') {
      let new_user = res.DATA.new_user
        .map(({ end_time, ...item }) => ({
          end_time: new Date(end_time * 1000).toLocaleDateString(),
          ...item
        }))
      this.setData({
        new_user
      })
    }
  },

  toTakeIn() {
    // app.globalData.type = 1
    // log(app.globalData.type)
    this.close()
    my.switchTab({
      url: '/pages/home/goodslist/goodslist'
    });
  },

});
