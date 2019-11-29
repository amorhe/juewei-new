import { imageUrl, ak, geotable_id } from '../../../../pages/common/js/baseUrl'
import { getRegion } from '../../../../pages/common/js/li-ajax'
import { addressCreate, addressinfo, updateaddress, deleteaddress } from '../../../../pages/common/js/address'
import { bd_encrypt } from '../../../../pages/common/js/map'
let region = []
var app = getApp()
Page({
  data: {
    imageUrl,
    modalShow: false, // 弹窗
    // 地址
    name: '',
    sex: 1,
    phone: '',
    address: '',
    labelList: [
      {
        name: '家',
        type: 1
      },
      {
        name: '公司',
        type: 2
      },
      {
        name: '学校',
        type: 3
      }
    ],
    curLabel: 0,
    selectAddress: false,
    addressList: region,
    provinceList: [],
    cityList: [],
    countryList: [],
    defaultAddress: [0, 0, 0],
    shop_id: '',
    addressId: '',
    order: 0,
    _sid: '',
    addressdetail: '',
    modalidShow: false, // 无门店,
    detailAdd: '',
    clickadd: false,
    city: ''
  },
  onShow() {
    if (app.globalData.addAddressInfo) {
      let addAddressInfo = app.globalData.addAddressInfo;
      //这里不能用全局变量，需要重新获取
      this.setData({
        province: addAddressInfo.province,
        city: addAddressInfo.city,
        district: addAddressInfo.area || addAddressInfo.district,
        longitude: addAddressInfo.location.lng,// 百度的坐标
        latitude: addAddressInfo.location.lat,// 百度的坐标
        map_address: addAddressInfo.name || addAddressInfo.address || addAddressInfo.addr,
        detailAdd: addAddressInfo.address || addAddressInfo.addr
      })
      my.request({
        url: 'https://api.map.baidu.com/geosearch/v3/nearby?ak=' + ak + '&geotable_id=' + geotable_id + '&location=' + addAddressInfo.location.lng + ',' + addAddressInfo.location.lat + '&radius=3000',
        success: (res) => {
          var arr = []
          res.data.contents.forEach(item => {
            arr.push(item.shop_id)
          })
          this.data.shop_id = arr.join(',')
          if (this.data.shop_id === '') {
            this.setData({
              modalidShow: true
            })
          }
        },
      });
    }else{
      this.getLocation()
    }
  },
  onhide() {
    // 退出清空addAddressInfo
    app.globalData.addAddressInfo = null;
  },
  async onLoad(e) {
    var _sid = my.getStorageSync({ key: '_sid' }).data;
    this.data._sid = _sid

    if (e.Id) {
      this.data.addressId = e.Id
      this.getInfo(e.Id)
    } else {// 新建地址
      this.data.addressId = ''
      this.getLocation()
    }
    if (e.order) {
      this.data.order = 1
    }
    region = await getRegion()
    this.getAddressList()
  },
  getLocation() {
    var that = this
    my.getLocation({
      type: 3,
      success(res) {
        var address = res.pois[0].name ? res.pois[0].name : res.pois[0].address
        // 获取到的是高德的经纬度，要转换为百度经纬度
        let map_position = bd_encrypt(res.longitude, res.latitude);
        my.request({
          url: 'https://api.map.baidu.com/geosearch/v3/nearby?ak=' + ak + '&geotable_id=' + geotable_id + '&location=' + res.longitude + ',' + res.latitude + '&radius=3000',
          success: (res) => {
            var arr = [];// 门店id数组
            res.data.contents.forEach(item => {
              arr.push(item.shop_id)
            })
            that.data.shop_id = arr.join(',');
            // 周边无可用门店时弹窗提示
            if (that.data.shop_id === '') {
              this.setData({
                modalidShow: true
              })
            }
          },
        });
        // 写入地址信息并渲染，map_address显示地址名称
        that.setData({
          province: res.province,
          city: res.city,
          district: res.district,
          longitude: map_position.bd_lng,
          latitude: map_position.bd_lat,
          map_address: address,
          detailAdd: res.province + res.city + res.district + res.streetNumber.street + res.streetNumber.number
        })
      },
      fail() {
        that.setData({
          address: '定位失败'
        })
      },
    })
  },
  // 地址详情
  getInfo(id) {
    var data = {
      _sid: this.data._sid,
      address_id: id
    }
    addressinfo(data).then(res => {
      var lbsArr = res.data.user_address_lbs_baidu.split(',')
      var data = res.data
      this.setData({
        sex: data.user_address_sex,
        name: data.user_address_name, // 收货人姓名
        phone: data.user_address_phone, // 手机号
        map_address: data.user_address_map_addr, // 定位地址
        address: data.user_address_detail_address, // 收货地址
        detailAdd: data.user_address_detail_address,
        province: data.province,// 省
        city: data.city, // 市
        district: data.district, // 区
        longitude: lbsArr[0], // 经度
        latitude: lbsArr[1], // 纬度
        shop_id: '', // 门店
        addressdetail: data.user_address_address, // 地址详情
        curLabel: data.tag
      })
    })
  },
  // 选择地址
  chooseLocation() {
    var that = this
    my.navigateTo({
      url: '/package_my/pages/myaddress/selectaddress/selectaddress?address='
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
        ((region[cur[0]].sub[cur[1]].sub[cur[2]] && region[cur[0]].sub[cur[1]].sub[cur[2]].name) || ' ')
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
    let curLabel = e.currentTarget.dataset.type
    this.setData({ curLabel })
  },

  handelChange(e) {
    let { key } = e.currentTarget.dataset;
    let s = /^[a-zA-Z0-9_\u4e00-\u9fa5 ]{0,20}$/
    let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
    let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    let patrn = /[`…~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；……‘’，。￣、…＠＃％＾＆×＿＋｛｝｜＂＞＜]/im;

    let value = e.detail.value;
    if (!s.test(value)) {
      value = this.data[key]
    }else{
      //无操作
    }
    this.setData({ [key]: value })
  },
  closeFN(e) {
    let d = e.currentTarget.dataset.value;
    switch (d) {
      case d = 'name':
        this.setData({
          name: ''
        })
        break;
      case d = 'phone':
        this.setData({
          phone: ''
        })
        break;
      default:
        this.setData({
          addressdetail: ''
        })
        break;
    }
  },
  modalidShoFN() {
    this.setData({
      modalidShow: false
    })
  },
  Addaddress() {
    var that = this
    if (this.data.name === '') {
      my.showToast({
        type: 'none',
        content: '请输入联系人',
        duration: 1000
      });
      return
    }
    if (/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im.test(this.data.name)) {
      my.showToast({
        type: 'none',
        content: '联系人包含非法字符',
        duration: 1000
      });
      return
    }
    if (/^1\d{10}$/.test(this.data.phone)) {
    } else if (this.data.phone === '') {
      my.showToast({
        type: 'none',
        content: '请填写电话',
        duration: 1000
      });
      return
    } else {
      my.showToast({
        type: 'none',
        content: '请输入正确手机号',
        duration: 1000
      });
      return
    }
    if (this.data.addressdetail.replace(/\s+/g, "") == '') {
      my.showToast({
        type: 'none',
        content: '请输入门牌号',
        duration: 1000
      });
      return
    }
    if (this.data.clickadd) {
      return
    }
    this.setData({
      clickadd: true
    })
    if (this.data.addressId) {
      var data = {
        _sid: this.data._sid,
        address_id: this.data.addressId,
        sex: this.data.sex,
        name: this.data.name.trim(), // 收货人姓名
        phone: this.data.phone, // 手机号
        map_address: this.data.map_address, // 定位地址
        address: this.data.addressdetail, // 收货地址
        province: this.data.province,// 省
        city: this.data.city, // 市
        district: this.data.district, // 区
        longitude: this.data.longitude, // 经度
        latitude: this.data.latitude, // 纬度
        detail_address: this.data.detailAdd, // 地址详情
        check_edit: false,
        tag: this.data.curLabel, // 地址标签
      }
      updateaddress(data).then(res => {
        that.setData({
          clickadd: false
        })
        if (res.code == 0) {
          // 清空app.globalData.addAddressInfo防止错误使用
          app.globalData.addAddressInfo = null;
          my.navigateBack({
            url: '/package_my/pages/myaddress/myaddress'
          });
        } else {
          my.showToast({
            type: 'none',
            content: res.msg,
            duration: 1000
          });
        }
      })
    } else {
      // 添加
      var data = {
        _sid: this.data._sid,
        sex: this.data.sex,
        name: this.data.name, // 收货人姓名
        phone: this.data.phone, // 手机号
        map_address: this.data.map_address, // 定位地址
        detail_address: this.data.detailAdd, // 地址详情
        province: this.data.province,// 省
        city: this.data.city, // 市
        district: this.data.district, // 区
        longitude: this.data.longitude, // 经度
        latitude: this.data.latitude, // 纬度
        shop_id: this.data.shop_id, // 门店
        address: this.data.addressdetail, // 收货地址
        tag: this.data.curLabel, // 地址标签
      }
      addressCreate(data).then(res => {
        that.setData({
          clickadd: false
        })
        if (res.code == 0) {
          if (this.data.order == 1) {
            // 清空app.globalData.addAddressInfo防止错误使用
            app.globalData.addAddressInfo = null;
            my.navigateBack({
              url: '/pages/home/orderform/selectaddress/selectaddress'
            })
          } else {
            my.navigateBack({
              url: '/package_my/pages/myaddress/myaddress'
            });
          }
        } else {
          my.showToast({
            type: 'none',
            content: res.msg,
            duration: 1000
          });
        }
      })
    }
  },
  // 删除地址
  modalShowFN() {
    this.setData({
      modalShow: true
    })
  },
  modalhideFN() {
    this.setData({
      modalShow: false
    })
  },

  rmaddress() {
    var data = {
      _sid: this.data._sid,
      address_id: this.data.addressId
    }
    deleteaddress(data).then(res => {
      if (res.code == 0) {
        this.setData({
          modalShow: false
        })
        my.navigateBack({
          url: '/package_my/pages/myaddress/myaddress'
        });
      } else {
        my.showToast({
          type: 'none',
          content: res.msg,
          duration: 1000
        });
      }
    })
  },
});
