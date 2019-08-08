import { imageUrl } from '../../common/js/baseUrl'
import { ajax, log } from '../../common/js/li-ajax'
Page({
  data: {
    imageUrl,
    order_no: '',
    show: false,
    new_user: [],
  },
  onLoad(e) {
    this.setData({
      order_no: e.order_no
    }),
    this.getCouponsList();
  },


  checkOrder() {
    my.redirectTo({
      url: '/package_order/pages/orderdetail/orderdetail?order_no=' + this.data.order_no, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
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

});
