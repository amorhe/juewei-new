import { imageUrl } from '../../../pages/common/js/baseUrl'
import { addressList } from '../../../pages/common/js/my'
var app = getApp()
Page({
  data: {
    imageUrl,
    order_sn: '',
    list: []
  },
  onLoad(e) {
    const { order_sn } = e
    this.setData({
      order_sn
    })
  },
  onShow() {
    this.getaddressList()
  },
  back(e) {
    const { i } = e.currentTarget.dataset;
    const { order_sn, list } = this.data;
    const user_address_name = list[i].user_address_name
    const user_address_phone = list[i].user_address_phone
    const province = list[i].province
    const city = list[i].city
    const district = list[i].district
    console.log(district)
    const user_address_id = list[i].user_address_id
    const user_address_detail_address = list[i].user_address_detail_address
    const user_address_map_addr = list[i].user_address_map_addr
    console.log(list)
    if (order_sn) {

      my.redirectTo({
        url: '/package_vip/pages/waitpay/waitpay?'
          + 'order_sn=' + order_sn
          + '&user_address_name=' + user_address_name
          + '&user_address_phone=' + user_address_phone
          + '&province=' + province
          + '&city=' + city
          + '&district=' + district
          + '&user_address_id=' + user_address_id
          + '&user_address_detail_address=' + user_address_detail_address
          + '&user_address_map_addr=' + user_address_map_addr
      });
    }
  },
  toUrl(e) {
    var item = e.currentTarget.dataset.item
    my.navigateTo({
      url: "/package_my/pages/myaddress/addaddress/addaddress?Id=" + item.user_address_id
    });
  },
  addressFn() {
    my.navigateTo({
      url: "/package_my/pages/myaddress/addaddress/addaddress"
    });
  },
  getaddressList() {
    var that = this
    var _sid = my.getStorageSync({
      key: '_sid', // 缓存数据的key
    }).data;
    var data = {
      _sid: _sid,
      type: 'normal'
    }
    console.log(data,'data')
    addressList(data).then(res => {
      console.log(res,'地址列表返回')
      if (res.code == 0) {
        that.setData({
          list: res.data
        })
      }else{
        my.showToast({
          type: 'none',
          content: res.msg,
          duration: 2000,
        });
      }
    })
  },
});
