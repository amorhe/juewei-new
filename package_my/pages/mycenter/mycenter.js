Page({
  data: {
    items: [
      {
        title: '单行列表',
        extra: '详细信息',
      },
      {
        title: '单行列表',
        extra: '详细信息',
      },
      {
        title: '单行列表',
        extra: '详细信息',
      }
    ],
  },
  onLoad() {
    // my.dataPicker
    // my.chooseCity
  },
  onShow() {
    // 页面显示 每次显示都执行
     my.alert({ title: 'onShow=='+app.globalData.authCode });

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
