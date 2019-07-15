Component({
  mixins: [],
  data: {
    
  },
  props: {
    mask:'',
    modalShow:'',
    content:'',
    title:'',
    onCounterPlusOne: (data) => console.log(data),
    confirmButtonText:'确认',
    cancelButtonText: '取消'
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    confirmTap(){
      const modalObj = {
        modalShow:false,
        mask:false
      }
      this.props.onCounterPlusOne(modalObj)
    },
    cancelTap() {
      const modalObj = {
        modalShow:false,
        mask:false
      }
      this.props.onCounterPlusOne(modalObj)
    },
    hiddenShopcart(){
      const modalObj = {
        modalShow:false,
        mask:false
      }
      this.props.onCounterPlusOne(modalObj)
    },
  },
});
