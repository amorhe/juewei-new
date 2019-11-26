import { membercard } from '../../../pages/common/js/my'
import { baseUrl, imageUrl, myGet } from '../../../pages/common/js/baseUrl'
import { getuserInfo } from '../../../pages/common/js/login'
Page({
  data: {
    imgSrc: '',
    imageUrl,
    phone: '',
    userInfo: {},
  },
  onLoad() {
    this.getQRcode();
    const phone = my.getStorageSync({ key: 'phone' }).data;
    this.setData({
      phone
    });
    // 获取用户信息
    getuserInfo(myGet('_sid') || '').then((res) => {
      if (res.code == 30106) {
        this.setData({
          loginId: res.code,
          userInfo: {},
        })
      }
      if (res.code == 0) {
        this.getAuthCode(res.data);
      }
    })

  },
  onHide() {

  },
  getAuthCode(userInfo) {
    my.getAuthCode({
      scopes: ['auth_user', 'auth_life_msg'],
      success: (res) => {
        my.getAuthUserInfo({
          success: (user) => {
            userInfo['head_img'] = user.avatar
            userInfo['nick_name'] = user.nickName
            this.setData({
              userInfo
            })
          }
        });
      },
      fail: (e) => {
       
      }
    });
  },
  getQRcode() {
    const _sid = my.getStorageSync({ key: '_sid' }).data;
    this.setData({
      imgSrc: baseUrl + '/juewei-api/alimini/getQRcode?_sid=' + _sid
    })
  },
  goPay() {
    my.ap.navigateToAlipayPage({
      appCode: 'payCode',
      success: (res) => {
        // my.alert(JSON.stringify(res));
      },
      fail: (res) => {
        // my.alert(JSON.stringify(res));        
      }
    })
  }
});
