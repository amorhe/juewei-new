import {imageUrl} from '../../common/js/baseUrl'
Component({
  mixins: [],
  data: {
    imageUrl,
    size:0
  },
  props: {
    maskView:'',
    goodsModal:'',
    onCloseModal: (data) => console.log(data),
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    // 选择商品规格
    chooseSize(e){
      this.setData({
        size: e.currentTarget.dataset.size
      })
    },
    closeModal(data){
      const goodsModalObj = {
        maskView:false,
        goodsModal:false
      }
      this.props.onCloseModal(goodsModalObj)
    },
    hiddenModal(){
      
    }
  },
});
