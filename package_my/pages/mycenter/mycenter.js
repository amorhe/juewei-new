Page({
  data: {
    showTop: false,
    modalOpened: false,
  },
  onLoad() {
    // my.dataPicker
    // my.chooseCity
  },
  onShow() {
    // 页面显示 每次显示都执行
     my.alert({ title: 'onShow=='+app.globalData.authCode });

  },
  // 生日选择器
  Taptime(){
    console.log('ss')
    my.datePicker({
      currentDate: '',
      startDate: '1950-1-1',
      endDate: '',
      success: (res) => {
        console.log(res)
      },
    });
  },
  Select(){
  
  },
  // 姓别选择器显示/隐藏
  onTopBtnTap() {
    this.setData({
      showTop: true,
    });
  },
  onPopupClose() {
    this.setData({
      showTop: false,
    });
  },
  // 退出登录
  outLogin(){
    this.setData({
      modalOpened: true,
    });
  },
  onModalClick() { // 确认
    this.setData({
      modalOpened: false,
    });
  },
  onModalClose() { // 取消
    this.setData({
      modalOpened: false,
    });
  },
  onReady() {
    // 页面加载完成 只加载一次 页面初始化用
    console.log('onready');
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  }
});
