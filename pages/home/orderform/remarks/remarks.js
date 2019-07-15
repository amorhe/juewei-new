Page({
  data: {
    remarks:''
  },
  onLoad() {},
  inputRemarks(e){
    this.setData({
      remarks: e.detail.value
    })
  }
});
