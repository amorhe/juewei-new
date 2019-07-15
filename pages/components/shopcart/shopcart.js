import {imageUrl} from '../../common/js/baseUrl'
Component({
  mixins: [],
  data: {
    scroll_y:false, 
    imageUrl,
    goodsType:0, //系列
    maskView:false,
    goodsModal:false,
    scrollT:0
  },
  props: {
    scrollY:""
  },
  onInit() {
  },
  didMount() {},
  didUpdate() {
    this.setData({
      scroll_y:this.props.scrollY
    })
    if(!this.props.scrollY) {
      this.setData({
        goodsType:0
      })
    }
  },
  didUnmount() {},
  methods: {
    // 选择系列
    chooseGoodsType(e) {
      my.pageScrollTo({
        scrollTop: 610
      })
      this.setData({
        goodsType: e.currentTarget.dataset.type
      })
    },
    // 选择规格
    chooseSizeTap(){
      this.setData({
        maskView:true,
        goodsModal:true
      })
    },
    closeModal(data){
      this.setData({
        maskView:data.maskView,
        goodsModal:data.goodsModal
      })
    },
    scrollEvent(e){
      // 套餐
      // my.createSelectorQuery().select('.taocan').boundingClientRect().exec((ret)=>{
      //  if(ret[0].top<114) {
      //   this.setData({
      //     goodsType: 2
      //   })
      //  }
      // })
      // 爆款
      // my.createSelectorQuery().select('.baokuan').boundingClientRect().exec((ret)=>{
      //  if(ret[0].top<114) {
      //   this.setData({
      //     goodsType: 3
      //   })
      //  }
      // })
    }
  }
});
