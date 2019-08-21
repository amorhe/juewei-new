import {imageUrl, jsonUrl} from '../../common/js/baseUrl';
import {GetShopGoods,activityList} from '../../common/js/home'

Page({
  data: {
    imageUrl,
    shop_id:8997,
    title:'',
    address:'',
    distance:'',
    goods_num:'',
    shopGoodsList:[],
    companyGoodsList:[],
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
    activityAllObj:{},   
  },
  onLoad(e) {
    console.log(e)
    this.getShopList(e.shop_id,e.company_id);
    this.setData({
      distance:e.distance,
      goods_num:e.goods_num,
      title:e.title,
      address:e.address
    })
  },
  getShopList(shop_id,company_id){
    const timestamp = new Date().getTime();
     my.request({
      url: `${jsonUrl}/api/product/company_sap_goods${company_id}.json?v=${timestamp}`,
      success: (conf) => {
        // 该公司所有的商品
         GetShopGoods(shop_id).then((res) => {
          const shopGoodsList = res.data[`${shop_id}`];
          const companyGoodsList = conf.data.data[`${company_id}`]
          //  获取某公司下的某一个门店的所有商品
          let arr = companyGoodsList.filter(item => {
            return shopGoodsList.includes(item.sap_code)
          })
          
          my.request({
            url: 'https://images.juewei.com/prod/shop/goods_sort.json?v=' + timestamp,
            success: (data) => {
              let _T = data.data.data.country
              const { typeList } = this.data

              let keys = Object.keys(typeList)

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
                  let cur = values.filter(({ goods_code }) => goods_code === _item)
                  last = new Set([...last, ...cur])
                })

                return {
                  key,
                  last:[...last]
                }
              })
            
              console.log(sortList)
              this.setData({
                shopGoodsList: JSON.parse(JSON.stringify(sortList)),
                companyGoodsList
              },() => 
                this.getActivityList(110100,110105,25,2,294785)     //营销活动
              )
            },
          });


        })
      }
    });
  },
  // 门店营销活动(折扣和套餐)
  getActivityList(city_id,district_id,company_id,buy_type,user_id){
    activityList(city_id,district_id,company_id,buy_type,user_id).then((res) => {
      console.log(res);
      const companyGoodsList = this.data.companyGoodsList;
      // 筛选在当前门店里面的折扣商品
      let DIS= [],PKG = []
      if(res.data.DIS) {
        DIS =  res.data.DIS.filter(item => {
          return companyGoodsList.map(_item => _item.goods_id == item.goods_id)
        }) 
      }
      
      // 筛选在当前门店里面的套餐商品  
      if(res.data.PKG) {
        PKG=  res.data.PKG.filter(item => {
          return companyGoodsList.map(_item => _item.goods_id == item.goods_id)
        })
      }
      let activityAllObj ={}
      activityAllObj.DIS = DIS;
      activityAllObj.PKG = PKG;
      console.log(activityAllObj)
      this.setData({
        activityAllObj
      })
    })
  },
});
