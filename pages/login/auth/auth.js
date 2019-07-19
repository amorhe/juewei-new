import {imageUrl,baseUrl} from '../../common/js/baseUrl'
import {sendCode,captcha,loginByAliUid} from '../../common/js/login'
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
      console.log(res,'code')
       loginByAliUid(res.authCode).then((data) => {
         console.log(data)
        // my.setStorageSync({
        //   key: 'ali_uid', // 缓存数据的key
        //   data: data.data.ali_uid, // 要缓存的数据
        // });
       })
      },
    });
    console.log(res)
    my.getOpenUserInfo({
      success: (res) => {
        let userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response

      },
      fail() {
        my.alert({ title: '获取用户信息失败' });
      }
    });
  },
  onLoad() {},
  toUrl(e){
    var url = e.currentTarget.dataset.url
    my.navigateTo({
      url:url
    });
  },
});
