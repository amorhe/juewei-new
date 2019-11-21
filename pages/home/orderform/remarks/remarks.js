var app = getApp();
Page({
  data: {
    remarks:''
  },
  onLoad() {},
	onShow() {
		if (app.globalData.remarks) {
      this.setData({
        remarks: app.globalData.remarks
      })
    }
	},
  inputRemarks(e){
    this.setData({
      remarks: e.detail.value
    })
  },
  remarksBtn(){
    // my.setStorageSync({
    //   key: 'remark', // 缓存数据的key
    //   data: this.data.remarks // 要缓存的数据
    // });
    app.globalData.remarks = this.data.remarks;
    my.navigateBack({
      url: '/pages/home/orderform/orderform'
    });
  }
});
