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
    my.setStorageSync({
      key: 'remark', // 缓存数据的key
      data: this.data.remarks // 要缓存的数据
    });
    my.navigateBack({
      url: '/pages/home/orderform/orderform'
    });
  }
});
