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
    shopGoodsList:[]
  },
  props: {
    onCloseModal: (data) => console.log(data),
  },
  didMount() {
    
  },
  didUpdate(prevProps, prevData) {
    if(Object.keys(this.props.goodsItem).length>0){
      const goodsKey = this.props.goodsKey;   
      const goodsLast = this.props.goodsLast;
      let goodsItem = this.props.goodsItem.last[goodsLast];
      this.setData({
        goodsItem,
        goodsKey,
        goodsLast,
        shopGoodsList:this.props.shopGoodsList
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
          sizeText:'大份'
        })
      }else if(e.currentTarget.dataset.size ==2){
        this.setData({
          size: e.currentTarget.dataset.size,
          price:this.data.goodsItem.goods_format[1].goods_price / 100,
          sizeText:'小份'
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
    addshopcart(){
      let {shopGoodsList,goodsKey,goodsLast,size} = this.data;
      // 大份
      if(size==1){
         shopGoodsList[goodsKey].last[goodsLast].largeCount ++;
      }
      // 小份
      if(size==2){
         shopGoodsList[goodsKey].last[goodsLast].smallCount ++;
      }
      let smallArr=[],largeArr=[];
      this.data.shopGoodsList = shopGoodsList;
      // 统计大份
      let large = shopGoodsList.map(item =>  item.last.filter(_item=> _item.largeCount > 0))
      largeArr = large.filter(item => item.length>0);
      // 统计小份
      let small = shopGoodsList.map(item =>  item.last.filter(_item=> _item.smallCount > 0))
      smallArr = small.filter(item => item.length>0);
      let arr = [];
      if(my.getStorageSync({key:'goodsList'}).data){
        const oldArr = my.getStorageSync({key:'goodsList'}).data;
        arr = oldArr.concat(smallArr[0],largeArr[0]);
      }else{
       const oldArr =[];
       arr = oldArr.concat(smallArr[0],largeArr[0]);
      } 
      let goodsCart = arr.filter(item=> item!=undefined);
      my.setStorageSync({
        key: 'goodsList', 
        data: goodsCart, 
      }); 
    }
  },
});
