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
    // var loginId = my.getStorageSync({
    //   key: 'loginId', // 缓存数据的key
    // }).data;
    // this.setData({
    //   loginId:loginId
    // })
    // console.log(loginId)
  },
  onShow(){
    this.getUserInfo()
  },
  getSid(){
      return new Promise((resolve,reject)=>{
        my.getStorage({
          key: '_sid', // 缓存数据的key
          success: (res) => {
            resolve(res)
            log(res)
          },
          fail: err=>{
            log(err)
            reject(err)
          }
        });
      })
  },

 async getUserInfo(){

    // let _sid = my.getStorageSync({
    //   key: '_sid', // 缓存数据的key
    // }).data;

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
    if(this.data.loginId==30106){
      my.navigateTo({
        url:'/pages/login/auth/auth'
      });
    }
  },
  toUrl(e){
    var url = e.currentTarget.dataset.url
    my.navigateTo({
      url:url
    });
  },
});
