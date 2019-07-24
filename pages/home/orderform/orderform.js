import {imageUrl} from '../../common/js/baseUrl'
Page({
  data: {
    imageUrl,
    isCheck: false,  //协议
    // 换购商品列表
    repurseList:[
      {
        img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3858629,3224043760&fm=26&gp=0.jpg',
        goodsName: '黑鸭鸡膝软骨',
        goodsType: '超辣',
        goodsNum: 2000,
        price: 4,
        oldPrice: 10
      },
      {
        img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3898176482,3211240837&fm=26&gp=0.jpg',
        goodsName: '如来鸭掌',
        goodsType: '甜辣',
        goodsNum: 20000,
        price: 10,
        oldPrice: 20
      }
    ],
    countN:0,
    mask:false,
    modalShow:false,
    type:0,
    content:"",
    orderType:2,  //1为外卖，2为自提
    longitude: 116.30051,
    latitude: 40.0511,
    markersArray:[
      // {
      //   longitude: 116.30051,
      //   latitude: 40.0511,
      //   iconPath:`${imageUrl}position_map1.png`,
      //   width: 45,
      //   height: 45,
      //   rotate:270
      // },
      // {
      //   longitude:116.3005,
      //   latitude: 40.1,
      //   iconPath:`${imageUrl}position_map2.png`,
      //   width: 72,
      //   height: 72,
      //   label:{
      //     content:"距你2.5公里",
      //     color:"#333",
      //     fontSize:11,
      //     borderRadius:30,
      //     bgColor:"#ffffff",
      //     padding:8,
      //   }
      // }
    ],
    shopObj:{}   // 自提商店的详细信息
  },
  onLoad(e) {
    console.log(e)
    // const res = JSON.parse(my.getStorageSync({key: 'goodsList'}).data);
    // confirmOrder(this.data.orderType,shop_id,goods,shop_id).then((res) => {
    //   console.log(res)
    // })
    this.setData({
      orderType:e.orderType
    })
    if(e.orderType == 2) {
      const self = my.getStorageSync({key: 'self'}).data;
      let arr = [
        {
          longitude: this.data.longitude,
          latitude: this.data.latitude,
          iconPath:`${imageUrl}position_map1.png`,
          width: 45,
          height: 45,
          rotate:270
        },
        {
          longitude:self[0].location[0],
          latitude: self[0].location[1],
          iconPath:`${imageUrl}position_map2.png`,
          width: 72,
          height: 72,
          label:{
            content:`距你${self[0].distance}米`,
            color:"#333",
            fontSize:11,
            borderRadius:30,
            bgColor:"#ffffff",
            padding:8,
          }
        }
      ]
      console.log(arr)
      this.setData({
        shopObj:self[0],
        longitude:my.getStorageSync({key: 'lng'}).data,
        latitude: my.getStorageSync({key: 'lat', }).data,
        markersArray: arr
      })
    }else{
      const self = my.getStorageSync({key: 'takeout'}).data;
      this.setData({
        shopObj:self[0]
      })
    }

    switch(this.data.type) {
      case 0:
        this.setData({
          content: "有5个商品已失效，系统已清除，是否确认结算"
        })
         break;
      case 1:
        this.setData({
          content: "有5个商品价格更新，系统已清更新，是否确认结算"
        })
         break;
      case 2:
        this.setData({
          content: "有1个商品已失效，有5个商品价格更新，系统已清更新，是否确认结算"
        })
         break;
    }
  },
  // 换购
  addRepurseTap(){
    this.setData({
      countN:1
    })
  },
  // 减
  reduceBtnTap(){
    this.setData({
      countN: this.data.countN - 1
    })
  },
  // 加
  addBtnTap(){
    this.setData({
      countN: this.data.countN + 1
    })
  },
  // 弹框事件回调
  onCounterPlusOne(){
    this.setData({
      mask: false,
      modalShow: false
    })
  },
  // 支付
  confirmPay(){
    this.setData({
      mask: true,
      modalShow: true
    })
  },
  // 选择
  checkedTrueTap(){
    this.setData({
      isCheck: !this.data.isCheck
    })
  },
  
});
