import {imageUrl,baseUrl} from '../../common/js/baseUrl'
import {sendCode,captcha,loginByAliUid,loginByAuth,getuserInfo} from '../../common/js/login'
var app = getApp(); //放在顶部
Page({
  data: {
    imageUrl,
    baseUrl,
    modalOpened: false,
    getCode:false,
    phone:'',
    img_code:'',
    imgUrl:''
  },
  openModal() {
    this.setData({
      modalOpened: true,
    });
  },
  onModalClick() {
    this.setData({
      modalOpened: false,
    });
  },
  onModalClose() {
    this.setData({
      modalOpened: false,
    });
  },
  inputValue(e){
    var phone = e.detail.value
    if(phone.length==11){
      this.setData({
        phone:phone,
        getCode:true
      })
    }else{
      this.setData({
        getCode:false
      })
    }
  },
  getcodeImg(e){
     var img_code = e.detail.value
     this.setData({
       img_code:img_code
     })
     console.log(img_code)
  },
  // 获取短信验证码
  async getcodeFn(){
    if(this.data.getCode){
      var time = my.getStorageSync({
        key: 'time', // 缓存数据的key
      }).data;
      if(time){
        if(time != new Date().toLocaleDateString()){
          my.removeStorageSync({
            key: 'time',
          });
          my.removeStorageSync({
            key: 'count',
          });
        }
      }
      
      var count = my.getStorageSync({
        key: 'count', // 缓存数据的key
      }).data||0;
      if(count==0){
        my.setStorageSync({
          key: 'time', // 缓存数据的key
          data: new Date().toLocaleDateString(), // 要缓存的数据
        });
      }
      if(count>5&&!this.data.modalOpened&&count<=10){
        this.setData({
          modalOpened:true,
          imgUrl:this.data.baseUrl+'/juewei-api/user/captcha?_sid=9789-4ui62bhsvvg4jautqijjk114h6&s='+(new Date()).getTime()
        })
        return
      }
      var data = {
        phone:this.data.phone,
        img_code:this.data.img_code
      }
      let code = await sendCode(data)

      my.setStorageSync({
        key: 'count', // 缓存数据的key
        data: count+1, // 要缓存的数据
      });
      if(code.code==0&&code.msg=='OK'){
        this.setData({
          modalOpened:false,
          img_code:''
        })
        my.navigateTo({
          url:'/pages/login/verifycode/verifycode?phone='+data.phone
        });
      }else{
        my.showToast({
          type:'none',
          duration:2000,
          content:code.msg
        });
      }
    }
  },
  // 授权获取用户信息
  onGetAuthorize(res) {
    // 获取授权
    my.getAuthCode({
      scopes: ['auth_base'],
      success: (res) => {
       loginByAliUid(res.authCode).then((data) => {
        my.setStorageSync({
          key: 'ali_uid', // 缓存数据的key
          data: data.data.ali_uid, // 要缓存的数据
        });
       })
      },
    });
    my.getOpenUserInfo({
      success: (res) => {
        let ali_uid = my.getStorageSync({
          key: 'ali_uid', // 缓存数据的key
        }).data;
        let userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
        my.setStorageSync({
          key: 'aliUserifo', // 缓存数据的key
          data: userInfo, // 要缓存的数据
        });
        this.loginByAuth(userInfo.nickName, userInfo.avatar);
      },
      fail() {
        my.alert({ title: '获取用户信息失败' });
      }
    });
  },
  // 授权登录
  loginByAuth(nick_name, head_img) {
    const ali_uid = my.getStorageSync({ key: 'ali_uid' });
    loginByAuth(ali_uid.data, '18140588481', nick_name, head_img).then((res) => {
      console.log(res.data._sid,'_sid')
      my.setStorageSync({
        key: '_sid', // session_id
        data: res.data._sid,
      });
      this.getUserInfo(res.data._sid);
    })
  },
  // 用户信息
  getUserInfo(_sid) {
    getuserInfo(_sid).then((res) => {
      app.globalData.userInfo = res.data;
      console.log(res.data)
      my.switchTab({
        url:'/pages/home/goodslist/goodslist'
      })
      //this.getBannerList(res.data.city_id, res.data.region_id, 1, 1);
      //this.getBannerList(110100, 110105, 1, 1);    //banner列表
      //this.getActivityList(110100,110105,1,this.data.type,res.data.user_id)     //营销活动
    })
  },
  onLoad() {},
  toUrl(e){
    var url = e.currentTarget.dataset.url
    my.navigateTo({
      url:url
    });
  },
});
