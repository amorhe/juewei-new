import { imageUrl } from '../../common/js/baseUrl'
import { ajax, log } from '../../common/js/li-ajax'
var app = getApp();
Page({
  data: {
    imageUrl,
    order_no: '',
    show: false,
    new_user: [],
    newUserShow: false,
    gifts: false,
    gift_type: 0
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
    app.globalData.refresh_state = app.globalData.type - 1;
    my.switchTab({
      url: '/pages/order/list/list',
    })
  },

  /**
   * @function 判断是否是新用户
   */
  // 订单详情接口  
  // 中会返回一个 new_user 参数   
  // new_user如果为空或者不存在或者为0   都说明不是新用户首单  
  // 如果new_user==1则是新用户首单 新用户下单当天只弹一次  
  // 不同用户同一设备都要弹  弹框内容是百元大礼包券（请求coupon/list接口  和会员新人礼包券一样）

  async isNewUser() {
    const { order_no } = this.data
    let new_user = my.getStorageSync({
      key: 'new_user', // 缓存数据的key
    }).data;
    // 说明不是 第一次
    if (new_user == 1) { return }
    let res = await ajax('/juewei-api/order/detail', { order_no })
    if (res.code == 0) {
      // console.log(res)
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
      // 虚拟商品弹框
      let static_no = 0;
      res.data.goods_list.forEach(item => {
        if (item.is_gifts == 1 && static_no == 0) {
          static_no = 1;
          // 优惠券
          if (item.gift_type == 1) {
            this.setData({
              gift_type: 1,
              gifts: true
            })
          }
          // 兑换码
          if (item.gift_type == 2) {
            this.setData({
              gift_type: 2,
              gifts: true
            })
          }
        } else {
          this.setData({
            gifts: false
          })
        }
      })

    }

  },

  confirmTap() {
    this.setData({
      gifts: false
    })
  },
  close() {
    this.setData({
      newUserShow: false
    })
  },

  /**
  * @function 获取礼包列表
  */

  async getCouponsList() {
    let res = await ajax('/mini/coupons/list', { get_type: 'new_user' })
    if (res.CODE === 'A100' && res.DATA.new_user && res.DATA.new_user.length > 0) {
      let new_user = res.DATA.new_user
        .map(({ end_time, ...item }) => ({
          end_time: new Date(end_time * 1000).toLocaleDateString(),
          ...item
        }))
      this.setData({
        new_user,
				newUserShow: true
      })
    }else {
			this.setData({
        newUserShow: false,
        new_user: []
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
