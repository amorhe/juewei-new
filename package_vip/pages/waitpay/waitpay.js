import { imageUrl, imageUrl2 } from '../../../pages/common/js/baseUrl'
import { log, ajax, getRegion } from '../../../pages/common/js/li-ajax'
import getDistance from '../../../pages/common/js/getdistance'

let region = []
Page({
  data: {
    a: 0,
    imageUrl,
    imageUrl2,

    // 地址
    user_address_name: '',

    sex: 0,

    user_address_phone: '',

    address: '',

    shop_id: '',

    shop_name: '',

    province: '',
    city: '',
    district: '',


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
    this.setData({
      order_sn
    })
    region = await getRegion()
    this.getAddressList()
    await this.getOrderInfo({ order_sn })
  },

  onUnload() {
    clearInterval(this.data.a)
    this.setData({ a: 0 })
  },

  /**
   * @function 获取公众号支付前订单详情
   */
  async getOrderInfo(order_sn) {
    let { showSelectAddress } = this.data;
    let { code, data: { order_sn: _order_sn, limit_pay_minute, limit_pay_second, ...rest } } = await ajax('/mini/vip/wap/order/order_info', order_sn)
    if (code === 100) {
      let a = setInterval(() => {
        --limit_pay_second
        if (limit_pay_minute === -1) {
          return clearInterval(a)
        }
        if (limit_pay_second === 0) {
          --limit_pay_minute
          limit_pay_second = 59
        }

        this.setData({
          a,
          d: { _order_sn, limit_pay_minute, limit_pay_second, ...rest }
        })
      }, 1000)
    }
  },

  /**
   * @function 获取当前省市区列表 
   */
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

  /**
   * @function 修改地址
   */
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

    let province = region[cur[0]].name;
    let city = region[cur[0]].sub[cur[1]].name;
    let district = (region[cur[0]].sub[cur[1]].sub[cur[2]] && region[cur[0]].sub[cur[1]].sub[cur[2]].name) || ''

    this.setData({
      defaultAddress: cur,
      address: province + ' ' + city + ' ' + district,
      province,
      city,
      district
    },
      () => this.getAddressList()
    )
  },

  /**
   * @function 展示地址选择列表
   */
  showSelectAddress() {
    this.setData({ selectAddress: true })
  },

  /**
   * @function 隐藏地址选择列表，并确认改变
   */
  hideSelectAddress() {
    this.changeAddress()
    this.setData({ selectAddress: false })
  },

  /**
   * @function input表单收集数据
   */
  handelChange(e) {
    let { key } = e.currentTarget.dataset;
    let { value } = e.detail;
    this.setData({ [key]: value })
  },

  /**
   * @function 获取当前的商店列表，排序并展示
   */
  async doSelectShop() {
    let { address } = this.data;
    if (!address) {
      return my.showToast({
        content: '请先选择领取城市'
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

  /**
   * @function 选择商店并返回
   */
  sureSelectShop(e) {
    let { shop_id, shop_name } = e.currentTarget.dataset;

    this.setData({
      shop_id,
      shop_name,
      selectShop: false
    })
  },


  /**
   * @function 确认订单
   */
  async confirmOrder() {
    let { d, order_sn, user_address_id, province, city, district, user_address_phone, shop_id, shop_name, user_address_name } = this.data;

    // 如果商品是实物并且发货方式到店领取

    if (d.receive_type == 1) {
      let params = {
        order_sn,
        user_address_name,
        user_address_phone,
        province, city, district,
        shop_id,
        shop_name,
      }
      let { code, msg } = await ajax('/mini/vip/wap/trade/confirm_order', params)
      if (code !== 100) {
        my.showToast({
          content: msg
        });
      }
      return code === 100
    }

  },

  /**
   * @function 支付订单
   */
  async pay() {
    let { order_sn } = this.data;
    return await ajax('/juewei-service/payment/AliMiniPay', { order_no: order_sn })
  },

  /**
   * @function 上支付 
   */
  async payNow() {
    let { d, order_sn, user_address_id, province, city, district, user_address_phone, shop_id, shop_name, user_address_name } = this.data;
    if (!order_sn ||
      !user_address_name ||
      !user_address_phone ||
      !province ||
      !city ||
      !district ||
      !shop_id ||
      !shop_name) {
      return
    }

    let confirm = await this.confirmOrder()
    if (!confirm) {
      return my.showToast({
        content: confirm.msg
      });
    }

    if (d.order_total_amount != 0) {
      let { code, data, msg } = await this.pay()
      if (code !== 100) {
        return my.redirectTo({
          url: '../finish/finish?id=' + d.id + '&fail=' + true
        });
      }
    }




  }

});
