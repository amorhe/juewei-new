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
  },
  onLoad() {
  },
  onShow() {
    this.setData({
      _sid: app.globalData._sid
    })
    this.getUserInfo()
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
              userInfo: userInfo
            })
          }
        });
      },
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
  async getUserInfo() {
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
      this.getAuthCode();
      if (Object.keys(this.data.userInfo).length>0) {
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
  },
  // 打客服电话
  makePhoneCall() {
    my.makePhoneCall({ number: '4009995917' });
  },
  // 模版消息
  onSubmit(e) {
    upformId(e.detail.formId);
  }
});
