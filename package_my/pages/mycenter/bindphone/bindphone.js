import {sendCode} from '../../../../pages/common/js/login'
import {checkPhoneCode,resetPhone} from '../../../../pages/common/js/my'
let timeCount
Page({
  data: {
    focus: false,
    value:'',
    type:'1',
    phone:'',
    countTime:60,
    isnew:false
  },
  onLoad(e) {
    var _sid = my.getStorageSync({
      key: '_sid', // 缓存数据的key
    }).data;
    this.setData({
      phone:e.phone,
      type:e.type,
      _sid:_sid
    })
    this.timeDate()
    console.log(e)
  },
  // 倒计时60
  timeDate(e){
    var that = this
    clearInterval(timeCount)
    that.setData({
        isnew:true,
        countTime:60,
    })
    this.sendCodeFN()
    var time = 60
    timeCount = setInterval(function(){
      time--
      that.setData({
        countTime:time
      })
      if(time==0){
        that.setData({
          isnew:false
        })
        clearInterval(timeCount)
      }
    },1000)
  },
  sendCodeFN(){
    var data = {
      _sid:this.data._sid,
      phone:this.data.phone
    }
    sendCode(data).then(res=>{

    })
  },
  bindFocus() {
    // blur 事件和这个冲突
    console.log(this.data.focus)
    setTimeout(() => {
      this.onFocus();
    }, 100);
  },
  onFocus() {
    this.setData({
      focus: true,
    });
  },
  onBlur() {
    this.setData({
      focus: false,
    });
  },
  inputValue(e){
    var value = e.detail.value
    this.setData({
      value:value
    })
  },
  //页面跳转
  bindphone(e){
    //console.log(getCurrentPages())
    var that = this
    if(that.data.type==1){
      checkPhoneCode(this.data._sid,this.data.phone,this.data.value).then(res=>{
        if(res.code==0){
            my.navigateTo({
              url:"/package_my/pages/mycenter/newphone/newphone?sid="+that.data._sid
            });
        }else{
          my.showToast({
            type: 'none',
            content: res.msg,
            duration: 2000
          });
        }
      })
    }else{
      resetPhone(this.data._sid,this.data.phone,this.data.value).then(res=>{
        if(res.code==0){
          my.navigateBack({
            delta: 4
          })
        }else{
          my.showToast({
            type: 'none',
            content: res.msg,
            duration: 2000
          });
        }
      })
    }
  },
  onHide(){
    clearInterval(timeCount)
  },
  onUnload() {
    // 页面被关闭
    clearInterval(timeCount)
  },
});
