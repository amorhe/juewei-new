import {imageUrl} from '../../common/js/baseUrl'
Component({
  mixins: [],
  data: {
    showShopcar:false ,  //购物车
    mask:false, //遮罩
    imageUrl,
    modalShow: false //弹框
  },
  props: {},
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    // 打开购物车
    openShopcart(){
      this.setData({
        showShopcar: true,
        mask: true
      })
    },
    hiddenShopcart(){
      this.setData({
        showShopcar: false,
        mask: false
      })
    },
    // 清空购物车
    clearShopcart(){
       this.setData({
        showShopcar: false,
        modalShow: true
      })
    },
    confirmTap(){
      this.setData({
        mask: false,
        modalShow: false
      })
    },
    cancelTap() {
      this.setData({
        mask: false,
        modalShow: false
      })
    }
  },
});
