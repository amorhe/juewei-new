import {imageUrl} from '../../../pages/common/js/baseUrl'
import {addressList} from '../../../pages/common/js/my'
var app = getApp()
Page({
  data: {
    imageUrl,
    order_sn:'',
    list:[]
  },
  onLoad(e) {
    const {order_sn} = e
    this.setData({
      order_sn
    })
  },
  onShow(){
    this.getaddressList()
  },
  back(){
    const {order_sn} = this.data;
    if(order_sn){
      my.navigateBack({
        delta:1
      });
    }
  },
  toUrl(e){
    var item = e.currentTarget.dataset.item
    my.navigateTo({
      url:"/package_my/pages/myaddress/addaddress/addaddress?Id="+item.user_address_id
    });
  },
  addressFn(){
     my.chooseLocation({
      success:(res)=>{
        console.log(res)
      }
    });
  },
  getaddressList(){
    var data = {
      _sid:app.globalData._sid,
      type:'normal'
    }
    addressList(data).then(res=>{
      console.log(res)
      if(res.code==0){
        this.setData({
          list:res.data
        })
      }
    })
  },
});
