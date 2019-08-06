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
    commentArr:[
      {
        imgAvatar:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1025011724,3729989080&fm=27&gp=0.jpg',
        name:'绝味1',
        star:5,
        comment_time:'2019.06.19 12:28',
        comment_text:'第一次订这个，味道超级好',
        imgUrls:['https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=780072152,3543775531&fm=26&gp=0.jpg','https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1578146793,4217461747&fm=26&gp=0.jpg',
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1549818796,3596703153&fm=26&gp=0.jpg']
      },
      {
        imgAvatar:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=311097710,965735535&fm=27&gp=0.jpg',
        name:'绝味2',
        star:3,
        comment_time:'2019.06.19 12:28',
        comment_text:'第一次订这个，味道超级好',
        imgUrls:['https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=780072152,3543775531&fm=26&gp=0.jpg']
      },
      {
        imgAvatar:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=311097710,965735535&fm=27&gp=0.jpg',
        name:'绝味2',
        star:3,
        comment_time:'2019.06.19 12:28',
        comment_text:'第一次订这个，味道超级好',
        imgUrls:[]
      }
    ],
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
    pagesize:10
  },
  onLoad(e) {
    let goods = my.getStorageSync({
      key: 'shopGoods'
    }).data;
    let goodlist = my.getStorageSync({key:'goodsList'}).data;
    let goodsInfo = {},priceAll = 0,shopcartAll = [],shopcartNum=0;
    for(let value of goods){
      if(value.goods_code==e.goods_code){
        goodsInfo = value
      }
    }
    for(let keys in goodlist){
      if(goodlist[keys].goods_discount_user_limit && goodlist[keys].num>goodlist[keys].goods_discount_user_limit){
        priceAll += goodlist[keys].goods_price * goodlist[keys].goods_discount_user_limit + (goodlist[keys].num-goodlist[keys].goods_discount_user_limit)* goodlist[keys].goods_original_price;
      }else{
        priceAll += goodlist[keys].goods_price * goodlist[keys].num;
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
      goodsKey: e.goodsKey
    })
    const shop_id = my.getStorageSync({key:'shop_id'}).data;
    // 购物车活动提示
    // console.log(app.globalData.fullActivity)
    this.shopcartPrompt(app.globalData.fullActivity,priceAll)
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
    this.onCart(goodlist,shopcartAll,priceAll,shopcartNum)
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
          "goods_img": e.currentTarget.dataset.goods_img
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
          "goods_img": e.currentTarget.dataset.goods_img
        }
      }
      goodlist[`${goods_code}_${goods_format}`]  = oneGood;
    }
    let shopcartAll = [],priceAll=0,shopcartNum=0;
    for(let keys in goodlist){
      if(goodlist[keys].goods_discount_user_limit && goodlist[keys].num>goodlist[keys].goods_discount_user_limit){
        priceAll += goodlist[keys].goods_price * goodlist[keys].goods_discount_user_limit + (goodlist[keys].num-goodlist[keys].goods_discount_user_limit)* goodlist[keys].goods_original_price;
      }else{
        priceAll += goodlist[keys].goods_price * goodlist[keys].num;
      }
      shopcartAll.push(goodlist[keys]);
      shopcartNum += goodlist[keys].num;
    }
    // 购物车活动提示
    this.shopcartPrompt(app.globalData.fullActivity,priceAll);
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
      shopcartNum += goodlist[keys].num;
    }
    // 删除
    if(goodlist[`${code}_${format}`].num==0){
      shopcartAll = this.data.shopcartAll.filter(item => `${item.goods_code}_${format}` != `${code}_${format}`)
      delete(goodlist[`${code}_${format}`]);
    }
    // 购物车活动提示
    this.shopcartPrompt(app.globalData.fullActivity,priceAll);
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
  // 清空购物车
  onClear(){
    this.setData({
      shopcartList:{}
    })
  },
  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  tabChange({index}) {
    this.setData({
      tabActive: index,
      pagenum:1
    });
  },
  // 商品评价
  getCommentList(goods_code,pagenum,pagesize){
    commentList(goods_code,pagenum,pagesize,1).then((res) => {
      console.log(res)
      this.setData({
        commentArr:[...res,...this.data.commentArr]
      })
    })
  },
  // 配送评价
  getDispatchCommentList(shop_id,pagenum,pagesize){
    DispatchCommentList(shop_id,pagenum,pagesize,1).then((res) => {
      console.log(res);
      this.setData({
        dispatchArr:[...res,...this.data.dispatchArr]
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
    this.getCommentList(goodsInfo.goods_code,this.data.pagenum,this.data.pagesize);
    this.getDispatchCommentList(shop_id,this.data.pagenum,this.data.pagesize)
  }
});
