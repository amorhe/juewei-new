import {imageUrl,imageUrl2} from '../../../common/js/baseUrl'
import {commentList,DispatchCommentList} from '../../../common/js/home'
var app = getApp();
Page({
  data: {
    activeTab:0,
    tabActive:0,
    tabs: [
      {
        title: '商品简介'
      },
      {
        title: '商品详情'
      }
    ],
    tabsT: [
       {
        title: '商品口味'
      },
      {
        title: '配送服务'
      }
    ],
    imageUrl,
    imageUrl2,
    // 评论
    commentArr:[],
    key:'',
    index:'',
    dispatchArr:[],
    maskView:false,
    goodsItem:{},
    shopcartList:{},
    shopcartAll:[],
    priceAll:0,
    goodsLast:'',
    shopcartNum:0,
    goodsKey:'',
    activityText:'',
    pagenum:1,
    pagesize:10,
    freeText:'',
    freeMoney:0,
    goodsInfo:{}
  },
  onLoad(e) {
    // console.log(e)
    let goods = my.getStorageSync({
      key: 'shopGoods'
    }).data;
    let goodlist = my.getStorageSync({key:'goodsList'}).data;
    let goodsInfo = {},priceAll = 0,shopcartAll = [],shopcartNum=0,priceFree=0;
    for(let value of goods){
      if(value.goods_code==e.goods_code){
        goodsInfo = value
      }
    }
    for(let keys in goodlist){
      if(goodlist[keys].goods_discount_user_limit!=null  && goodlist[keys].num>goodlist[keys].goods_discount_user_limit){
        priceAll += goodlist[keys].goods_price * goodlist[keys].goods_discount_user_limit + (goodlist[keys].num-goodlist[keys].goods_discount_user_limit)* goodlist[keys].goods_original_price;
      }else{
        priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        
      }
      if(!goodlist[keys].goods_discount){
        priceFree += goodlist[keys].goods_price * goodlist[keys].num;
      }
      shopcartAll.push(goodlist[keys]);
      shopcartNum += goodlist[keys].num;
    }
    this.setData({
      goodsInfo,
      shopcartList:goodlist,
      priceAll,
      shopcartAll,
      shopcartNum,
      goodsKey: e.goodsKey,
      freeMoney:e.freeMoney
    })
    const shop_id = my.getStorageSync({key:'shop_id'}).data;
    // console.log(priceFree)
    // 购物车活动提示
    // console.log(app.globalData)
    this.shopcartPrompt(app.globalData.fullActivity,priceAll,priceFree)
    // 评论
    this.getCommentList(goodsInfo.goods_code,this.data.pagenum,this.data.pagesize);
    this.getDispatchCommentList(shop_id,this.data.pagenum,this.data.pagesize)
  },
  closeModal(data){
    this.setData({
      maskView:data.maskView,
      goodsModal:data.goodsModal
    })
  },
  changeMenu(e){
    this.setData({
      activeTab:e.currentTarget.dataset.cur
    })
  },
  changeTab(e){
    this.setData({
      tabActive: e.currentTarget.dataset.cur,
      pagenum:1
    });
  },
  // sku商品
  onCart(shopcartList,shopcartAll,priceAll,shopcartNum,priceFree){
    this.setData({
      shopcartList,
      shopcartAll,
      priceAll,
      shopcartNum,
      priceFree
    })
    this.shopcartPrompt(app.globalData.fullActivity,priceAll,priceFree);
  },
  // 购物车
  onchangeShopcart(goodlist,shopcartAll,priceAll,shopcartNum,priceFree){
    this.onCart(goodlist,shopcartAll,priceAll,shopcartNum,priceFree)
  },
  addshopcart(e){
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
    let shopcartAll = [],priceAll=0,shopcartNum=0,priceFree=0;
    for(let keys in goodlist){
      if(e.currentTarget.dataset.goods_discount && goodlist[keys].num>goodlist[keys].goods_discount_user_limit){
        priceAll += goodlist[keys].goods_price * goodlist[keys].goods_discount_user_limit + (goodlist[keys].num-goodlist[keys].goods_discount_user_limit)* goodlist[keys].goods_original_price;
      }else{
        priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        // priceFree += goodlist[keys].goods_price * goodlist[keys].num;
      }
      if(!goodlist[keys].goods_discount){
        priceFree += goodlist[keys].goods_price * goodlist[keys].num;
      }
      shopcartAll.push(goodlist[keys]);
      shopcartNum += goodlist[keys].num;
    }
    // console.log(priceFree)
    // 购物车活动提示
    this.shopcartPrompt(app.globalData.fullActivity,priceAll,priceFree);
    this.onchangeShopcart(goodlist,shopcartAll,priceAll,shopcartNum,priceFree)
    this.setData({
      shopcartList: goodlist,
      shopcartAll,
      priceAll,
      shopcartNum
    })
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
    let format = e.currentTarget.dataset.goods_format;
    let goodlist = my.getStorageSync({key:'goodsList'}).data;
    let shopcartAll = [],priceAll=0,shopcartNum=0,priceFree=0;
    goodlist[`${code}_${format}`].num -=1;
    goodlist[`${code}_${format}`].sumnum -= 1;
    for(let keys in goodlist){
      if(goodlist[keys].goods_discount_user_limit && goodlist[keys].num>goodlist[keys].goods_discount_user_limit){
        priceAll += goodlist[keys].goods_price * goodlist[keys].goods_discount_user_limit + (goodlist[keys].num-goodlist[keys].goods_discount_user_limit)* goodlist[keys].goods_original_price;
      }else{
        priceAll += goodlist[keys].goods_price * goodlist[keys].num;
        // priceFree += goodlist[keys].goods_price * goodlist[keys].num
      }
      if(!goodlist[keys].goods_discount){
        priceFree += goodlist[keys].goods_price * goodlist[keys].num;
      }
      shopcartAll.push(goodlist[keys]);
      shopcartNum += goodlist[keys].num;
    }
    // 删除
    if(goodlist[`${code}_${format}`].num==0){
      shopcartAll = this.data.shopcartAll.filter(item => `${item.goods_code}_${format}` != `${code}_${format}`)
      delete(goodlist[`${code}_${format}`]);
    }
    // 购物车活动提示
    this.shopcartPrompt(app.globalData.fullActivity,priceAll,priceFree);
    this.onchangeShopcart(goodlist,shopcartAll,priceAll,shopcartNum,priceFree)
    this.setData({
      shopcartList:goodlist,
      shopcartAll,
      priceAll,
      shopcartNum
    })
    my.setStorageSync({
      key: 'goodsList', // 缓存数据的key
      data: goodlist, // 要缓存的数据
    });
  }, 
  // 购物车活动提示
  shopcartPrompt(oldArr,priceAll,priceFree){
    let activityText = '',freeText='';
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
    if(priceFree == 0){
        freeText = `满${this.data.freeMoney/100}元 免配送费`
      }else if(priceFree<this.data.freeMoney){
        freeText = `还差${this.data.freeMoney/100-priceFree/100}元 免配送费`
      }else{
        freeText = `已满${this.data.freeMoney/100}元 免配送费`
      }
    // console.log(activityText)
    this.setData({
      activityText,
      freeText
    })
  },
  // 清空购物车
  onClear(){
    this.setData({
      shopcartList:{}
    })
  },
  // 商品评价
  getCommentList(goods_code,pagenum,pagesize){
    commentList(goods_code,pagenum,pagesize,1).then((res) => {
      // console.log(res)
      this.setData({
        commentArr:res
      })
    })
  },
  // 配送评价
  getDispatchCommentList(shop_id,pagenum,pagesize){
    DispatchCommentList(shop_id,pagenum,pagesize,1).then((res) => {
      // console.log(res);
      this.setData({
        dispatchArr:res
      })
    })
  },
  closeModal(data){
    this.setData({
      maskView:data.maskView,
      goodsModal:data.goodsModal
    })
  },
  // 选规格
  chooseSizeTap(e){
    this.setData({
      maskView:true,
      goodsModal:true,
      goodsItem: e.currentTarget.dataset.item
    })
  },
  onReachBottom(){
    this.data.pagenum++;
    const shop_id = my.getStorageSync({key:'shop_id'}).data;
    this.getCommentList(this.data.goodsInfo.goods_code,this.data.pagenum,this.data.pagesize);
    this.getDispatchCommentList(shop_id,this.data.pagenum,this.data.pagesize)
  }
});
