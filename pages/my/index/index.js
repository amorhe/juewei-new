import { imageUrl } from '../../common/js/baseUrl'
import { getuserInfo } from '../../common/js/login'
import { upformId } from '../../common/js/time'

let log = console.log

var app = getApp()
Page({
  data: {
    imageUrl,
    avatarImg: '',
    _sid: '',
    userInfo: {},
    isLogin: false,
    showno: 1,//显示次数
  },
  onLoad() {

  },
  onShow() {
    this.setData({
      _sid: app.globalData._sid
    })
    this.getUserInfos();//在显示的时候调起
  },
  getAuthCode(userInfo) {
    if (this.data.showno !== 1) { return; }
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
        // if(e.error==11){ //用户取消了选择

        // }
        this.setData({
          showno: 2,
          userInfo
        })
      }
    });
  },
  // 取本地缓存_sid
  getSid() {
    return new Promise((resolve, reject) => {
      my.getStorage({
        key: '_sid', // 缓存数据的key
        success: (res) => {
          resolve(res)
        },
        fail: err => {
          reject(err)
        }
      });
    })
  },
  // 获取用户信息
  async getUserInfos() {
    var that = this
    let _sid = await this.getSid()
    let res = await getuserInfo(_sid.data || '')
    // console.log(res, '我的页面')
    if (res.code == 30106) {
      this.setData({
        loginId: res.code,
        userInfo: {},
      })
    }
    if (res.code == 0) {
      this.getAuthCode(res.data);
    }
  },
  // 判断是否去登录
  isloginFn() {
    if (this.data.userInfo.user_id) {
      // this.getAuthCode(this.data.userInfo);
      if (this.data.userInfo.hasOwnProperty('head_img')) {
        my.navigateTo({
          url: '/package_my/pages/mycenter/mycenter?img=' + this.data.userInfo.head_img + '&name=' + this.data.userInfo.nick_name
        });
      }
    } else {
      my.navigateTo({
        url: '/pages/login/auth/auth'
      });
    }
  },
  toUrl(e) {
    if (this.data.userInfo.user_id) {
      var url = e.currentTarget.dataset.url
      my.navigateTo({
        url: url
      });
    } else {
      my.navigateTo({
        url: '/pages/login/auth/auth',
      });
    }

  },
  onHide() {
    this.setData({
      showno: 1
    })
  },
  // 打客服电话
  // makePhoneCall() {
  //   // my.makePhoneCall({ number: '4009995917' });
  // },
  onlineservice(){
    if (this.data.userInfo.user_id) {
      my.navigateTo({
        url: '/package_my/pages/onlineservice/onlineservice',
      });
    } else {
      my.navigateTo({
        url: '/pages/login/auth/auth',
      });
    }
  },
  // 模版消息
  onSubmit(e) {
    upformId(e.detail.formId);
  }
});
