import {exchangeCoupon} from '../../../../pages/common/js/home';
import {imageUrl} from '../../../../pages/common/js/baseUrl'
Page({
  data: {
    code:'',
    imageUrl
  },
  onLoad() {},
  writeCode(e){
    this.setData({
      code: e.detail.value
    })
  },
  exchangeBtn(){
    const _sid = my.getStorageSync({key: '_sid'}).data;
    const {code} = this.data
    if(!code){
      return my.showToast({
        content:'请输入兑换码'
      });
    }
    exchangeCoupon(_sid, code).then((res) => {
      if(res.CODE == 'A100') {
        my.showToast({
          content:'兑换成功'
        });
      }else{
        my.showToast({
          content:res.MESSAGE
        });
      }
    })
  }
});
