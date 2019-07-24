import {exchangeCoupon} from '../../../../pages/common/js/home'
Page({
  data: {
    code:''
  },
  onLoad() {},
  writeCode(e){
    this.setData({
      code: e.detail.value
    })
  },
  exchangeBtn(){
    const _sid = my.getStorageSync({key: '_sid'}).data;
    exchangeCoupon(_sid, this.data.code).then((res) => {
      if(res.CODE == A100) {
        my.showToast({
          content:'兑换成功'
        });
      }else{
        my.showToast({
          content:'兑换码输入错误'
        });
      }
    })
  }
});
