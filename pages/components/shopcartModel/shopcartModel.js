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
    dispatch_price: '', // 配送费
    isType:'',
    content:'',
    otherGoods:[],
    activityText:''
  },
  props: {
   onClear: (data) => console.log(data),
   onChangeShopcart: (data) => console.log(data)
  },
  onInit(){
    this.setData({
      activityText:app.globalData.activityText
    })
  },
  didMount() {
    // 获取起送费
    this.getSendPrice();
  },
  deriveDataFromProps(nextProps){
    console.log(nextProps)
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
    // 隐藏购物车
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
        app.globalData.goodsBuy = [];
        my.removeStorageSync({key:'goodsList'});
        this.props.onClear();
        this.props.onChangeShopcart({},[],0,0);
      }
    },
    onChangeShopcart(goodlist,shopcartAll,priceAll,shopcartNum){
      this.props.onChangeShopcart(goodlist,shopcartAll,priceAll,shopcartNum);
    },
    addshopcart(e){
      let goodlist = my.getStorageSync({
        key: 'goodsList', // 缓存数据的key
      }).data || {};
      let goods_code = e.currentTarget.dataset.goods_code;
      let goods_format = e.currentTarget.dataset.goods_format
      goodlist[`${goods_code}_${goods_format}`].num +=1;
      let shopcartAll = [],priceAll=0,shopcartNum=0;
      for(let keys in goodlist){
        if(goodlist[keys].goods_discount_user_limit && goodlist[keys].num>goodlist[keys].goods_discount_user_limit){
          my.showToast({
            content:`折扣商品限购${goodlist[keys].goods_discount_user_limit}份，超过${goodlist[keys].goods_discount_user_limit}份恢复原价`
          });
          priceAll += goodlist[keys].goods_price * goodlist[keys].goods_discount_user_limit + (goodlist[keys].num-goodlist[keys].goods_discount_user_limit)* goodlist[keys].goods_original_price;
        }else{
          priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        }
        shopcartAll.push(goodlist[keys]);
        shopcartNum += goodlist[keys].num
      }
      let arr = shopcartAll.filter(item => item.goods_code == goods_code)
      for(let item of arr){
        goodlist[`${item.goods_code}_${item.goods_format}`].sumnum +=1;
      }
      this.onChangeShopcart(goodlist,shopcartAll,priceAll,shopcartNum)
      console.log(goodlist)
      my.setStorageSync({
        key: 'goodsList', // 缓存数据的key
        data: goodlist // 要缓存的数据
      });
    },
    reduceshopcart(e){
      let code = e.currentTarget.dataset.goods_code;
      let format = e.currentTarget.dataset.goods_format
      let goodlist = my.getStorageSync({key:'goodsList'}).data;
      
      goodlist[`${code}_${format}`].num -=1;
      // 删除
      let shopcartAll = [],priceAll=0,shopcartNum=0;
      for(let keys in goodlist){
        if(goodlist[keys].goods_discount_user_limit && goodlist[keys].num>goodlist[keys].goods_discount_user_limit){
          priceAll += goodlist[keys].goods_price * goodlist[keys].goods_discount_user_limit + (goodlist[keys].num-goodlist[keys].goods_discount_user_limit)* goodlist[keys].goods_original_price;
        }else{
          priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        }
        shopcartAll.push(goodlist[keys]);
        shopcartNum += goodlist[keys].num
      }
      let arr = this.props.shopcartAll.filter(item => item.goods_code == code)
      for(let item of arr){
        goodlist[`${item.goods_code}_${item.goods_format}`].sumnum -=1;
      }
      if(goodlist[`${code}_${format}`].num==0){
        shopcartAll = this.props.shopcartAll.filter(item => `${item.goods_code}_${item.goods_format}` != `${code}_${format}`)
        delete(goodlist[`${code}_${format}`]);
      }else{
        shopcartAll = [];
        for(let keys in goodlist){
          shopcartAll.push(goodlist[keys])
        }
      }
      this.onChangeShopcart(goodlist,shopcartAll,priceAll,shopcartNum);
      my.setStorageSync({
        key: 'goodsList', // 缓存数据的key
        data: goodlist, // 要缓存的数据
      });
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
      app.globalData.goodsBuy = this.props.shopcartAll;
      app.globalData.dispatch_price = this.data.dispatch_price;
      app.globalData.priceAll = this.props.priceAll;
     
      my.navigateTo({
        url:'/pages/home/orderform/orderform'
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
  }
});
