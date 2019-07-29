Component({
  mixins: [],
  data: {
    
  },
  props: {
    mask:'',   // 遮罩
    modalShow:'',   // 提示框
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
       let modalObj = {};
       let isType = ''
      if(this.props.isType=="clearShopcart"){
        isType = 'clearShopcart'
      }
      if(this.props.isType=="orderConfirm"){
        isType = 'orderConfirm'
      } 
      if(this.props.isType == "noShop"){
        isType = 'noShop'
      }
      
      modalObj = {
        modalShow:false,
        mask:false,
        type:1,
        isType:isType
      }
      this.props.onCounterPlusOne(modalObj)
    },
    cancelTap() {
      const modalObj = {
        modalShow:false,
        mask:false,
        type:0
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
