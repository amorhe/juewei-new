import {imageUrl} from '../../../common/js/baseUrl'
import {useraddress} from '../../../common/js/home'
var app = getApp();
Page({
  data: {
    imageUrl,
    addressList:[
      // { id:1 , address: '紫檀大厦 606', name: '小春（先生）', phone: '18885458784' },
      // { id:2 ,address: '中南海', name: '习近平（先生）', phone: '18888888888', checked: true },
      // { id:3 ,address: '天安门', name: '董明珠（女士）', phone: '18213218134' }
    ],
    mask:false,
    modalShow:false,
    addressListNoUse:[],
    address_id:'',
    orderType:''
  },
  onLoad(e) {
    if(e.type) {
      this.setData({
        orderType:e.orderType
      })
    }
  },
  onShow(){
    this.getAddress();
  },
  radioChange(e) {
    console.log('你选择的地址：', e.detail.value);
    this.setData({
      address_id:e.detail.value
    })
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
    const location = (my.getStorageSync({key: 'lng'}).data,my.getStorageSync({key: 'lat'}).data);
    // 可以使用
    useraddress(my.getStorageSync({key: '_sid'}).data,"normal",location).then((res) => {
      console.log(res);
      this.setData({
        addressList:res.data
      })
    })
    // 不能使用
     useraddress(my.getStorageSync({key: '_sid'}).data,"normal").then((res) => {
      console.log(res.data)
      this.setData({
        addressListNoUse:res.data
      })
    })
  },
  chooseAddress(){
    if(this.data.address_id == ''){
      my.showToast({
        content:'请选择收货地址！',
        success: (res) => {
          
        },
      });
      return
    }
    my.setStorageSync({
      key: 'address_id', // 缓存数据的key
      data: this.data.address_id // 要缓存的数据
    });
    app.globalData.orderType = this.data.orderType;
    my.redirectTo({
      url: '/pages/home/orderform/orderform?orderType=' + this.data.orderType, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
      success: (res) => {
        
      },
    });

  }
});
