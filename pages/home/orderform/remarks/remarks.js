Page({
  data: {
    remarks:''
  },
  onLoad() {},
  inputRemarks(e){
    this.setData({
      remarks: e.detail.value
    })
  },
  remarksBtn(){
    my.navigateBack({
      url: '/pages/home/orderform/orderform?remarks=' + this.data.remarks 
    });
  }
});
