import {exchangeCoupon} from '../../../../pages/common/js/home';
import {imageUrl} from '../../../../pages/common/js/baseUrl'
Page({
  data: {
    code:'',
    imageUrl,
		mask: false,
		modalShow: false
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
				this.setData({
					mask: true,
					modalShow: true
				})
      }else{
        my.showToast({
          content:res.MESSAGE
        });
      }
    })
  },
	getCoupons(e) {
		this.setData({
			mask: false,
			modalShow: false
		})
		if(e.type == 1) {
			my.navigateTo({
				url: '/package_my/pages/coupon/coupon'
			});
		}else {
			my.navigateTo({
				url: '/pages/home/goodslist/goodslist'
			});
		}
	}
});
