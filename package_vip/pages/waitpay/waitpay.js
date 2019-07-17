import { imageUrl, imageUrl2 } from '../../../pages/common/js/baseUrl'
import { log, ajax, getRegion } from '../../../pages/common/js/li-ajax'
import getDistance from '../../../pages/common/js/getdistance'

let region = []
Page({
  data: {
    imageUrl,
    imageUrl2,

    // 地址
    user_address_name: '',

    sex: 0,

    user_address_phone: '',

    address: '',

    shop_id: '',

    shop_name: '',


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

    selectShop: false,

    selectAddress: false,

    addressList: region,
    provinceList: [],
    cityList: [],
    countryList: [],
    defaultAddress: [0, 0, 0],


    shopList: []

  },
  async onLoad(e) {
    let { order_sn } = e
    region = await getRegion()
    this.getAddressList()
    await this.getOrderInfo({ order_sn })
  },

  /**
   * @function 获取公众号支付前订单详情
   */
  async getOrderInfo(order_sn) {
    let { showSelectAddress } = this.data;
    let { code, data: { order_sn: _order_sn, limit_pay_second, ...rest } } = await ajax('/mini/vip/wap/order/order_info', order_sn)
    if (code === 100) {
      let a = setInterval(() => {
        --limit_pay_second
        if (limit_pay_second === 0) {
          limit_pay_second = 59
          clearInterval(a)
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
    let cur;
    if (e) { cur = e.detail.value } else { cur = this.data.defaultAddress }
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
        ((region[cur[0]].sub[cur[1]].sub[cur[2]] && region[cur[0]].sub[cur[1]].sub[cur[2]].name) || ' ')
    },
      () => this.getAddressList()
    )
  },

  showSelectAddress() {
    this.setData({ selectAddress: true })
  },

  hideSelectAddress() {
    this.changeAddress()
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
  },

  async doSelectShop() {
    let { address } = this.data;
    if (!address) {
      return my.alert({
        title: '请先选择领取城市'
      });
    }
    let [curProvince, curCity, curCountry] = this.data.defaultAddress;
    let parentid = region[curProvince].addrid + ',' +
      region[curProvince].sub[curCity].addrid + ',' +
      ((region[curProvince].sub[curCountry].sub[curCountry] && region[curProvince].sub[curCity].sub[curCountry].addrid) || 0)
    let res = await ajax('/mini/game/shop', { parentid })
    let lat = my.getStorageSync({ key: 'lat' }).data;
    let lng = my.getStorageSync({ key: 'lng' }).data;
    if (res.CODE == 'A100') {
      let shopList = res.DATA
        .map(({ shop_gd_latitude, shop_gd_longitude, ...rest }) => {
          let distance = getDistance(lng, lat, shop_gd_longitude, shop_gd_latitude).toFixed(0)
          return {
            _distance: distance,
            distance: distance > 1000 ? (distance / 1000).toFixed(1) + '千' : distance,
            ...rest
          }
        })
        .sort((a, b) => a._distance - b._distance)
      this.setData({
        selectShop: true,
        shopList
      })
    }
  },

  sureSelectShop(e) {
    let { shop_id, shop_name } = e.currentTarget.dataset;

    this.setData({
      shop_id,
      shop_name,
      selectShop: false
    })
  }
});
