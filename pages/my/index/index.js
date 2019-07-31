import { imageUrl } from '../../common/js/baseUrl'
import { getuserInfo } from '../../common/js/login'

let log = console.log

var app = getApp()
Page({
  data: {
    imageUrl,
    avatarImg: '',
    _sid: '',
    userInfo: '',
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
  // 取本地缓存_sid
  getSid(){
      return new Promise((resolve,reject)=>{
        my.getStorage({
          key: '_sid', // 缓存数据的key
          success: (res) => {
            resolve(res)
          },
          fail: err=>{
            reject(err)
          }
        });
      })
  },
  // 获取用户信息
 async getUserInfo(){
    let _sid = await this.getSid()
    let res = await getuserInfo(_sid.data || '')
    console.log(res, '我的页面')
    if (res.code == 30106) {
      this.setData({
        loginId: res.code,
        userInfo: '',
      })
    }
    if (res.code == 0) {
      this.setData({
        loginId: res.code,
        userInfo: res.data
      })
    }
  },
  // 判断是否去登录
  isloginFn(){
    if(this.data.userInfo.user_id){
      my.navigateTo({
        url:'/package_my/pages/mycenter/mycenter'
      });
    }else{
      my.navigateTo({
        url: '/pages/login/auth/auth'
      });
    }
  },
  toUrl(e) {
    var url = e.currentTarget.dataset.url
    my.navigateTo({
      url: url
    });
  },
  onHide() {
  },
  // 打客服电话
  makePhoneCall() {
    my.makePhoneCall({ number: '4009995917' });
  },
});
