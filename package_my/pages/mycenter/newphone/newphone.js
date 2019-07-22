import {sendCode} from '../../../../pages/common/js/login'
Page({
  data: {
    phone:'',
    _sid:'',
  },
  onLoad(e) {
    this.setData({
      _sid:e.sid
    })
  },
  inputValue(e){
    this.setData({
      phone:e.detail.value
    })
  },
  getCode(){
    var data = {
      _sid:this.data._sid,
      phone:this.data.phone
    }
    sendCode(data).then(res=>{
      if(res.code==0){
        my.navigateTo({
          url:'/package_my/pages/mycenter/bindphone/bindphone?phone='+this.data.phone+'&type=2'
        });
      }else{
        my.showToast({
          type: 'none',
          content: res.msg,
          duration: 2000
        });
      }
    })
  },
});
