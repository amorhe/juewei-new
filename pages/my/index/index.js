import {imageUrl} from '../../common/js/baseUrl'
var app = getApp() 
Page({
  data: {
    imageUrl,
    avatarImg:'',
    _sid:'',
    userInfo:'',
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
    this.getUserInfo()
  },
  getUserInfo(){
    var that = this
    my.getAuthCode({
      scopes: ['auth_user'],
      success: (res) => {
        my.getAuthUserInfo({
          success: (userInfo) => {
            var _sid = my.getStorageSync({
              key: '_sid', // 缓存数据的key
            }).data;
            that.setData({
              _sid:_sid,
              userInfo:userInfo
            })
            console.log(that.data,'data')
          }
        });
      },
    });
  },
  toUrl(e){
    var url = e.currentTarget.dataset.url
    my.navigateTo({
      url:url
    });
  },
});
