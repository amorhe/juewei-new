import { imageUrl, imageUrl2, ak } from '../../common/js/baseUrl'
import { bannerList, showPositionList, activityList, GetLbsShop, NearbyShop, GetShopGoods } from '../../common/js/home'
import { getuserInfo, loginByAuth } from '../../common/js/login'
import { cur_dateTime, compare } from '../../common/js/time'
import {bd_encrypt} from '../../common/js/map'
var app = getApp(); //放在顶部
Page({
  data: {
    scroll_y: false,
    isSelf:false,
    imageUrl,
    imageUrl2,
    firstAddress: '紫檀大厦',
    isClose: false,
    indicatorDots: false,
    autoplay: false,
    interval: 2000,
    circular: true,
    imgUrls: [],
    province_id: '',  //省
    city_id: '',  // 市
    region_id: '',  //区
    showListObj: [],   // 展位
    isOpen: '',     //门店是否营业
    shopTakeOut: {},   // 附近门店列表
    shopGoodsList: [],         // 门店商品列表
    companyGoodsList:[],
    typeList1:{
      "折扣": "zk",
      "套餐": "zhsm",
    },
    typeList: {
      "爆款": "hot",
      "超辣": "kl",
      "甜辣": "tl",
      "微辣": "wl",
      "不辣": "bl",
      "招牌系列": "zhao_series",
      "藤椒系列": "tj_series",
      "素菜系列": "su_series",
      "黑鸭系列": "hei_series",
      "五香系列": "wu_series",
      "解辣神器": "qqt_series"
    },
    shopGoodsAll:[],  
    content:'',
    confirmButtonText:'',
    cancelButtonText:'',
    modalShow:false,
    mask:false,
    otherGoods:[],   // 参与换购的商品
    type:1,   // 默认外卖
    shopGoods:[],   // 门店商品
    fullActivity:'',
    freeMoney:'',
    jingxuan:true
  },
  onLoad() {
     
  },
  onShow() {
    console.log(1)
    // 定位地址
    this.setData({
      firstAddress: app.globalData.address,
      type:app.globalData.type
    })
    if(app.globalData.isSelf){
      this.setData({
        isSelf:true
      })
    }
    // 初始化默认外卖
    let shopArray = [];
    if(app.globalData.shopIng){
      if(my.getStorageSync({key:'shop_id'}).data!=app.globalData.shop_id){
        this.getCompanyGoodsList(app.globalData.shopIng.company_sale_id); //获取公司所有商品
        this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, app.globalData.shopIng.company_sale_id);//banner
        this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, app.globalData.shopIng.company_sale_id); 
        const status = cur_dateTime(app.globalData.shopIng.start_time, app.globalData.shopIng.end_time);
        this.setData({
          isOpen:status,
          shopTakeOut:app.globalData.shopIng
        })
        my.setStorageSync({key:'shop_id',data:app.globalData.shopIng.shop_id});
      }
      // console.log(app.globalData.shopIng)
      this.setData({
        jingxuan:app.globalData.shopIng.jingxuan || false
      })
    }else{
      if (app.globalData.type == 1) {
        shopArray  = my.getStorageSync({
          key: 'takeout', // 缓存数据的key
        }).data;   
      } else {
        shopArray = my.getStorageSync({
          key: 'self', // 缓存数据的key
        }).data;
      }
      this.getCompanyGoodsList(shopArray[0].company_sale_id); //获取公司所有商品
      this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopArray[0].company_sale_id);//banner
      this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopArray[0].company_sale_id); 
      const status = cur_dateTime(shopArray[0].start_time, shopArray[0].end_time);
      this.setData({
        isOpen:status,
        shopTakeOut: shopArray[0]
      })
      // console.log(shopArray)
      my.setStorageSync({key:'shop_id',data:shopArray[0].shop_id});
    }
  },
  onReady() {
    // 页面加载完成 只加载一次 页面初始化用
  },
  // 关闭提醒
  closeOpen() {
    this.setData({
      isClose: true
    })
  },
  // 切换外卖自提
  chooseTypes(e) {
    if(!my.getStorageSync({key:'takeout'}).data){
      return
    }
    if (e.currentTarget.dataset.type == 'ziti') {
      let shopTakeOut = '';
      if(app.globalData.shopIng){
        shopTakeOut = app.globalData.shopIng
      }else{
        shopTakeOut = my.getStorageSync({key:'self'}).data[0]
      }
      this.setData({
        shopTakeOut,
        type:2
      });
      app.globalData.type =2;
      this.getCompanyGoodsList(shopTakeOut.company_sale_id); //获取公司所有商品(第一个为当前门店)
      this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut.company_sale_id);//banner
      this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut.company_sale_id); 
    } else {
      let shopTakeOut = '';
      if(app.globalData.shopIng){
        shopTakeOut = app.globalData.shopIng
      }else{
        shopTakeOut = my.getStorageSync({key:'takeout'}).data[0]
      }
      this.setData({
        shopTakeOut,
        type:1
      })
      app.globalData.type = 1;
      this.getCompanyGoodsList(shopTakeOut.company_sale_id); //获取公司所有商品(第一个为当前门店)
      this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut.company_sale_id);//banner
      this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut.company_sale_id); 
    }
  },
  // 首页banner列表
   getBannerList(city_id, district_id, company_id) {
     bannerList(city_id, district_id, company_id, 1).then( (data) => {
      console.log(data)
      if (data.data.length > 1) {
        this.setData({
          indicatorDots: true,
          autoplay: true
        })
      }
      this.setData({
        imgUrls: data.data
      })
    });
  },
  // 首页商品展位
  getShowpositionList(city_id, district_id, company_id) {
    showPositionList(city_id, district_id, company_id, 1).then( (res) => {
      this.setData({
        showListObj: res.data
      })
    })
  },
  // 公司商品列表
  getCompanyGoodsList(company_id) {
    const str = new Date().getTime();
    my.request({
      url: `https://imgcdnjwd.juewei.com/static/check/api/product/company_sap_goods${company_id}.json?v=${str}`,
      success: (res) => {
        // console.log(res.data.data[`${company_id}`])
        // 该公司所有的商品
        this.setData({
          companyGoodsList:res.data.data[`${company_id}`]
        })
        this.getShopGoodsList(this.data.shopTakeOut.shop_id);
      }
    });
  },
  // 门店商品列表
  getShopGoodsList(shop_id) {
    GetShopGoods(shop_id).then((res) => {
      const shopGoodsList = res.data[`${shop_id}`];
      const companyGoodsList = this.data.companyGoodsList;
      //  获取某公司下的某一个门店的所有商品
      let arr = companyGoodsList.filter(item => {
        return shopGoodsList.includes(item.sap_code)
      })
       const str = new Date().getTime();
      my.request({
        url: `https://images.juewei.com/prod/shop/goods_sort.json?v=${str}`,
        success: (conf) => {
          // console.log(conf.data.data.country);
          let _T = conf.data.data.country
          const { typeList } = this.data

          let keys = Object.keys(typeList);
          let list = keys.map(
            item => ({
              key: item,
              values: arr.filter(_item => item === _item.cate_name || item === _item.taste_name)
            })
          )
          let sortList = list.map(({ key, values }) => {
            let _sort = typeList[key]
            let _t = _T[_sort]
            if (!_t) { return {key,last:[]} }

            let last = []
            _t.map(_item => {
              if(values.length ==0){
                values = arr;
              }
              let cur = values.filter(({ goods_code }) => goods_code === _item);
              last = new Set([...last, ...cur])
            })
            return {
              key,
              last:[...last]
            }    
          })
          // let goodsli = sortList.filter(_item => _item.last.length>0);
          this.setData({
            shopGoodsList: sortList,
            shopGoods:arr
          },()=> {
            let user_id = 1;
            if(my.getStorageSync({key:'user_id'}).data){
              user_id = my.getStorageSync({key:'user_id'}).data
            }
            this.getActivityList(app.globalData.cityAdcode,app.globalData.districtAdcode,this.data.shopTakeOut.company_sale_id,app.globalData.type,user_id)     //营销活动
          })
          
        },
      });
      
    })
  },
  // 门店营销活动(折扣和套餐)
  getActivityList(city_id,district_id,company_id,buy_type,user_id){
    activityList(city_id,district_id,company_id,buy_type,user_id).then((res) => {
      console.log(res);
      let shopGoods = this.data.shopGoods;
      // console.log(shopGoods)
      // 获取加价购商品
      if(res.data.MARKUP!=null) {
        app.globalData.gifts = res.data.MARKUP.gifts;
        // 获取活动金额
        let newArr = Object.keys(res.data.MARKUP.gifts);
        app.globalData.fullActivity = newArr;
        this.setData({
          fullActivity:newArr
        })
      }else{
         app.globalData.gifts = [];
      }
      
      // 获取参与加价购商品的列表（可换购）
      if(res.data.MARKUP !=null){
        if(res.data.MARKUP.goods.length==0){
          app.globalData.repurseGoods = [];
        }else{
           app.globalData.repurseGoods = res.data.MARKUP.goods;
        }
        for(let item of res.data.MARKUP.goods){
          for(let value of shopGoods){
            if(item.goods_code == value.sap_code){
              value['huangou'] = 1;
            }
          }
        }
      }

      // 筛选在当前门店里面的折扣商品
      let DIS = [],PKG = []
      if(res.data.DIS) {
        DIS = res.data.DIS.filter(item => shopGoods.findIndex(value => value.sap_code == item.goods_sap_code) != -1)
      }
      // 筛选在当前门店里面的套餐商品  
      if(res.data.PKG) {
        PKG = res.data.PKG.filter(item => shopGoods.findIndex(value => value.sap_code == item.goods_sap_code) != -1);
      }
      let obj1 = {}, obj2 = {};
      for(let item of PKG) {
        item.goods_img = [item.goods_img];
        item.goods_img_detail_origin = [item.goods_img_detail_origin]
        item.goods_img_intr_origin = [item.goods_img_intr_origin]
      }

      // 包邮活动
      if(res.data.FREE){
        app.globalData.freeId = res.data.FREE.id;
        this.setData({
          freeMoney:res.data.FREE.money
        })
      }

      obj1 = {
        "key": "折扣",
        "last": DIS
      }
      obj2 = {
        "key": "套餐",
        "last": PKG
      }
      
      this.data.shopGoodsList.unshift(obj1,obj2);
      let goodsArr = [...DIS,...PKG,...this.data.shopGoods];    // 门店所有列表（一维数组）
      let goodsNew = this.data.shopGoodsList.filter(item => item.last.length>0);
      goodsNew = [...new Set(goodsNew)];
      app.globalData.goodsArr = goodsArr;
      console.log(goodsNew)
      this.setData({
        shopGoodsAll:goodsNew
      })
      my.setStorageSync({
        key:'shopGoods',
        data: goodsArr
      })
    })
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  xiadan() {
    my.alert({ title: '点击' });
    //判断用户信息是否存在
    if (app.globalData.location.longitude !== null && app.globalData.userInfo === null) {
      //获取用户信息
    }
  },
  onPageScroll: function(e) {
    my.createSelectorQuery().select('#pagesinfo').boundingClientRect().exec((ret) => {
      // console.log(ret)
      if(ret[0].top<=104) {
        this.setData({
          scroll_y:true
        })
      }else{
        this.setData({
          scroll_y:false
        })
      }
    })
  },
  //  活动跳转链接
  imageLink(e){
    my.navigateTo({
      url:e.currentTarget.dataset.link
    });
  },
  // banner图跳转链接
  linkUrl(e){
    my.navigateTo({
      url:e.currentTarget.dataset.link
    });
  }
});
