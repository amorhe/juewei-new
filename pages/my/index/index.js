import {imageUrl} from '../../common/js/baseUrl'
import{getuserInfo} from '../../common/js/login'

let log = console.log

var app = getApp() 
Page({
  data: {
    imageUrl,
    avatarImg:'',
    _sid:'',
    userInfo:'',
    isLogin:false,
    gridelist: [
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/VBqNBOiGYkCjqocXjdUj.png',
        text: '会员卡',
        path: '/package_my/pages/membercard/membercard'
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/VBqNBOiGYkCjqocXjdUj.png',
        text: '劵码',
        path: '/package_my/pages/coupon/coupon'
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/VBqNBOiGYkCjqocXjdUj.png',
        text: '积分',
        path: '/package_vip/pages/exchangelist/exchangelist'
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/VBqNBOiGYkCjqocXjdUj.png',
        text: '附近门店',
        path: '/package_my/pages/nearshop/nearshop'
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/VBqNBOiGYkCjqocXjdUj.png',
        text: '个人中心',
        path: '/package_my/pages/mycenter/mycenter'
      }
    ]
  },
  onLoad() {

  },
  onShow(){
    this.setData({
      _sid:app.globalData._sid
    })
    this.getUserInfo()
  },
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

 async getUserInfo(){

  let _sid = await this.getSid()
  let res = await getuserInfo(_sid.data||'')
      console.log(res,'我的页面')
      if(res.code==30106){
        this.setData({
          loginId:res.code,
          userInfo:'',
        })
      }
      if(res.code==0){
        this.setData({
          loginId:res.code,
          userInfo:res.data
        })
      }
  },
  isloginFn(){
    if(!this.data.loginId==0){
      my.navigateTo({
        url:'/pages/login/auth/auth'
      });
    }else{
      my.navigateTo({
        url:'/package_my/pages/mycenter/mycenter'
      });
    }
  },
  toUrl(e){
    var url = e.currentTarget.dataset.url
    my.navigateTo({
      url:url
    });
  },
  onHide(){
  },
  makePhoneCall() {
    my.makePhoneCall({ number: '4009995917' });
  },
});
