import {imageUrl} from '../../common/js/baseUrl'
Component({
  mixins: [],
  data: {
    scroll_y:false, 
    imageUrl,
    goodsType:1, //系列
    toActive:1, // 锚点
    
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
  },
  didUnmount() {},
  methods: {
    // 选择系列
    chooseGoodsType(e) {
      this.setData({
        goodsType: e.currentTarget.dataset.type,
        toActive: e.currentTarget.dataset.type
      })
    }
  }
});
