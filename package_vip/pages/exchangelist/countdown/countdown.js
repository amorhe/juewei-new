Component({
  mixins: [], // minxin 方便复用代码
  data: {
    timer: null
  }, // 组件内部数据
  onInit() { // 组件创建时触发
    this.setData({
      timeCounter: this.props.item,
      index: this.props.index
    })
  },
  props: {
  }, // 可给外部传入的属性添加默认值
  didMount() {
    let interval = 0;
    if (this.data.timeCounter.remaining_pay_minute > -1) {
      interval = setInterval(() => {
        let orderInfo = this.data.timeCounter;
        let newSec = --orderInfo.remaining_pay_second;
        let newMin = orderInfo.remaining_pay_minute;
        // 秒小于0后重置为59，分钟减去1
        if (newSec < 0) {
          --newMin
          newSec = 59
        }
        // 倒计时结束清除计数器
        if (newSec == 59 && newMin < 0) {
          clearInterval(interval);
          this.props.onZero(this.data.index);
        }
        this.setData({
          'timeCounter.remaining_pay_second': newSec,
          'timeCounter.remaining_pay_minute': newMin,
        })
      }, 1000)
      this.setData({
        timer: interval
      })
    }
  }, // 生命周期函数
  didUpdate() { },
  didUnmount() {
    clearInterval(this.data.timer)
  },
  methods: {   // 自定义方法
    /**
     * 点击去支付的方法
     */
    onPayNow() {
      this.props.onPayNow()
    },
    /**
     * 清除循环
     */
    fun() {
      clearInterval(this.data.timer)
    }
  },
})