import { imageUrl, imageUrl2 } from '../../../pages/common/js/baseUrl'
import { log, ajax, region } from '../../../pages/common/js/li-ajax'
Page({
  data: {
    imageUrl,
    imageUrl2,

    // 地址
    name: '',

    sex: 0,

    phone: '',

    address: '',


    d: {
      "id": "17",
      "order_point": "1",
      "order_amount": 0,
      "exchange_type": "1",
      "uid": "295060",
      "express_fee": 0.01,
      "express_type": "2",
      "receive_type": "1",
      "order_total_amount": 0.01,
      "goods_name": "33",
      "goods_pic": "/static/check/image/goods_point/0PqRYnGJ1XUZRKuQ.jpg",
      "order_sn": "jwd03190301s175060",
      "limit_pay_minute": -3907,
      "limit_pay_second": -29,
      "code": 'xxx'
    },

    selectAddress: false,

    addressList: region,
    provinceList: [],
    cityList: [],
    countryList: [],
    defaultAddress: [0, 0, 0]


  },
  async onLoad(e) {
    let { order_sn } = e
    this.getAddressList()
    await this.getOrderInfo({ order_sn })
  },

  /**
   * @function 获取公众号支付前订单详情
   */
  async getOrderInfo(order_sn) {
    let {showSelectAddress} = this.data;
    let { code, data: { order_sn: _order_sn, limit_pay_second, ...rest } } = await ajax('/mini/vip/wap/order/order_info', order_sn)
    if (code === 100) {
      setInterval(() => {
        --limit_pay_second
        if (limit_pay_second === 0) {
          this.getOrderInfo({ order_sn: _order_sn })
        }
       
        this.setData({
          d: { _order_sn, limit_pay_second, ...rest }
        })
      }, 1000)
    }
  },

   getAddressList() {
    let [curProvince, curCity, curCountry] = this.data.defaultAddress;
    let provinceList = region.map(({ addrid, name }) => ({ addrid, name }))
    let cityList = region[curProvince].sub
    let countryList = cityList[curCity].sub

    this.setData({
      provinceList,
      cityList,
      countryList
    })
  },

  changeAddress(e) {
    let [curProvince, curCity, curCountry] = this.data.defaultAddress;
    let cur = e.detail.value
    if (cur[0] != curProvince) {
      cur = [cur[0], 0, 0]
    }

    if (cur[1] != curCity) {
      cur = [cur[0], cur[1], 0]
    }

    this.setData({
      defaultAddress: cur,
      address: region[cur[0]].name + ' ' +
       region[cur[0]].sub[cur[1]].name + ' ' +
       ((region[cur[0]].sub[cur[1]].sub[cur[2]] && region[cur[0]].sub[cur[1]].sub[cur[2]].name ) || ' ')
    },
      () => this.getAddressList()
    )
  },

  showSelectAddress() {
    this.setData({ selectAddress: true })
  },

  hideSelectAddress() {
    this.setData({ selectAddress: false })
  },

  // 地址
  changeSex() {
    const { sex } = this.data;

    this.setData({
      sex: sex === 0 ? 1 : 0
    })
  },

  changeCur(e) {
    let curLabel = e.currentTarget.dataset.cur
    if (curLabel === this.data.curLabel) curLabel = '-1'
    this.setData({ curLabel })
  },

  handelChange(e) {
    let { key } = e.currentTarget.dataset;
    let { value } = e.detail;
    this.setData({ [key]: value })
  }

});
