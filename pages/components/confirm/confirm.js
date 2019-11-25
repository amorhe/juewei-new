Component({
  mixins: [],
  data: {

  },
  props: {
    mask: '',   // 遮罩
    modalShow: '',   //提示框
    content: '',
    title: '',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    onCounterPlusOne: (data) => console.log(data),
  },
  onInit() { },
  deriveDataFromProps() { },
  didMount() { },
  didUpdate() { },
  didUnmount() { },
  methods: {
    confirmTap() {
      let modalObj = {};
      let isType = ''
      if (this.props.isType == "clearShopcart") {
        isType = 'clearShopcart'
      }
      if (this.props.isType == "orderConfirm") {
        isType = 'orderConfirm'
      }
      if (this.props.isType == "noShop") {
        isType = 'noShop'
      }

      modalObj = {
        modalShow: false,
        mask: false,
        type: 1,
        isType: isType
      }
      this.props.onCounterPlusOne(modalObj)
    },
    cancelTap() {
      let isType = '';
      if (this.props.isType == "checkshopcart") {
        isType = 'checkshopcart'
      }
      if (this.props.isType == "orderConfirm") {
        isType = 'orderConfirm'
      }
      const modalObj = {
        modalShow: false,
        mask: false,
        type: 0,
        isType: isType
      }
      this.props.onCounterPlusOne(modalObj)
    },
    hiddenShopcart() {
      const modalObj = {
        modalShow: false,
        mask: false
      }
      this.props.onCounterPlusOne(modalObj)
    },
    touchstart() {

    }
  },
});
