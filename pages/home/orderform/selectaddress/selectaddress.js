import {imageUrl} from '../../../common/js/baseUrl'
import {useraddress} from '../../../common/js/home'
var app = getApp();
Page({
  data: {
    imageUrl,
    addressList:[],
    mask:false,
    modalShow:false,
    addressListNoUse:[],
    address_id:'',
  },
  onLoad(e) {
    // if(e.type) {
    //   this.setData({
    //     orderType:e.orderType
    //   })
    // }
  },
  onShow(){
    this.getAddress();
  },
  // 选择不在配送范围内的地址
  chooseNewAddress(){
    this.setData({
      mask: true,
      modalShow: true
    })
  },
  onCounterPlusOne(data) {
    this.setData({
      mask: data.mask,
      modalShow: data.modalShow
    })
  },
  getAddress(){
    useraddress(my.getStorageSync({key: 'shop_id'}).data).then((res) => {
      console.log(res);
      let addressList = [],addressListNoUse=[];
      for(let value of res.data){
        if(value.is_dis == 1){
          addressList.push(value)
        }else{
          addressListNoUse.push(value)
        }
      }
      this.setData({
        addressList,
        addressListNoUse
      })
    })
  },
  chooseAddress(e){
    my.setStorageSync({
      key: 'address_id', // 缓存数据的key
      data: e.currentTarget.dataset.id // 要缓存的数据
    });
    my.navigateBack({
      url: '/pages/home/orderform/orderform', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
      success: (res) => {
        
      },
    });
  },
  // 编辑收货地址　
  editAddress(e){
    my.navigateTo({
      url: "/package_my/pages/myaddress/addaddress/addaddress?Id=" + e.currentTarget.dataset.id
    });
  }
});
