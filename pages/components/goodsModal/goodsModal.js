import {imageUrl} from '../../common/js/baseUrl'
Component({
  mixins: [],
  data: {
    imageUrl,
    size:999,
    goodsIndex:'',
    price:0,
    sizeText:'',
    goods_activity_code:'',
    goods_discount:0,
    goods_original_price:0,
    goods_discount_user_limit:0,
    goods_format_all:'',
    goodsList:{},
    shopcartAll:[]
  },
  props: {
    onCloseModal: (data) => console.log(data),
    onGetShopList: (data) => console.log(data),
    onCart: (data) => console.log(data)
  },
  onInit(){
    let goodsList = my.getStorageSync({key:'goodsList'}).data;
    this.setData({
      goodsList
    })
  },
  didMount() {
 
  },
   deriveDataFromProps(nextProps){
    // console.log(nextProps)
  },
  didUpdate(prevProps, prevData) {
    
  },
  didUnmount() {
   
  },
  methods: {
    // 选择商品规格
    chooseSize(e){
      this.setData({
          size: e.currentTarget.dataset.size,
          price:this.props.goodsItem.goods_format[e.currentTarget.dataset.size].goods_price / 100,
          sizeText:this.props.goodsItem.goods_format[e.currentTarget.dataset.size].type,
          goods_activity_code:this.props.goodsItem.goods_format[e.currentTarget.dataset.size].goods_activity_code,
          goods_discount:this.props.goodsItem.goods_format[e.currentTarget.dataset.size].goods_discount,
          goods_original_price:this.props.goodsItem.goods_format[e.currentTarget.dataset.size].goods_original_price,
          goods_discount_user_limit:this.props.goodsItem.goods_format[e.currentTarget.dataset.size].goods_original_price,
          goods_format_all:this.props.goodsItem.goods_format
        })
    },
    closeModal(data){
      const goodsModalObj = {
        maskView:false,
        goodsModal:false
      }
      this.props.onCloseModal(goodsModalObj);
      // 重新选择商品
      this.setData({
        size:999
      })
    },
    onCart(goodsList,shopcartAll){
       this.props.onCart(goodsList,shopcartAll);
    },
    addshopcart(e){
      let goods_car={};
      let goods_code = e.currentTarget.dataset.goods_code;
      let goods_format = e.currentTarget.dataset.goods_format;
      let types = [];
      e.currentTarget.dataset.goods_format_all.forEach(item => {
        types.push(item.type);
      })
      let goodlist = my.getStorageSync({key:'goodsList'}).data || {};
      let sumnum=0;
      for(let i=0;i< types.length;i++){
        if(goodlist[`${goods_code}_${types[i]}`]){
          sumnum += goodlist[`${goods_code}_${types[i]}`].num;
        }
      }
      sumnum+=1;
      // 统计总数
      for(let i=0;i< types.length;i++){
          if(goodlist[`${goods_code}_${types[i]}`]){
            goodlist[`${goods_code}_${types[i]}`].sumnum = sumnum
          }
      }
      if(goodlist[`${goods_code}_${goods_format}`]){
        goodlist[`${goods_code}_${goods_format}`].num++;  
      }else{
        let oneGood ={};
        if(e.currentTarget.dataset.key !="折扣"|| e.currentTarget.dataset.key!="套餐"){
          oneGood = {
            "goods_name": e.currentTarget.dataset.goods_name,
            "taste_name": e.currentTarget.dataset.taste_name,
            "goods_price": e.currentTarget.dataset.goods_price * 100,
            "num": 1,
            "sumnum": sumnum,
            "goods_code":e.currentTarget.dataset.goods_code,
            "goods_format":goods_format
          }
        }else{
          oneGood = {
            "goods_name": e.currentTarget.dataset.goods_name,
            "taste_name": e.currentTarget.dataset.taste_name,
            "goods_price": e.currentTarget.dataset.goods_price * 100,
            "num": 1,
            "sumnum": sumnum,
            "goods_code": e.currentTarget.dataset.goods_code,
            "goods_activity_code": e.currentTarget.dataset.goods_activity_code,
            "goods_discount": e.currentTarget.dataset.goods_discount,
            "goods_original_price": e.currentTarget.dataset.goods_original_price,
            "goods_discount_user_limit": e.currentTarget.dataset.goods_discount_user_limit,
            "goods_format":goods_format
          }
        }
        goodlist[`${goods_code}_${goods_format}`]  = oneGood;
      }
      console.log(goodlist)
       let shopcartAll = [];
      for(let keys in goodlist){
        shopcartAll.push(goodlist[keys])
      }
      this.setData({
        goodsList:goodlist,
        shopcartAll
      })
      this.onCart(goodlist,shopcartAll);
      my.setStorageSync({
        key: 'goodsList', // 缓存数据的key
        data: goodlist, // 要缓存的数据
      });

    },
    reduceshopcart(e){
      let code = e.currentTarget.dataset.goods_code;
      let format = e.currentTarget.dataset.goods_format
      let goodlist = my.getStorageSync({key:'goodsList'}).data;
      let types = [];
      e.currentTarget.dataset.goods_format_all.forEach(item => {
        types.push(item.type);
      })
      for(let i=0;i< types.length;i++){
        if(goodlist[`${code}_${types[i]}`]){
           goodlist[`${code}_${types[i]}`].sumnum -= 1;
        }
      }
      goodlist[`${code}_${format}`].num -=1;
      let shopcartAll = [];
      // 删除
      if(goodlist[`${code}_${format}`].num==0){
        shopcartAll = this.data.shopcartAll.filter(item => `${item.goods_code}_${item.goods_format}` != `${code}_${format}`)
        delete(goodlist[`${code}_${format}`]);
      }else{
         shopcartAll = this.data.shopcartAll
      }
      this.onCart(goodlist,shopcartAll)
      this.setData({
        goodsList:goodlist,
        shopcartAll
      })
      my.setStorageSync({
        key: 'goodsList', // 缓存数据的key
        data: goodlist, // 要缓存的数据
      });
    }
  },
});
