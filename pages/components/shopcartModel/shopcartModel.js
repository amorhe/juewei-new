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
    send_price:"",   //起送费
    dispatch_price: '', // 配送费
    isType:'',
    content:'',
    otherGoods:[],
    confirmButtonText:'',
    cancelButtonText: '',
    type:'',
    btnClick:true

  },
  props: {
   onClear: (data) => console.log(data),
   onChangeShopcart: (data) => console.log(data)
  },
  onInit(){
  },
  didMount() {
    // 获取起送费
    this.getSendPrice();
  },
  deriveDataFromProps(nextProps){
    // console.log(nextProps)
    // 判断是不是起送
    if(app.globalData.type==1){
      this.setData({
        type:1
      })
    }
    // 判断是不是起购
    if(app.globalData.type==2){
      this.setData({
        type:2
      })
    }
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
        content:'是否清空购物车',
        confirmButtonText:'确认',
        cancelButtonText: '取消'
      }) 
    },
    onCounterPlusOne(data) {
      console.log(data)
      this.setData({
        mask: data.mask,
        modalShow: data.modalShow
      })
      if(data.isType =='clearShopcart' && data.type == 1){
        // 清空购物车
        app.globalData.goodsBuy = [];
        my.removeStorageSync({key:'goodsList'});
        this.props.onClear();
        this.props.onChangeShopcart({},[],0,0,0);
      }
      if(data.isType == 'checkshopcart' && data.type == 0 && this.props.shopcartNum >0){
        app.globalData.goodsBuy = this.props.shopcartAll;
        my.navigateTo({
          url:'/pages/home/orderform/orderform'
        }) 
      }
    },
    changeshopcart(goodlist,shopcartAll,priceAll,shopcartNum,priceFree){
      this.props.onChangeShopcart(goodlist,shopcartAll,priceAll,shopcartNum,priceFree);
    },
    addshopcart(e){
      let goodlist = my.getStorageSync({
        key: 'goodsList', // 缓存数据的key
      }).data || {};
      let goods_code = e.currentTarget.dataset.goods_code;
      let goods_format = e.currentTarget.dataset.goods_format
      goodlist[`${goods_code}_${goods_format}`].num +=1;
      let shopcartAll = [],priceAll=0,shopcartNum=0,priceFree=0;
      for(let keys in goodlist){
        if(e.currentTarget.dataset.goods_discount && goodlist[keys].num>goodlist[keys].goods_discount_user_limit){
          my.showToast({
            content:`折扣商品限购${goodlist[keys].goods_discount_user_limit}份，超过${goodlist[keys].goods_discount_user_limit}份恢复原价`
          });
          priceAll += goodlist[keys].goods_price * goodlist[keys].goods_discount_user_limit + (goodlist[keys].num-goodlist[keys].goods_discount_user_limit)* goodlist[keys].goods_original_price;
        }else{
          priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        }
        if(!goodlist[keys].goods_discount){
          priceFree += goodlist[keys].goods_price * goodlist[keys].num;
        }
        shopcartAll.push(goodlist[keys]);
        shopcartNum += goodlist[keys].num
      }
      let arr = shopcartAll.filter(item => item.goods_code == goods_code)
      for(let item of arr){
        goodlist[`${item.goods_code}_${item.goods_format}`].sumnum +=1;
      }
      this.changeshopcart(goodlist,shopcartAll,priceAll,shopcartNum,priceFree)
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
      let shopcartAll = [],priceAll=0,shopcartNum=0,priceFree=0;
      for(let keys in goodlist){
        if(goodlist[keys].goods_discount_user_limit && goodlist[keys].num>goodlist[keys].goods_discount_user_limit){
          priceAll += goodlist[keys].goods_price * goodlist[keys].goods_discount_user_limit + (goodlist[keys].num-goodlist[keys].goods_discount_user_limit)* goodlist[keys].goods_original_price;
        }else{
          priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        }
        if(!goodlist[keys].goods_discount){
          priceFree += goodlist[keys].goods_price * goodlist[keys].num;
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
      this.changeshopcart(goodlist,shopcartAll,priceAll,shopcartNum,priceFree);
      my.setStorageSync({
        key: 'goodsList', // 缓存数据的key
        data: goodlist, // 要缓存的数据
      });
    },
    // 立即购买
    goOrderSubmit(){
      // js节流防短时间重复点击
      if(this.data.btnClick == false){ 
        return
      }
      this.setData({
        btnClick:false
      })
      setTimeout(()=>{
        this.setData({
          btnClick:true
        })
      },1000)
      
      // 未登录
      if(my.getStorageSync({key: 'user_id'}).data==null){
        my.navigateTo({
          url:'/pages/login/auth/auth'
        })
        return
      }
      // 未选择商品
      if(this.props.shopcartGoods) {
        my.showToast({
          content:"请至少选择一件商品"
        });
        return 
      }
      // 判断购物车商品是否在当前门店里
      let goodsList = my.getStorageSync({
        key: 'goodsList', // 缓存数据的key
      }).data;
      let num = 0,shopcartAll=[],priceAll=0,shopcartNum=0,priceFree=0;
      if(goodsList == null) return;
      console.log(app.globalData.goodsArr)
      for(let val in goodsList){
        let iscart=false;
        for(let value of app.globalData.goodsArr){
            for(let fn of value.goods_format){
              if(val==`${value.goods_channel}${value.goods_type}${value.company_goods_id}_${fn.type}`){
                 iscart=true;
                 break;
              }
            }
        }
        // you商品下架
        if(iscart==false){
          console.log(val)
          num += goodsList[val].num;
          delete(goodsList[val]);
          this.setData({
            showShopcar: false,
            mask1:false,
            mask:true,
            modalShow: true,
            isType:'checkshopcart',
            content:`购物车有${num}件商品不在当前门店售卖商品之内`,
            confirmButtonText:'重新选择',
            cancelButtonText: '继续结算',
            btnClick:true
          })
          return
        }else{
          //有商品
          if(goodsList[val].goods_discount_user_limit && goodsList[val].num>goodsList[val].goods_discount_user_limit){
            priceAll += goodsList[val].goods_price * goodsList[val].goods_discount_user_limit + (goodsList[val].num-goodsList[val].goods_discount_user_limit)* goodsList[val].goods_original_price;
          }else{
            priceAll += goodsList[val].goods_price * goodsList[val].num;
          }
          if(!goodlist[keys].goods_discount){
            priceFree += goodlist[keys].goods_price * goodlist[keys].num;
          }
          shopcartAll.push(goodsList[val]);
          shopcartNum += goodsList[val].num
          this.changeshopcart(goodsList,shopcartAll,priceAll,shopcartNum,priceFree);
          console.log('购物车全部商品都在该门店内')
        }
      }
      my.setStorageSync({
        key:'goodsList',
        data: goodsList
      })
      app.globalData.goodsBuy = this.props.shopcartAll;
      my.navigateTo({
        url:'/pages/home/orderform/orderform'
      }) 
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
