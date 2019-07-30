import {imageUrl,baseUrl} from '../../common/js/baseUrl'
import {sendCode,captcha,loginByAliUid,loginByAuth,getuserInfo,decryptPhone} from '../../common/js/login'
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
        my.showToast({
          type:'none',
          duration:2000,
          content:'短信发送成功'
        });
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
    var that = this
   
    my.getPhoneNumber({
      success: (res) => {
        my.showLoading({
          content: '加载中...',
          delay: 1000,
        });
        let ali_uid = my.getStorageSync({
          key: 'ali_uid', // 缓存数据的key
        }).data;
        let userInfo = JSON.parse(res.response); // 以下方的报文格式解析两层 response
        var data = {
          response:userInfo.response
        }
        decryptPhone(data).then(res=>{
          if(res.code==0){
            that.loginByAuthFn(ali_uid,res.data.phone);
          }
        })
      },
      fail() {
        my.alert({ title: '获取用户信息失败' });
      }
    });
  },
  // 授权登录
  loginByAuthFn(ali_uid,phone) {
    console.log('授权函数')
    loginByAuth(ali_uid, phone,'','').then((res) => {
      if(res.code==0){
        my.setStorageSync({
          key: '_sid', // session_id
          data: res.data._sid,
        });
        app.globalData._sid=res.data._sid
        this.getUserInfo(res.data._sid);
      }else{
        my.showToast({
          type: 'none',
          content: res.msg,
          duration: 2000
        });
      }
     
    })
  },
  // 用户信息
  getUserInfo(_sid) {
    getuserInfo(_sid).then((res) => {
      app.globalData.userInfo = res.data;
      my.hideLoading();
      my.navigateBack({
          delta: 1
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
