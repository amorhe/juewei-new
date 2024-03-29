import { imageUrl, mySet, myGet } from '../../common/js/baseUrl'
var app = getApp();
Component({
  mixins: [],
  data: {
    imageUrl,
    size: 999,
    goodsIndex: '',
    price: 0,
    sizeText: '',
    goods_activity_code: '',
    goods_discount: 0,
    goods_original_price: 0,
    goods_discount_user_limit: 0,
    shopcartAll: [],
  },
  props: {
    onCloseModal: (data) => console.log(data),
    onGetShopList: (data) => console.log(data),
    onCart: (data) => console.log(data)
  },
  onInit() {

  },
  didMount() {

  },
  deriveDataFromProps(nextProps) {
    // console.log(nextProps)
    let goodsList = my.getStorageSync({ key: 'goodsList' }).data;
    this.setData({
      goodsList
    })
  },
  didUpdate(prevProps, prevData) {

  },
  didUnmount() {

  },
  methods: {
    // 选择商品规格
    chooseSize(e) {
      this.setData({
        size: e.currentTarget.dataset.size,
        price: this.props.goodsItem.goods_format[e.currentTarget.dataset.size].goods_price,
        sizeText: this.props.goodsItem.goods_format[e.currentTarget.dataset.size].type,
        goods_activity_code: this.props.goodsItem.goods_format[e.currentTarget.dataset.size].goods_activity_code,
        goods_discount: this.props.goodsItem.goods_format[e.currentTarget.dataset.size].goods_discount,
        goods_original_price: this.props.goodsItem.goods_format[e.currentTarget.dataset.size].goods_original_price,
        goods_discount_user_limit: this.props.goodsItem.goods_format[e.currentTarget.dataset.size].goods_discount_user_limit,
        goods_order_limit: this.props.goodsItem.goods_format[e.currentTarget.dataset.size].goods_order_limit
      })
    },
    closeModal(data) {
      const goodsModalObj = {
        maskView: false,
        goodsModal: false
      }
      this.props.onCloseModal({
        detail: goodsModalObj
      });
      // 重新选择商品
      this.setData({
        size: 999
      })
    },
    onCart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price) {
      let data = {
        goodlist,
        shopcartAll,
        priceAll,
        shopcartNum,
        priceFree,
        repurse_price
      }
      this.props.onCart({
        detail: data
      });
    },
    addshopcart(e) {
      if (this.data.size == 999) {
        return
      }
      let goods_car = {};
      let goods_code = e.currentTarget.dataset.goods_code;
      let goods_format = e.currentTarget.dataset.goods_format;
      let types = [];
      e.currentTarget.dataset.goods_format_all.forEach(item => {
        types.push(item.type);
      })
      let goodlist = my.getStorageSync({ key: 'goodsList' }).data || {};
      let sumnum = 0;
      for (let i = 0; i < types.length; i++) {
        if (goodlist[`${goods_code}_${types[i]}`]) {
          sumnum += goodlist[`${goods_code}_${types[i]}`].num;
        }
      }
      sumnum += 1;
      // 统计总数
      for (let i = 0; i < types.length; i++) {
        if (goodlist[`${goods_code}_${types[i]}`]) {
          goodlist[`${goods_code}_${types[i]}`].sumnum = sumnum
        }
      }
      if (goodlist[`${goods_code}_${goods_format}`]) {
        goodlist[`${goods_code}_${goods_format}`].num++;
      } else {
        let oneGood = {};
        console.log(e.currentTarget.dataset);
        if (e.currentTarget.dataset.goods_discount) {
          oneGood = {
            "goods_name": e.currentTarget.dataset.goods_name,
            "taste_name": e.currentTarget.dataset.taste_name,
            "goods_price": parseInt(e.currentTarget.dataset.goods_price),
            "num": 1,
            "sumnum": sumnum,
            "goods_code": e.currentTarget.dataset.goods_code,
            "goods_activity_code": e.currentTarget.dataset.goods_activity_code,
            "goods_discount": e.currentTarget.dataset.goods_discount,
            "goods_original_price": e.currentTarget.dataset.goods_original_price,
            "goods_discount_user_limit": e.currentTarget.dataset.goods_discount_user_limit,
            "goods_order_limit": e.currentTarget.dataset.goods_order_limit,
            "goods_format": goods_format,
            "goods_img": e.currentTarget.dataset.goods_img,
            "sap_code": e.currentTarget.dataset.sap_code
          }
        } else {
          oneGood = {
            "goods_name": e.currentTarget.dataset.goods_name,
            "taste_name": e.currentTarget.dataset.taste_name,
            "goods_price": parseInt(e.currentTarget.dataset.goods_price),
            "num": 1,
            "sumnum": sumnum,
            "goods_code": e.currentTarget.dataset.goods_code,
            "goods_format": goods_format,
            "goods_img": e.currentTarget.dataset.goods_img,
            "sap_code": e.currentTarget.dataset.sap_code,
            "huangou": e.currentTarget.dataset.huangou
          }
        }
        goodlist[`${goods_code}_${goods_format}`] = oneGood;
      }
      let shopcartAll = [], priceAll = 0, shopcartNum = 0, priceFree = 0, repurse_price = 0;
      for (let keys in goodlist) {
        if (!goodlist[keys].goods_price) {
          continue;
        }
        if (e.currentTarget.dataset.goods_discount) {
          if (goodlist[keys].goods_order_limit && goodlist[keys].goods_order_limit != null && goodlist[`${e.currentTarget.dataset.goods_code}_${goods_format}`].num > e.currentTarget.dataset.goods_order_limit) {
            my.showToast({
              content: `折扣商品限购${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}，超过${e.currentTarget.dataset.goods_order_limit}${e.currentTarget.dataset.goods_unit}恢复原价`
            })
          }
        }
        if (goodlist[keys].goods_order_limit && goodlist[keys].goods_order_limit != null && goodlist[keys].num > goodlist[keys].goods_order_limit) {
          priceAll += parseInt(goodlist[keys].goods_price) * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
          if (keys.indexOf('PKG') == -1) {
            priceFree += (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
          }
        } else if (goodlist[keys].goods_price && goodlist[keys].num) {
          priceAll += parseInt(goodlist[keys].goods_price) * goodlist[keys].num;
        } else {

        }
        // 计算包邮商品价格
        if (!goodlist[keys].goods_discount) {
          priceFree += goodlist[keys].goods_price * goodlist[keys].num;
        }
        // 计算可换购商品价格
        if (app.globalData.repurseGoods && app.globalData.repurseGoods.length > 0) {
          if (goodlist[keys].huangou && goodlist[keys].goods_price && goodlist[keys].num) {
            repurse_price += goodlist[keys].goods_price * goodlist[keys].num;
          }
        } else {
          repurse_price = priceAll
        }
        shopcartAll.push(goodlist[keys]);
        shopcartNum += goodlist[keys].num
      }
      this.setData({
        goodsList: goodlist,
        shopcartAll
      })
      this.onCart(goodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price);
      mySet('goodsList', goodlist)

    },
    reduceshopcart(e) {
      let code = e.currentTarget.dataset.goods_code;
      let format = e.currentTarget.dataset.goods_format
      let goodlist = my.getStorageSync({ key: 'goodsList' }).data;
      let types = [];
      e.currentTarget.dataset.goods_format_all.forEach(item => {
        types.push(item.type);
      })
      for (let i = 0; i < types.length; i++) {
        if (goodlist[`${code}_${types[i]}`]) {
          goodlist[`${code}_${types[i]}`].sumnum -= 1;
        }
      }
      goodlist[`${code}_${format}`].num -= 1;
      let shopcartAll = [], priceAll = 0, shopcartNum = 0, priceFree = 0, repurse_price = 0,newGoodlist = {};
      for (let keys in goodlist) {
        if (!goodlist[keys].goods_price) {
          continue;
        }
        if (goodlist[keys].goods_order_limit && goodlist[keys].goods_order_limit != null && goodlist[keys].num > goodlist[keys].goods_order_limit) {
          priceAll += parseInt(goodlist[keys].goods_price) * goodlist[keys].goods_order_limit + (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
          if (keys.indexOf('PKG') == -1) {
            priceFree += (goodlist[keys].num - goodlist[keys].goods_order_limit) * goodlist[keys].goods_original_price;
          }
        } else if (goodlist[keys].goods_price && goodlist[keys].num) {
          priceAll += parseInt(goodlist[keys].goods_price) * goodlist[keys].num;
        } else {
          //不做处理
        }
        // 计算包邮商品价格
        if (!goodlist[keys].goods_discount) {
          priceFree += goodlist[keys].goods_price * goodlist[keys].num;
        }
        // 计算可换购商品价格
        if (app.globalData.repurseGoods && app.globalData.repurseGoods.length > 0) {
          if (goodlist[keys].huangou && goodlist[keys].goods_price && goodlist[keys].num) {
            repurse_price += goodlist[keys].goods_price * goodlist[keys].num;
          }
        } else {
          repurse_price = priceAll
        }
        if (goodlist[keys].num > 0) {
          newGoodlist[keys] = goodlist[keys];
          shopcartAll.push(goodlist[keys]);
          shopcartNum += goodlist[keys].num;
        }
      }
      this.onCart(newGoodlist, shopcartAll, priceAll, shopcartNum, priceFree, repurse_price)
      this.setData({
        goodsList: newGoodlist,
        shopcartAll
      })
      mySet('goodsList', newGoodlist)
    },
    touchstart() {

    }
  },
});
