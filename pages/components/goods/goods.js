import {imageUrl,imageUrl2,ak} from '../../common/js/baseUrl'
import {couponsExpire,MyNearbyShop,GetShopGoods} from '../../common/js/home'
import {datedifference} from '../../common/js/time'
var app = getApp();
Component({
  mixins: [],
  data: {
    scroll_y:false, 
    imageUrl,
    imageUrl2,
    goodsType:0, //系列
    maskView:false,
    goodsModal:false,
    scrollT:0,
    couponsExpire:{
      full_money: 10,
      money: 7,
      days:1
    },          // 优惠券过期提醒     
    isShow: true,  // 优惠券过期提醒是否显示
    shopGoodsList:[],   // 门店商品列表
    companyGoodsList:[],   //公司所有商品
    activityAllObj:[],
    shopcartArr:[],     //购物车
    showAnmimation:false,
    windowHeight:'',
    animation:null,
    goodsItem:{},   //选择规格一条商品
    shopcartList:[],
    goodsKey:"",
    goodsLast:'',
    priceAll:'',
    hide_good_box: true
  },
  onInit() {
    let shopcartList = my.getStorageSync({
      key: 'shopcartList', // 缓存数据的key
    }).data; 
    let priceAll = 0;
    if(shopcartList){
      shopcartList.forEach(item => {
        priceAll += item.goods_price * item.goods_quantity
      })
    }
    this.data.shopcartList = shopcartList;
    this.data.priceAll = priceAll;

    this.busPos = {};
    this.busPos['x'] = 10;
    this.busPos['y'] = app.globalData.hh - 16;
    console.log('购物车坐标',this.busPos)
  },
  didMount() {
    const _sid = my.getStorageSync({key: '_sid'});
    this.getcouponsExpire(_sid.data);
    my.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight
        })
      }
    })

  },
  didUpdate() {
    this.setData({
      scroll_y:this.props.scrollY,
      type:this.props.type
    })
    if(!this.props.scrollY) {
      this.setData({
        goodsType:0
      })
    }
    // 初始化加入购物车的商品数量
    if(Object.keys(this.props.shopGoodsList).length>0){
      this.props.shopGoodsList.forEach(val => {
        val.last.forEach(v=> {
          v.count = 0;
          v.largeCount = 0;
          v.smallCount = 0;
        })
      })
      this.setData({
        shopGoodsList:this.props.shopGoodsList,
      })
    }
  },
  didUnmount() {},
  methods: {
    // 小红点动画
    startAnimation() {
      var index = 0,
      that = this,
      bezier_points = that.linePos['bezier_points'],
      len = bezier_points.length - 1;
      this.setData({
        hide_good_box: false,
        bus_x: that.finger['x'],
        bus_y: that.finger['y']
      })
      this.timer = setInterval(function () {
      index++;
      that.setData({
        bus_x: bezier_points[index]['x'],
        bus_y: bezier_points[index]['y']
      })
      if (index >= len) {
        clearInterval(that.timer);
        that.setData({
          hide_good_box: true,
        })
      }
      }, 15);
    },
     // 优惠券过期提醒
    getcouponsExpire(_sid){
      couponsExpire(_sid).then((res) => {
        res.data.days = datedifference(res.data.start_time,res.data.end_time)
        this.setData({
          couponsExpire:res.data
        })
        
      })
    },
    closeCouponView(){
      this.setData({
        isShow: false
      })
    },
    // 选择系列
    chooseGoodsType(e) {
      this.setData({
        goodsType: e.currentTarget.dataset.type
      })
    },
    // 选规格
    chooseSizeTap(e){
      // console.log(e)
      this.setData({
        maskView:true,
        goodsModal:true,
        goodsItem: e.currentTarget.dataset.item,
        goodsKey: e.currentTarget.dataset.type,
        goodsLast: e.currentTarget.dataset.index
      })
    },
    closeModal(data){
      this.setData({
        maskView:data.maskView,
        goodsModal:data.goodsModal
      })
    },
    scrollEvent(e){
      my.createSelectorQuery().selectAll('.goodsTypeEv').boundingClientRect().exec((ret)=>{
        // console.log(ret)
        // let arr = ret[0].filter((item,index) => {
        //   return item.top<=104.5
        // })
        // console.log(arr.length)
        // this.setData({
        //   goodsType:arr.length + 1
        // })
      })
    },
    addshopcart(e){
      let { shopGoodsList } = this.data;
      shopGoodsList[e.currentTarget.dataset.type].last[e.currentTarget.dataset.index].count ++;
      // this.data.shopGoodsList = shopGoodsList;
      console.log(shopGoodsList)
      this.setData({
        shopGoodsList
      })
      // let buyArr = shopGoodsList.map(item => item.last.filter(_item=> _item.count > 0));
      let arraylist = [],shopcartList=[];
      
      // 非折扣
      if(e.currentTarget.dataset.key != '折扣'){
        arraylist.push({
          'goods_code':e.currentTarget.dataset.goods_code,
          'goods_format':e.currentTarget.dataset.goods_format,
          'goods_quantity':e.currentTarget.dataset.goods_quantity,
          'goods_price':e.currentTarget.dataset.goods_price * 100,
        })
        shopcartList.push({
          'goods_code':e.currentTarget.dataset.goods_code,
          'goods_format':e.currentTarget.dataset.goods_format,
          'goods_quantity': e.currentTarget.dataset.goods_quantity,
          'goods_price':e.currentTarget.dataset.goods_price *100,
          'goods_img': e.currentTarget.dataset.goods_img,
          'goods_name': e.currentTarget.dataset.goods_name,
          'taste_name': e.currentTarget.dataset.taste_name
        })
      }else{
        //折扣
        arraylist.push({
          'goods_code':e.currentTarget.dataset.goods_code,
          'goods_format':e.currentTarget.dataset.goods_format,
          'goods_quantity':e.currentTarget.dataset.goods_quantity,
          'goods_price':e.currentTarget.dataset.goods_price * 100,
          'goods_type': 1
        })
        shopcartList.push({
          'goods_code':e.currentTarget.dataset.goods_code,
          'goods_format':e.currentTarget.dataset.goods_format,
          'goods_quantity':e.currentTarget.dataset.goods_quantity,
          'goods_price':e.currentTarget.dataset.goods_price * 100,
          'goods_type': 1,
          'goods_img': e.currentTarget.dataset.goods_img,
          'goods_name': e.currentTarget.dataset.goods_name,
          'taste_name': e.currentTarget.dataset.taste_name
        })
      }
      let buyNew = [],carArray=[];
      if(my.getStorageSync({key:'goodsList'}).data!=null && my.getStorageSync({key:'shopcartList'}).data!=null){
        let oldArr = my.getStorageSync({key:'goodsList'}).data;
        let oldAllArr = my.getStorageSync({key:'shopcartList'}).data;
        oldArr = oldArr.filter(_item => arraylist.findIndex(value => value.goods_code == _item.goods_code) == -1);
        oldAllArr = oldAllArr.filter(_item => shopcartList.findIndex(value => value.goods_code == _item.goods_code) == -1)
        buyNew = oldArr.concat(arraylist);
        carArray = oldAllArr.concat(shopcartList);
      }else{
        const oldArr = [],oldAllArr=[];
        buyNew = oldArr.concat(arraylist);
        carArray = oldAllArr.concat(shopcartList);
      } 
      app.globalData.shopcartList = carArray;
      let priceAll = 0;
      carArray.forEach(item => {
        priceAll += item.goods_price * item.goods_quantity
      })
      
      this.setData({
        shopcartList:carArray,
        priceAll
      })
      my.setStorageSync({
        key: 'goodsList', // 缓存数据的key
        data: buyNew, // 要缓存的数据
      });
       my.setStorageSync({
        key: 'shopcartList', // 缓存数据的key
        data: carArray, // 要缓存的数据
      });
      

      // 如果good_box正在运动

      if (!this.data.hide_good_box) return;

      this.finger = {};

      var topPoint = {};

      this.finger['x'] = e.detail.clientX;

      this.finger['y'] = e.detail.clientY;

      if (this.finger['y'] < this.busPos['y']) {

      topPoint['y'] = this.finger['y'] - 150;

      } else {

      topPoint['y'] = this.busPos['y'] - 150;

      }

      topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;

      if (this.finger['x'] > this.busPos['x']) {

      topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];

      } else {

      topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];

      }

      this.linePos = app.bezier([this.finger, topPoint, this.busPos], 20);

      this.startAnimation();
       
    },
    reduceshopcart(e){
      let{ shopGoodsList } = this.data
      shopGoodsList[e.currentTarget.dataset.type].last[e.currentTarget.dataset.index].count --;
      this.data.shopGoodsList = shopGoodsList;
      let buyArr = shopGoodsList.map(item => item.last.filter(_item=> _item.count > 0));
      let arraylist = [],shopcartList=[];
      let buyNew = [],carArray=[];
      if(my.getStorageSync({key:'goodsList'}).data!=null){
        let oldArr = my.getStorageSync({key:'goodsList'}).data;
        let oldAllArr = my.getStorageSync({key:'shopcartList'}).data;
        if(oldArr){
           oldArr = oldArr.filter(_item => arraylist.findIndex(value => value.goods_code == _item.goods_code) == -1);
        }
        if(oldAllArr){
          oldAllArr = oldAllArr.filter(_item => shopcartList.findIndex(value => value.goods_code == _item.goods_code) == -1)
        }
        buyNew = oldArr.concat(arraylist);
        carArray = oldAllArr.concat(shopcartList);
      }else{
        const oldArr = [],oldAllArr=[];
        buyNew = oldArr.concat(arraylist);
        carArray = oldAllArr.concat(shopcartList);
      }
      this.setData({
        shopGoodsList
      })
      app.globalData.shopcartList = carArray;
      console.log(buyNew)
      my.setStorageSync({
        key: 'goodsList', // 缓存数据的key
        data: buyNew, // 要缓存的数据
      });
       my.setStorageSync({
        key: 'shopcartList', // 缓存数据的key
        data: carArray, // 要缓存的数据
      });
    },
    // 商品详情
    goodsdetailContent(e){
      my.navigateTo({
        url: '/pages/home/goodslist/goodsdetail/goodsdetail?goodsAll=' + JSON.stringify(e.currentTarget.dataset.goodsAll) + '&goods_id=' + e.currentTarget.dataset.goods_id + '&key=' + e.currentTarget.dataset.key + '&index=' + e.currentTarget.dataset.index + '&shopGoodsList=' + JSON.stringify(this.data.shopGoodsList)
      });
    },
    // 清空购物车
    onClear(){
      this.setData({
        shopcartList:[]
      })
    },
    onGetShopList(data){

    }
  },
});
