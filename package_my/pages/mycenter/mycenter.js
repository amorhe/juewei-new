import { imageUrl } from '../../../pages/common/js/baseUrl'
import { getRegion } from '../../../pages/common/js/li-ajax'
import { UpdateAliUserInfo, UpdateUserInfo } from '../../../pages/common/js/my'
import { getuserInfo, LoginOut } from '../../../pages/common/js/login'
var app = getApp()
let region = []
Page({
  data: {
    imageUrl,
    showTop: false,
    modalOpened: false,
    head_img: '', // 头像
    nick_name: '', // 名字
    userinfo: '', // 用户信息
    sex: 0,
    // 地址
    name: '',
    phone: '',
    address: '',
    labelList: ['学校', '家', '公司'],
    curLabel: 0,
    selectAddress: false,
    addressList: region,
    provinceList: [],
    cityList: [],
    countryList: [],
    province_i:0,
    city_i:0,
    region_i:0,
    defaultAddress: [0,0,0]
  },
  onLoad(e) {
    if (e.img && e.name) {
      this.getInfo(e.img, e.name)
    }
  },
  async onShow() {
    // 页面显示 每次显示都执行
    // my.alert({ title: 'onShow=='+app.globalData.authCode });
    region = await getRegion()
    this.getUserInfo()
  },
  // 用户信息
  getUserInfo() {
    var that = this
    var _sid = my.getStorageSync({
      key: '_sid'
    }).data

    getuserInfo(_sid).then((res) => {
      var province_i = 0, city_i = 0, region_i = 0;
      var province = region.filter((item, index) => {
        if (item.addrid == res.data.province_id) {
          province_i = index
        }
        return item.addrid == res.data.province_id
      })[0]
      if (province) {
        var city = province.sub.filter((item, index) => {
          if (item.addrid == res.data.city_id) {
            city_i = index
          }
          return item.addrid == res.data.city_id
        })[0]
      }
      if (city) {
        var regions = city.sub.filter((item, index) => {
          if (item.addrid == res.data.region_id) {
            region_i = index
          }
          return item.addrid == res.data.region_id
        })[0]
      }

      var phone = res.data.phone && res.data.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      res.data.provinceName = province && province.name || ''
      res.data.cityName = city && city.name || ''
      res.data.regionName = regions && regions.name || ''
      res.data.fake_phone = phone || ''

      that.setData({
        userinfo: res.data,
        province_i,
        city_i,
        region_i,
        defaultAddress:[province_i,city_i,region_i]
      }, () => {
        that.getAddressList()
      })
    })
  },
  // 选择性别
  genderFN(e) {
    var that = this
    var data = e.currentTarget.dataset
    var sex = data.sex == 1 ? 0 : 1
    UpdateUserInfo({ sex: data.sex }).then(res => {
      that.setData({
        'userinfo.sex': sex,
        showTop: false,
      })
    })
  },
  // 保存用户信息
  saveUserInfo(data) {
    var data = {
      sex: data.sex || '',
      birthday: data.birthday || '',
      province_id: data.province_id || '',
      city_id: data.city_id || '',
      region_id: data.region_id || ''
    }
    UpdateUserInfo(data).then((res) => {
      console.log(res, '用户保存')
    })
  },
  // 生日选择器
  Taptime() {
    var that = this
    my.datePicker({
      currentDate: '',
      startDate: '1950-1-1',
      endDate: '',
      success: (res) => {
        var birthday = res.date
        UpdateUserInfo({ birthday: birthday }).then(res => {
          that.setData({
            'userinfo.birthday': birthday
          })
        })
      },
    });
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

  showSelectAddress() {
    this.setData({ selectAddress: true })
  },
  hideSelectAddress() {
    var that = this;

    var province = that.data.provinceList[that.data.defaultAddress[0]]
    var curCity = that.data.cityList[that.data.defaultAddress[1]]
    var region = that.data.countryList[that.data.defaultAddress[2]]
    var data = {
      province_id: province.addrid,
      city_id: curCity.addrid,
      region_id: region.addrid
    }

    UpdateUserInfo(data).then(res => {
      that.setData({
        'userinfo.province_id': province.addrid,
        'userinfo.city_id': curCity.addrid,
        'userinfo.region_id': region.addrid,
        'userinfo.provinceName': province.name,
        'userinfo.cityName': curCity.name,
        'userinfo.regionName': region.name,
        selectAddress: false,
      }, () => that.changeAddress())
    })
  },

  // 地址
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
  // 姓别选择器显示/隐藏
  onTopBtnTap() {
    this.setData({
      showTop: true,
    });
  },
  onPopupClose() {
    this.setData({
      showTop: false,
    });
  },
  // 退出登录
  outLogin() {
    this.setData({
      modalOpened: true,
    });
  },
  onModalClick() { // 确认
    var _sid = my.getStorageSync({
      key: '_sid', // 缓存数据的key
    }).data;
    LoginOut(_sid).then(res => {
      console.log(res)
      if (res.code == 0) {
        my.removeStorageSync({
          key: '_sid',
        });
        my.removeStorageSync({
          key: 'user_id',
        });
        app.globalData._sid = ""
        my.switchTab({
          url: '/pages/my/index/index'
        })
      } else {
        my.showToast({
          type: 'none',
          content: res.msg,
          duration: 2000
        });
      }
    })
    this.setData({
      modalOpened: false,
    });
  },
  onModalClose() { // 取消
    this.setData({
      modalOpened: false,
    });
  },
  //页面跳转
  toUrl(e) {
    var url = e.currentTarget.dataset.url
    my.navigateTo({
      url: url
    });
  },
  getInfo(avatar, nickName) {
    var that = this
    var _sid = my.getStorageSync({
      key: '_sid', // 缓存数据的key
    }).data;
    that.setData({
      'userinfo.head_img': avatar,
      'userinfo.nick_name': nickName
    })
    var data = {
      _sid: _sid,
      head_img: avatar,
      nick_name: nickName
    }
    UpdateAliUserInfo(data).then(res => {

    })
  },
  onReady() {
    // 页面加载完成 只加载一次 页面初始化用
  },
  onHide() {
    // 页面隐藏
  }
});
