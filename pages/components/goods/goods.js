import {imageUrl,imageUrl2,ak} from '../../common/js/baseUrl'
import {couponsExpire,MyNearbyShop,GetShopGoods} from '../../common/js/home'
import {datedifference,sortNum} from '../../common/js/time'
var app = getApp();
Component({
  mixins: [],
  data: {
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
    isShow: false,  // 优惠券过期提醒是否显示
    companyGoodsList:[],   //公司所有商品
    activityAllObj:[],
    windowHeight:'',
    animation:null,
    goodsItem:{},   //选择规格一条商品
    shopcartList:{},
    priceAll:0,
    hide_good_box: true,
    shopcartAll:[],
    shopcartNum:0,
    activityText:'',
  },
  onInit() {
    let goodlist = my.getStorageSync({
      key: 'goodsList', // 缓存数据的key
    }).data; 
    let priceAll = 0,shopcartAll = [],shopcartNum=0;
    for(let keys in goodlist){
      if(goodlist[keys].goods_discount_user_limit!=null && goodlist[keys].num>goodlist[keys].goods_discount_user_limit){
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
    this.setData({
      shopcartList:goodlist,
      priceAll,
      shopcartAll,
      shopcartNum
    })

    this.busPos = {};
    this.busPos['x'] = 10;
    this.busPos['y'] = app.globalData.hh - 16;
    console.log('购物车坐标',this.busPos)
  },
  deriveDataFromProps(nextProps){
    // console.log(nextProps)
    this.shopcartPrompt(this.props.fullActivity,this.data.priceAll)
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
   
  },
  didUnmount() {},
  methods: {
    // 小红点动画
    startAnimation() {
      var index = 0,
      that = this,
      bezier_points = that.linePos['bezier_points'],
      len = bezier_points.length - 1;
      // console.log(bezier_points)
      this.setData({
        hide_good_box: false,
        bus_x: that.finger['x'],
        bus_y: that.finger['y']
      })
      this.timer = setInterval(function () {
        // console.log('q',index,bezier_points[index]['x'],bezier_points[index]['y'])
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
          couponsExpire:res.data,
          isShow:true
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
        goodsKey: e.currentTarget.dataset.key,
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
      // my.createSelectorQuery().selectAll('.goodsTypeEv').boundingClientRect().exec((ret)=>{
      //   let num = ret[0].findIndex(item => item.top>=104.5)
      //   this.setData({
      //     goodsType:num
      //   })
      // })
    },
    // sku商品
    onCart(shopcartList,shopcartAll,priceAll,shopcartNum){
      this.setData({
        shopcartList,
        shopcartAll,
        priceAll,
        shopcartNum
      })
    },
    // 购物车
    onchangeShopcart(goodlist,shopcartAll,priceAll,shopcartNum){
      this.setData({
        shopcartList:goodlist,
        shopcartAll,
        priceAll,
        shopcartNum
      })
      // this.onCart(goodlist,shopcartAll,priceAll,shopcartNum)
    },
    addshopcart(e){
      console.log(e)
      let goods_car={};
      let goods_code = e.currentTarget.dataset.goods_code;
      let goods_format = e.currentTarget.dataset.goods_format;
      let goodlist = my.getStorageSync({key:'goodsList'}).data || {};
      if(goodlist[`${goods_code}_${goods_format}`]){
        goodlist[`${goods_code}_${goods_format}`].num+=1;
        goodlist[`${goods_code}_${goods_format}`].sumnum+=1;
      }else{
        let oneGood ={};
        if(e.currentTarget.dataset.key =="折扣"){
          oneGood = {
            "goods_name": e.currentTarget.dataset.goods_name,
            "taste_name": e.currentTarget.dataset.taste_name,
            "goods_price": e.currentTarget.dataset.goods_price * 100,
            "num": 1,
            "sumnum": 1,
            "goods_code": e.currentTarget.dataset.goods_code,
            "goods_activity_code": e.currentTarget.dataset.goods_activity_code,
            "goods_discount": e.currentTarget.dataset.goods_discount,
            "goods_original_price": e.currentTarget.dataset.goods_original_price,
            "goods_discount_user_limit": e.currentTarget.dataset.goods_discount_user_limit,
            "goods_format": goods_format,
            "goods_img": e.currentTarget.dataset.goods_img,
            "sap_code": e.currentTarget.dataset.sap_code
          }
        }else{
          oneGood = {
            "goods_name": e.currentTarget.dataset.goods_name,
            "taste_name": e.currentTarget.dataset.taste_name,
            "goods_price": e.currentTarget.dataset.goods_price * 100,
            "num": 1,
            "sumnum": 1,
            "goods_code": e.currentTarget.dataset.goods_code,
            "goods_format": goods_format,
            "goods_img": e.currentTarget.dataset.goods_img,
            "sap_code": e.currentTarget.dataset.sap_code
          }
        }
        goodlist[`${goods_code}_${goods_format}`]  = oneGood;
      }
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

      this.setData({
        shopcartList: goodlist,
        shopcartAll,
        priceAll,
        shopcartNum
      })
      console.log(goodlist)
      my.setStorageSync({
        key: 'goodsList', // 缓存数据的key
        data: goodlist, // 要缓存的数据
      });

// 购物车小球动画
      // 如果good_box正在运动

      // if (!this.data.hide_good_box) return;

      // this.finger = {};

      // var topPoint = {};

      // this.finger['x'] = e.detail.clientX;

      // this.finger['y'] = e.detail.clientY;

      // if (this.finger['y'] < this.busPos['y']) {

      // topPoint['y'] = this.finger['y'] - 150;

      // } else {

      // topPoint['y'] = this.busPos['y'] - 150;

      // }

      // topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;

      // if (this.finger['x'] > this.busPos['x']) {

      // topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];

      // } else {

      // topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];

      // }

      // this.linePos = app.bezier([this.finger, topPoint, this.busPos], 20);
      // this.startAnimation();
       
    },
    reduceshopcart(e){
      let code = e.currentTarget.dataset.goods_code;
      let format = e.currentTarget.dataset.goods_format
      let goodlist = my.getStorageSync({key:'goodsList'}).data;
      let shopcartAll = [],priceAll=0,shopcartNum=0;
      goodlist[`${code}_${format}`].num -=1;
      goodlist[`${code}_${format}`].sumnum -= 1;
      for(let keys in goodlist){
        if(goodlist[keys].goods_discount_user_limit && goodlist[keys].num>goodlist[keys].goods_discount_user_limit){
          priceAll += goodlist[keys].goods_price * goodlist[keys].goods_discount_user_limit + (goodlist[keys].num-goodlist[keys].goods_discount_user_limit)* goodlist[keys].goods_original_price;
        }else{
          priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        }
        shopcartAll.push(goodlist[keys]);
        shopcartNum += goodlist[keys].num
      }
      // 删除
      if(goodlist[`${code}_${format}`].num==0){
        shopcartAll = this.data.shopcartAll.filter(item => `${item.goods_code}_${format}` != `${code}_${format}`)
        delete(goodlist[`${code}_${format}`]);
      }

      this.setData({
        shopcartList:goodlist,
        shopcartAll,
        priceAll,
        shopcartNum
      })
      console.log(goodlist)
      my.setStorageSync({
        key: 'goodsList', // 缓存数据的key
        data: goodlist, // 要缓存的数据
      });
    },
    // 购物车活动提示
   shopcartPrompt(oldArr,priceAll){
      let activityText = '';
      for(let v of oldArr){
        if(oldArr.findIndex(v => v>priceAll) != -1){
          if(oldArr.findIndex(v => v>priceAll) == 0){
            activityText=`只差${(oldArr[0] - priceAll)/100}元,超值福利等着你!`
          }else if(oldArr.findIndex(v => v>priceAll) >0 && oldArr.findIndex(v => v>priceAll)< oldArr.length){
            activityText = `已购满${oldArr[oldArr.findIndex(v => v>priceAll)-1] / 100}元,去结算享受换购优惠;满${oldArr[oldArr.findIndex(v => v>priceAll)] /100}元更高福利等着你!`
          }else{
            activityText = `已购满${oldArr[oldArr.length-1]/100}元,去结算获取优惠!`
          }
        }else{
          activityText = `已购满${oldArr[oldArr.length-1]/100}元,去结算获取优惠!`
        }
      }
      // console.log(activityText)
      this.setData({
        activityText
      })
    },
    // 商品详情
    goodsdetailContent(e){
      my.navigateTo({
        url: '/pages/home/goodslist/goodsdetail/goodsdetail?goods_code=' + e.currentTarget.dataset.goods_code + '&goodsKey=' + e.currentTarget.dataset.key
      });
    },
    // 清空购物车
    onClear(){
      this.setData({
        shopcartList:{}
      })
    }
  },
});
