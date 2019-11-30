

import { serviceUrl } from '../../../pages/common/js/baseUrl'
var app = getApp()
Page({
  data: {
    userid:'',
    phone:'',
    nickname:'',
    url:'',
  },
  onLoad() {
      let userid='',nickname='',phone='';

      userid = (my.getStorageSync({ key: 'user_id' }).data || '');
      nickname = (my.getStorageSync({ key: 'nick_name' }).data || '');
      phone = (my.getStorageSync({ key: 'phone' }).data || '');

      this.setData({
        userid: userid,
        nickname: nickname,
        phone: phone,
        url: serviceUrl +'/m/shop/onlineservice.html?uid='+encodeURIComponent(userid)+'&name='+ encodeURIComponent(nickname) +'&mobile='+encodeURIComponent(phone)+'&channel='+encodeURIComponent('支付宝小程序')
      });
  },
  onShow(){
  },
  onmessage(e){
    // my.alert({
    //   content: '拿到数据'+JSON.stringify(e), // alert 框的标题
    // });
  }
});
