import {imageUrl,imageUrl2,ak} from '../../common/js/baseUrl'
import {bannerList,showPositionList,activityList,GetLbsShop,NearbyShop,GetShopGoods} from '../../common/js/home'
import {getuserInfo,loginByAuth} from '../../common/js/login'
import {cur_dateTime,compare} from '../../common/js/time'
var app=getApp(); //放在顶部
Page({
  data: {
    scroll_y: false,
    imageUrl,
    imageUrl2,
    firstAddress:'紫檀大厦',  
    type:1,  //默认外卖
    isClose: false,  
    indicatorDots: true,
    autoplay: false,
    vertical: false,
    interval: 1000,
    circular: true,
    imgUrls:['../../common/img/banner.png'],
    province_id:'',  //省
    city_id:'',  // 市
    region_id:'',  //区
    showListObj:{},   // 展位
    isOpen: '',     //门店是否营业
    shopTakeOut:[],   // 外卖附近门店列表
    shopGoodsList:[],         // 门店商品列表
  },
  onLoad(query) {
    // 页面加载
    //判断定位地址是否存在
    // if(app.globalData.location && app.globalData.location.longitude=== null && app.globalData.location.latitude=== null){
    //   my.redirectTo({
    //      url: '../../position/position'
    //   })
    // }
    // 定位地址
    if(query.address1 || query.address2) {
      this.setData({
        firstAddress: query.address1 + query.address2
      })
    }
    if(this.data.imgUrls.length>1){
      this.setData({
        indicatorDots:true,
        autoplay:true
      })
    }
    if(query.shop_id){
      this.setData({
        switchShop_id:query.shop_id,
        type: query.type
      })
    }

    this.getBannerList(110100,110105,1,1);
    this.getShowpositionList(110100,110105,1,1);
    if(this.data.type == 1) {
      this.getLbsShop();
    }else{
      this.getNearbyShop();
    }
  },
  onShow() {
    // 页面显示 每次显示都执行
    // my.alert({ title: 'onShow=='+app.globalData.authCode });
   
   
  },
  onReady() {
    // 页面加载完成 只加载一次 页面初始化用

   
  },
  closeOpen(){
    this.setData({
      isClose: true
    })
  },
  // 授权获取用户信息
   onGetAuthorize(res) {
      my.getOpenUserInfo({
        success: (res) => {
         let userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
         this.loginByAuth(userInfo.nickName,userInfo.avatar);
        },
        fail(){
           my.alert({ title:'获取用户信息失败' });
        }
      });
  },
  // 获取手机号
  onGetPhone(){
    my.getPhoneNumber({
      success: (res) => {
          let encryptedData = res.response;
          console.log(encryptedData)
      },
      fail: (res) => {
          console.log(res);
      },
    });
  },
  // 授权登录
  loginByAuth(nick_name,head_img){
    const ali_uid = my.getStorageSync({key: 'ali_uid'});
    loginByAuth(ali_uid.data,'15757902894',nick_name,head_img).then((res) => {
      my.setStorageSync({
        key: '_sid', // session_id
        data: res.data._sid,
      });
      this.getUserInfo(res.data._sid) ;
    })
  },
  // 用户信息
  getUserInfo(_sid){
    getuserInfo(_sid).then((res) => {
      console.log(res);
      app.globalData.userInfo = res.data;
      this.getBannerList(res.data.city_id,res.data.region_id,1,1);
    })
  },
    // 切换外卖自提
  chooseTypes(e){
    if(e.currentTarget.dataset.type=='ziti'){
        this.setData({
          type:2,
          shopTakeOut:[]
        })
        this.getNearbyShop();
    }else{
     this.setData({
        type:1,
        shopTakeOut:[]
     })
     this.getLbsShop(); 
    }
  },
  // 首页banner列表
  getBannerList(city_id,district_id,company_id,release_channel){
     bannerList(city_id,district_id,company_id,release_channel).then((data) => {
       this.setData({
        imgUrls:data.data
       })
     });
  },
  // 首页商品展位
  getShowpositionList(city_id,district_id,company_id){
    showPositionList(city_id,district_id,company_id,1).then((res) => {
      this.setData({
        showListObj: res.data[0]
      })
    })
  },
  // 外卖附近门店
  getLbsShop(){
    // const lng = my.getStorageSync({key:'lng'}).data;
    // const lat = my.getStorageSync({key:'lat'}).data;
    const lng = 116.54828;
    const lat = 39.918639;
    const location = `${lng},${lat}`
    const shopArr1 = [];
    const shopArr2 = [];
    GetLbsShop(location).then((res) => {
      console.log(res)
      if(res.code == 0 && res.data.length>0){
        for(let i = 0; i < res.data.length; i ++) {
          const status = cur_dateTime(res.data[i].start_time,res.data[i].end_time);
          this.setData({
            isOpen: status
          })
          // 判断是否营业
          if(status == 1 || status == 3) {
            shopArr1.push(res.data[i]);
          }else{
            shopArr2.push(res.data[i]);
          }
        }
        // 按照goods_num做降序排列
        shopArr1.sort(compare('goods_num'));
        shopArr2.sort(compare('goods_num'));
        const shopArray = shopArr1.concat(shopArr2);
        my.setStorageSync({key:'takeout',data:shopArray});   // 保存外卖门店到本地
        this.getCompanyGoodsList(shopArray[0].company_sale_id); //获取公司所有商品
        this.setData({
          shopTakeOut: shopArray
        })
        // 切换门店
        if(this.data.switchShop_id){
            let arr1 = shopArray.filter((item,index)=> {
                return item.shop_id == this.data.switchShop_id
            })
            let arr2 = shopArray.filter((item,index)=> {
                return item.shop_id != this.data.switchShop_id
            })
            const arr = arr1.concat(arr2);
            this.setData({
              shopTakeOut: arr
            })
            this.getCompanyGoodsList(arr[0].company_sale_id);
        } 
      }else if(res.code == 5 || res.data.length==0){
        console.log("附近暂无门店");
        this.setData({
          type:2
        })
      }
      
    })
  },
  // 自提附近门店
  getNearbyShop(){
    // const lng = my.getStorageSync({key:'lng'}).data;
    // const lat = my.getStorageSync({key:'lat'}).data;
    const lng = 116.54828;
    const lat = 39.918639;
    const location = `${lng},${lat}`
    const shopArr1 = [];
    const shopArr2 = [];
    my.request({
      url: `https://api.map.baidu.com/geosearch/v3/nearby?geotable_id=134917&location=${lng}%2C${lat}&ak=${ak}&radius=3000&sortby=distance%3A1&_=1504837396593&page_index=0&page_size=50&_=1563263791821`,
      success: (res) => {
        const obj = res.data.contents;
        NearbyShop(JSON.stringify(obj)).then((res) => {
          for(let i = 0; i < res.length; i ++) {
            const status = cur_dateTime(res[i].start_time,res[i].end_time);
            this.setData({
              isOpen: status
            })
            // 判断是否营业
            if(status == 1 || status == 3) {
              shopArr1.push(res[i]);
            }else{
              shopArr2.push(res[i]);
            }
          }
          const shopArray = shopArr1.concat(shopArr2);
          my.setStorageSync({key:'self',data:shopArray});  // 保存自提门店到本地
          this.getCompanyGoodsList(shopArray[0].company_sale_id);  //获取公司所有商品
          console.log(shopArray);
          this.setData({
            shopTakeOut: shopArray
          })
          // 切换门店
          if(this.data.switchShop_id){
            let arr1 = shopArray.filter((item,index)=> {
                return item.shop_id == this.data.switchShop_id
            })
            let arr2 = shopArray.filter((item,index)=> {
                return item.shop_id != this.data.switchShop_id
            })
            const arr = arr1.concat(arr2);
            this.setData({
              shopTakeOut: arr
            })
             this.getCompanyGoodsList(arr[0].company_sale_id);
          }            
          
        })
      },
    });
  },
  // 公司商品列表
  getCompanyGoodsList(company_id){
    my.request({
      url: `https://imgcdnjwd.juewei.com/static/check/api/product/company_sap_goods${company_id}.json?v=156335816013`,
      success: (res) => {
        // 该门店所有的商品
        my.setStorageSync({key:'company',data:res.data.data[`${company_id}`]});
      }
    });
  },
  // 门店商品列表
  getShopGoodsList(shop_id) {
    GetShopGoods(shop_id).then((res) => {
      console.log(res.data[`${shop_id}`])
      const shopGoodsList = res.data[`${shop_id}`];
      const companyGoodsList = my.getStorageSync({key: 'company'}).data;
    //  获取某公司下的某一个门店的商品
      let arr = companyGoodsList.filter((item,index) => {
        return shopGoodsList.includes(item.sap_code)
      })
      console.log(arr)
      this.setData({
        shopGoodsList: arr
      })
    })
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  xiadan(){
    my.alert({ title: '点击' });
    //判断用户信息是否存在
    if(app.globalData.location.longitude!==null && app.globalData.userInfo=== null){
      //获取用户信息
    }
  },
  onPageScroll:function(e){
    my.createSelectorQuery().select('#pagesinfo').boundingClientRect().exec((ret)=>{
      if(ret[0].top<=127){
        this.setData({
          scroll_y:true
        });
      }else{
        this.setData({
          scroll_y:false
        });
      }
    })
  },
});
