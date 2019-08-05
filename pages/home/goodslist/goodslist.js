import { imageUrl, imageUrl2, ak } from '../../common/js/baseUrl'
import { bannerList, showPositionList, activityList, GetLbsShop, NearbyShop, GetShopGoods } from '../../common/js/home'
import { getuserInfo, loginByAuth } from '../../common/js/login'
import { cur_dateTime, compare } from '../../common/js/time'
import {bd_encrypt} from '../../common/js/map'
var app = getApp(); //放在顶部
Page({
  data: {
    scroll_y: false,
    imageUrl,
    imageUrl2,
    firstAddress: '紫檀大厦',
    isClose: false,
    indicatorDots: true,
    autoplay: false,
    vertical: false,
    interval: 1000,
    circular: true,
    imgUrls: ['../../common/img/banner.png'],
    province_id: '',  //省
    city_id: '',  // 市
    region_id: '',  //区
    showListObj: {},   // 展位
    isOpen: '',     //门店是否营业
    shopTakeOut: [],   // 附近门店列表
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
    shopGoods:[]   // 门店商品
  },
  onLoad() {
    
  },
  onShow() {
      // 定位地址
    this.setData({
      firstAddress: app.globalData.address,
      isOpen: app.globalData.isOpen,
      type:app.globalData.type
    })
    // 初始化默认外卖
    if (app.globalData.type == 1) {
       // 切换门店
        const shopArray = my.getStorageSync({
          key: 'takeout', // 缓存数据的key
        }).data;
        if (this.data.switchShop_id) {
          let arr1 = shopArray.filter((item, index) => {
            return item.shop_id == this.data.switchShop_id
          })
          let arr2 = shopArray.filter((item, index) => {
            return item.shop_id != this.data.switchShop_id
          })
          const arr = arr1.concat(arr2);
          this.setData({
            shopTakeOut: arr
          })
          my.setStorageSync({ key: 'takeout', data: arr });
          my.setStorageSync({key:'shop_id',data:arr[0].shop_id});
          this.getCompanyGoodsList(arr[0].company_sale_id);
          this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, arr[0].company_sale_id, 1);//banner
          this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, arr[0].company_sale_id); 
        }else{
          this.getCompanyGoodsList(shopArray[0].company_sale_id); //获取公司所有商品(第一个为当前门店)
          this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopArray[0].company_sale_id, 1);//banner
          this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopArray[0].company_sale_id); 
          this.setData({
            shopTakeOut: shopArray
          })
        }
    } else {
      const shopArray = my.getStorageSync({
        key: 'self', // 缓存数据的key
      }).data;
      // 切换门店
      if (this.data.switchShop_id) {
        let arr1 = shopArray.filter((item, index) => {
          return item.shop_id == this.data.switchShop_id
        })
        let arr2 = shopArray.filter((item, index) => {
          return item.shop_id != this.data.switchShop_id
        })
        const arr = arr1.concat(arr2);
        this.setData({
          shopTakeOut: arr
        })
        my.setStorageSync({ key: 'self', data: arr });
        my.setStorageSync({key:'shop_id',data:arr[0].shop_id});
        this.getCompanyGoodsList(arr[0].company_sale_id);
        this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, arr[0].company_sale_id, 1);//banner
        this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, arr[0].company_sale_id);
      }else{
        this.getCompanyGoodsList(shopArray[0].company_sale_id); //获取公司所有商品(第一个为当前门店)
        this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopArray[0].company_sale_id, 1);//banner
        this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopArray[0].company_sale_id); 
        this.setData({
          shopTakeOut: shopArray
        })
      }
    }
    if (this.data.imgUrls.length > 1) {
      this.setData({
        indicatorDots: true,
        autoplay: true
      })
    }
    // 切换门店
    if (app.globalData.shop_id) {
      this.setData({
        switchShop_id: app.globalData.shop_id,
        type: app.globalData.type
      })
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
    if (e.currentTarget.dataset.type == 'ziti') {
      let shopTakeOut = my.getStorageSync({key:'takeout'}).data;
      this.setData({
        shopTakeOut,
        type:2
      });
      app.globalData.type =2;
      this.getCompanyGoodsList(shopTakeOut[0].company_sale_id); //获取公司所有商品(第一个为当前门店)
      this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut[0].company_sale_id, 1);//banner
      this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut[0].company_sale_id); 
    } else {
      let shopTakeOut = my.getStorageSync({key:'self'}).data;
      this.setData({
        shopTakeOut,
        type:1
      })
      app.globalData.type = 1;
      this.getCompanyGoodsList(shopTakeOut[0].company_sale_id); //获取公司所有商品(第一个为当前门店)
      this.getBannerList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut[0].company_sale_id, 1);//banner
      this.getShowpositionList(app.globalData.position.cityAdcode, app.globalData.position.districtAdcode, shopTakeOut[0].company_sale_id); 
    }
  },
  // 首页banner列表
   getBannerList(city_id, district_id, company_id, release_channel) {
     bannerList(city_id, district_id, company_id, release_channel).then( (data) => {
      console.log(data)
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
        this.getShopGoodsList(this.data.shopTakeOut[0].shop_id);
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
          console.log(conf.data.data.country);
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
            companyGoodsList,
            shopGoods:arr
          },()=> {
            this.getActivityList(app.globalData.cityAdcode,app.globalData.districtAdcode,this.data.shopTakeOut[0].company_sale_id,app.globalData.type,my.getStorageSync({key: 'user_id'}).data)     //营销活动
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
      // 获取加价购商品
      if(res.data.MARKUP!=null) {
        app.globalData.gifts = res.data.MARKUP.gifts;
        // 获取活动金额
        let newArr =Object.keys(res.data.MARKUP.gifts).sort(compare);
        this.setData({
          otherGoods:newArr
        })
      }else{
         app.globalData.gifts = [];
      }
      
      // 获取参与加价购商品的列表
      app.globalData.otherGoods = res.data.MARKUP.goods;
      

      // 筛选在当前门店里面的折扣商品
      let DIS = [],PKG = []
      if(res.data.DIS) {
        DIS = res.data.DIS.filter(item => shopGoods.findIndex(value => value.goods_id == item.goods_id) == -1)
      }
      // 筛选在当前门店里面的套餐商品  
      if(res.data.PKG) {
        PKG = res.data.PKG.filter(item => shopGoods.findIndex(value => value.goods_id == item.goods_id) == -1);
      }
      let obj1 = {}, obj2 = {};
      for(let item of PKG) {
        item.goods_img = [item.goods_img];
        item.goods_img_detail_origin = [item.goods_img_detail_origin]
        item.goods_img_intr_origin = [item.goods_img_intr_origin]
      }

      obj1 = {
        "key": "折扣",
        "last": DIS
      }
      obj2 = {
        "key": "套餐",
        "last": PKG
      }
      // obj3 = {
      //   "key":"包邮",
      //   "last":FREE
      // }
      // obj4 = {
      //   "key":"满减",
      //   "last":FULL
      // }
      this.data.shopGoodsList.unshift(obj1,obj2);
      let goodsArr = [...DIS,...PKG,...this.data.shopGoods];    // 门店所有列表（一维数组）
      let goodsNew = this.data.shopGoodsList.filter(item => item.last.length>0);
      goodsNew = [...new Set(goodsNew)];
      console.log(goodsArr)
      // 判断购物车商品是否在当前门店内,不在的清除购物车
      let shopcartAll = my.getStorageSync({
        key: 'goodsList', // 缓存数据的key
      }).data;
      if(shopcartAll == null) return;
      for(let value of goodsArr){
        if(value.goods_format.length==0){
          if(shopcartAll[`${value.goods_channel}${value.goods_type}${value.company_goods_id}_${value.goods_format.type}`]){
            my.showToast({
              content: `购物车有${shopcartAll[`${value.goods_channel}${value.goods_type}${value.company_goods_id}_${value.goods_format.type}`].sumnum}件商品不在当前门店售卖商品之内`
            });
            shopcartAll = shopcartAll[`${value.goods_channel}${value.goods_type}${value.company_goods_id}_${value.goods_format.type}`];
          }
        }
        if(value.goods_format.length>1){
          for(let item of value.goods_format){
            if(shopcartAll[`${value.goods_channel}${value.goods_type}${value.company_goods_id}_${item.type}`]){
              my.showToast({
                content: `购物车有${shopcartAll[`${value.goods_channel}${value.goods_type}${value.company_goods_id}_${item.type}`].sumnum}件商品不在当前门店售卖商品之内`
              })
              shopcartAll = shopcartAll[`${value.goods_channel}${value.goods_type}${value.company_goods_id}_${item.type}`]
            }
          }
        }
      }
      
      this.setData({
        shopGoodsAll:goodsNew
      })
      my.setStorageSync({
        key: 'goodsList',
        data: shopcartAll
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
      if(ret[0].top<=127) {
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
});
