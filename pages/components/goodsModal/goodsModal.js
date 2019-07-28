import {imageUrl} from '../../common/js/baseUrl'
Component({
  mixins: [],
  data: {
    imageUrl,
    size:0,
    goodsItem:{},
    goodsIndex:'',
    price:'',
    sizeText:'',
    shopGoodsList:[],
    goodsKey:'',
    goodsLast:'',
    count:0
  },
  props: {
    onCloseModal: (data) => console.log(data),
  },
  didMount() {
 
  },
  didUpdate(prevProps, prevData) {
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
    if(Object.keys(this.props.goodsItem).length>0){
      const goodsKey = this.props.goodsKey;   
      const goodsLast = this.props.goodsLast;
      let goodsItem = this.props.goodsItem.last[goodsLast];
      this.setData({
        goodsItem,
        goodsKey,
        goodsLast
      })
    }
  },
  didUnmount() {
   
  },
  methods: {
    // 选择商品规格
    chooseSize(e){
      if(e.currentTarget.dataset.size ==1){
        this.setData({
          size: e.currentTarget.dataset.size,
          price:this.data.goodsItem.goods_format[0].goods_price / 100,
          sizeText:this.data.goodsItem.goods_format[0].type,
          count:this.data.goodsItem.goods_format[0].goods_quantity
        })
      }else if(e.currentTarget.dataset.size ==2){
        this.setData({
          size: e.currentTarget.dataset.size,
          price:this.data.goodsItem.goods_format[1].goods_price / 100,
          sizeText:this.data.goodsItem.goods_format[1].type,
          count:this.data.goodsItem.goods_format[1].goods_quantity
        })
      } 
    },
    closeModal(data){
      const goodsModalObj = {
        maskView:false,
        goodsModal:false
      }
      this.props.onCloseModal(goodsModalObj);
      // 重新选择商品
      this.setData({
        size:0
      })
    },
    addshopcart(e){
      let {shopGoodsList,goodsKey,goodsLast,size} = this.data;
      // // 统计大份
      // let large = shopGoodsList.map(item => item.last.filter(_item=> _item.largeCount > 0));
      // large.forEach((item, index)=>{
      //   if(item.length>0){
      //     largeArr=[...largeArr, ...item];
      //   }
      // });
      // // 统计小份
      // let small = shopGoodsList.map(item =>  item.last.filter(_item=> _item.smallCount > 0))
      // small.forEach((item, index)=>{
      //   if(item.length>0){
      //     smallArr=[...smallArr, ...item];
      //   }
      // });
      let goodsCart = [];
      // arr = largeArr.concat(smallArr);
      let arraylist = [];
      // 大份
      if(size==1){
        shopGoodsList[goodsKey].last[goodsLast].goods_format[0].goods_quantity ++;
      }
      // 小份
      if(size==2){
        shopGoodsList[goodsKey].last[goodsLast].goods_format[1].goods_quantity ++;
      }
      // 非折扣
      if(e.currentTarget.dataset.key != '折扣'){
        arraylist.push({
          'goods_code':e.currentTarget.dataset.goods_code,
          'goods_format':e.currentTarget.dataset.goods_format,
          'goods_quantity':e.currentTarget.dataset.goods_quantity + 1,
          'goods_price':e.currentTarget.dataset.goods_price,
        })
      }else{
        //折扣
        arraylist.push({
          'goods_code':e.currentTarget.dataset.goods_code,
          'goods_format':e.currentTarget.dataset.goods_format,
          'goods_quantity':parseInt(e.currentTarget.dataset.goods_quantity + 1)-parseInt(e.currentTarget.dataset.goods_forma[0].goods_discount_user_limit),
          'goods_price':e.currentTarget.dataset.goods_price,
        })
      }
      if(my.getStorageSync({key:'goodsList'}).data!=null){
        let oldArr = my.getStorageSync({key:'goodsList'}).data;
        oldArr = oldArr.filter(_item => arraylist.findIndex(value => value.goods_code == _item.goods_code  && value.goods_format == _item.goods_format)== -1);
        goodsCart = oldArr.concat(arraylist);
      }else{
       const oldArr =[];
       goodsCart = oldArr.concat(arraylist);
      } 
      console.log(goodsCart)
      // this.data.shopGoodsList = shopGoodsList;
      this.setData({
        shopGoodsList
      })
      my.setStorageSync({
        key: 'goodsList', 
        data: goodsCart, 
      }); 

    }
  },
});
