import {exchangeCoupon} from '../../../../pages/common/js/home';
import {imageUrl} from '../../../../pages/common/js/baseUrl'
Page({
  data: {
    code:'',
    imageUrl,
		mask: false,
		modalShow: false,
    content:'',
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
    const that = this

    if(!code) {
      return that.setData({
        content: '请输入兑换码'
      }, () => setTimeout(() => {
        that.setData({
          content: ''
        });
      }, 2000));
    }
    exchangeCoupon(_sid, code).then((res) => {
      if(res.CODE == 'A100') {
				this.setData({
					mask: true,
					modalShow: true
				})
      }else{
        that.setData({
          content:res.MESSAGE
        },()=> setTimeout(()=>{
          that.setData({
            content:''
          });
        },2000));

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
