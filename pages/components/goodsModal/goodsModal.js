import {imageUrl} from '../../common/js/baseUrl'
Component({
  mixins: [],
  data: {
    imageUrl,
    size:0,
    goodsIndex:'',
    price:'',
    sizeText:'',
    count:0,
    largeCount:0,
    smallCount:0
  },
  props: {
    onCloseModal: (data) => console.log(data),
    onGetShopList: (data) => console.log(data)
  },
  didMount() {
 
  },
   deriveDataFromProps(nextProps){
    console.log(nextProps)
    this.setData({
      smallCount:nextProps.smallCount,
      largeCount:nextProps.largeCount
    })
  },
  didUpdate(prevProps, prevData) {
    
  },
  didUnmount() {
   
  },
  methods: {
    // 选择商品规格
    chooseSize(e){
      if(e.currentTarget.dataset.size ==1){
        this.setData({
          size: e.currentTarget.dataset.size,
          price:this.props.goodsItem.goods_format[0].goods_price / 100,
          sizeText:this.props.goodsItem.goods_format[0].type,
          count:largeCount
        })
      }else if(e.currentTarget.dataset.size ==2){
        this.setData({
          size: e.currentTarget.dataset.size,
          price:this.props.goodsItem.goods_format[1].goods_price / 100,
          sizeText:this.props.goodsItem.goods_format[1].type,
          count:smallCount
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
      let goodsCart = [],arraylist = [],shopcartList=[],carArray=[];
      // 大份
      if(size==1){
       this.props.goodsItem.largeCount ++ 
      }
      // 小份
      if(size==2){
        this.props.goodsItem.smallCount ++
      }
      // 非折扣
      if(e.currentTarget.dataset.key != '折扣'){
        arraylist.push({
          'goods_code':e.currentTarget.dataset.goods_code,
          'goods_format':e.currentTarget.dataset.goods_format,
          'goods_quantity':parseInt(e.currentTarget.dataset.goods_quantity) + 1,
          'goods_price':e.currentTarget.dataset.goods_price
        })
        // 购物车展示的数据
        shopcartList.push({
          'goods_code':e.currentTarget.dataset.goods_code,
          'goods_format':e.currentTarget.dataset.goods_format,
          'goods_quantity':parseInt(e.currentTarget.dataset.goods_quantity) + 1,
          'goods_price':e.currentTarget.dataset.goods_price,
          'goods_img': e.currentTarget.dataset.goods_img,
          'goods_name': e.currentTarget.dataset.goods_name,
          'taste_name': e.currentTarget.dataset.taste_name
        })
      }else{
        //折扣
        arraylist.push({
          'goods_code':e.currentTarget.dataset.goods_code,
          'goods_format':e.currentTarget.dataset.goods_format,
          'goods_quantity':parseInt(e.currentTarget.dataset.goods_quantity + 1)-parseInt(e.currentTarget.dataset.goods_forma[0].goods_discount_user_limit),
          'goods_price':e.currentTarget.dataset.goods_price,
          'goods_type':1
        })
        // 购物车展示的数据
        shopcartList.push({
          'goods_code':e.currentTarget.dataset.goods_code,
          'goods_format':e.currentTarget.dataset.goods_format,
          'goods_quantity':parseInt(e.currentTarget.dataset.goods_quantity + 1)-parseInt(e.currentTarget.dataset.goods_forma[0].goods_discount_user_limit),
          'goods_price':e.currentTarget.dataset.goods_price,
          'goods_img': e.currentTarget.dataset.goods_img,
          'goods_name': e.currentTarget.dataset.goods_name,
          'goods_type':1,
          'taste_name': e.currentTarget.dataset.taste_name
        })
      }
      if(my.getStorageSync({key:'goodsList'}).data!=null){
        let oldArr = my.getStorageSync({key:'goodsList'}).data;
        let oldAllArr = my.getStorageSync({key:'shopcartList'}).data;
        oldArr = oldArr.filter(_item => arraylist.findIndex(value => value.goods_code == _item.goods_code  && value.goods_format == _item.goods_format)== -1);
        oldAllArr = oldAllArr.filter(_item => shopcartList.findIndex(value => value.goods_code == _item.goods_code  && value.goods_format == _item.goods_format)== -1);
        goodsCart = oldArr.concat(arraylist);
        carArray = oldAllArr.concat(shopcartList)
      }else{
       const oldArr =[],oldAllArr=[];
       goodsCart = oldArr.concat(arraylist);
       carArray = oldAllArr.concat(shopcartList)
      } 
      my.setStorageSync({
        key: 'goodsList', 
        data: goodsCart, 
      }); 
      my.setStorageSync({
        key: 'shopcartList', 
        data: carArray, 
      }); 
    }
  },
});
