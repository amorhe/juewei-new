import {imageUrl} from '../../common/js/baseUrl'
Page({
  data: {
    imageUrl,
    order_no:''
  },
  onLoad(e) {
    this.setData({
      order_no:e.order_no
    })
  },
  checkOrder(){
    my.redirectTo({
      url: '/package_order/pages/orderdetail/orderdetail?order_no=' + this.data.order_no, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
    })
  }
});
