Page({
  data: {
    code:''
  },
  onLoad() {},
  writeCode(e){
    this.setData({
      code: e.detail.value
    })
  }
});
