import { imageUrl } from '../../../../pages/common/js/baseUrl'
import { log, region } from '../../../../pages/common/js/li-ajax'
Page({
  data: {
    imageUrl,

    // 地址
    name: '',

    sex: 0,

    phone: '',

    address: '',

    labelList: ['学校', '家', '公司'],

    curLabel: 0,

    selectAddress: false,

    addressList: region,
    provinceList: [],
    cityList: [],
    countryList: [],
    defaultAddress: [0, 0, 0]


  },
  async onLoad() {
    this.getAddressList()
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
      defaultAddress: cur
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
