import { imageUrl, imageUrl2 } from '../../../pages/common/js/baseUrl'
import { ajax, log } from '../../../pages/common/js/li-ajax'



Page({
  data: {
    imageUrl,
    imageUrl2,
    _sid: '4966-inviq2t1sdl3s95idh7a0s1dn',

    orderList: [],

    page_num: 1,
    page_size: 100,

    time: ''
  },
  async onShow() {
    clearInterval(this.data.time)
    await this.getOrderList()
  },
  onUnload() {
    clearInterval(this.data.time)
  },

  async getOrderList() {
    let { _sid, page_num, page_size, time } = this.data;
    let res = await ajax('/mini/vip/wap/order/order_list', { _sid, page_num, page_size })
    if (res.code === 100) {
      let orderList = res.data.data
      time = setInterval(() => {
        orderList = orderList.map(({ remaining_pay_minute, remaining_pay_second, ...item }) => {
          remaining_pay_second--
          if (remaining_pay_second === 0 && remaining_pay_minute === 0) {
            return clearInterval(time)
          }
          if (remaining_pay_second <= 0) {
            --remaining_pay_minute
            remaining_pay_second = 59
          }
          return {
            remaining_pay_minute,
            remaining_pay_second,
            ...item,
          }
        })
        log(time)
        this.setData({ orderList, time })

      }, 1000)

    }
  },


  toOrderDetail(e) {
    const { id } = e.currentTarget.dataset
    my.navigateTo({
      url: './exchangedetail/exchangedetail?id=' + id
    });
  },

  switchTo() {
    my.switchTab({
      url: '/pages/vip/index/index', // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
    });
  }


});

let detail = {
  "id": "26",
  "order_point": "1",
  "order_amount": 0.01,
  "exchange_type": "2",
  "order_ctime": "2019-03-02 11:02:47",
  "uid": "295060",
  "order_type": "2",
  "status": "2",
  "dis_status": "2",
  "order_sn": "jwd03190302s265060",
  "goods_name": "4",
  "goods_pic": "/static/check/image/goods_point/wmyaUccmI47oFRkV.jpg",
  "status_name": "支付超时"
}
