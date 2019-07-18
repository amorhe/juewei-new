import {imageUrl,baseUrl} from '../../common/js/baseUrl'
import {sendCode,captcha} from '../../common/js/login'
Page({
  data: {
    imageUrl,
    baseUrl,
    modalOpened: false,
    getCode:false,
    phone:'',
    img_code:'',
    imgShow:true,
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
      if(count>5&&!this.data.modalOpened){
        this.setData({
          modalOpened:true,
          imgUrl:this.data.baseUrl+'/juewei-api/user/captcha?_sid=9789-4ui62bhsvvg4jautqijjk114h6&s='+(new Date()).getTime()
        })
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
        
      }
    }
  },
  onLoad() {},
});
