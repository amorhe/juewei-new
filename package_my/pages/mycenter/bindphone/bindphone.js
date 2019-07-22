Page({
  data: {
    focus: false,
    value:'',
    type:'1',
  },
  onLoad() {},
  bindFocus() {
    // blur 事件和这个冲突
    console.log(this.data.focus)
    setTimeout(() => {
      this.onFocus();
    }, 100);
  },
  onFocus() {
    this.setData({
      focus: true,
    });
  },
  onBlur() {
    this.setData({
      focus: false,
    });
  },
  inputValue(e){
    var value = e.detail.value
    this.setData({
      value:value
    })
    console.log(value)
  },
  //页面跳转
  toUrl(e){
    var url = e.currentTarget.dataset.url
    my.navigateTo({
      url:url
    });
  },
});
