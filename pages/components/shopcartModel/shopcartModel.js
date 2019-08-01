import {imageUrl} from '../../common/js/baseUrl'
import {compare} from '../../common/js/time'
var app = getApp();
Component({
  data: {
    showShopcar:false ,  //购物车
    mask:false, //遮罩
    imageUrl,
    modalShow: false, //弹框
    mask1: false,
    shopGoods:[],
    goodsInfo:'',
    send_price:"",   //起送费
    dispatch_price: '', // 邮费
    isType:'',
    content:'',
    otherGoods:[]
  },
  props: {
   onClear: (data) => console.log(data),
  },
  onInit(){
    
  },
  didMount() {
    // 获取起送费
    this.getSendPrice();
  },
  deriveDataFromProps(nextProps){
    nextProps.otherGoods.push(nextProps.priceAll * 100);
    nextProps.otherGoods = [...new Set(nextProps.otherGoods)]
    nextProps.otherGoods.sort(compare);
    // console.log(nextProps)
    this.setData({
      otherGoods:nextProps.otherGoods
    })
  },
  didUpdate() {
   
  },
  didUnmount() {},
  methods: {
    // 打开购物车
    openShopcart(){
      this.setData({
        showShopcar: true,
        mask1: true
      })
    },
    hiddenShopcart(){
      this.setData({
        showShopcar: false,
        mask1: false
      })
    },
    // 清空购物车
    clearShopcart(){
       this.setData({
        showShopcar: false,
        mask1:false,
        mask:true,
        modalShow: true,
        isType:'clearShopcart',
        content:'是否清空购物车'
      })
      
    },
    onCounterPlusOne(data) {
      this.setData({
        mask: data.mask,
        modalShow: data.modalShow
      })
      if(data.isType =='clearShopcart' && data.type == 1){
        // 清空购物车
        my.removeStorageSync({key:'goodsList'});
        my.removeStorageSync({key:'shopcartList'});
        this.props.onClear();
      }
    },
    // 立即购买
    goOrderSubmit(){
      if(my.getStorageSync({
        key: 'user_id', // 缓存数据的key
      }).data==null){
        my.navigateTo({
          url:'/pages/login/auth/auth'
        })
        return
      }
      if(this.props.shopcartGoods) {
        my.showToast({
          content:"请至少选择一件商品"
        });
        return 
      }
      let goods = JSON.stringify(my.getStorageSync({key: 'goodsList'}).data);
      let shop_id;
      if(this.data.orderType == 1){
        shop_id = my.getStorageSync({
          key: 'takeout', // 缓存数据的key
        }).data[0].shop_id;
      }else {
        shop_id = my.getStorageSync({
          key: 'self', // 缓存数据的key
        }).data[0].shop_id;
      }
      my.navigateTo({
        url:'/pages/home/orderform/orderform?orderType=' + this.props.orderType
      });       
    },
    // 获取起送价格
    getSendPrice(){
      const timestamp = new Date().getTime();
      my.request({
        url: `https://imgcdnjwd.juewei.com/static/check/api/shop/open-city.json?v=${timestamp}`,
        success: (res) => {
          this.setData({
            send_price:res.data.data[app.globalData.position.cityAdcode].shop_send_price,
            dispatch_price:res.data.data[app.globalData.position.cityAdcode].shop_dispatch_price
          })
        },
      });
    }
  },
});
