import {imageUrl} from '../../common/js/baseUrl'
Page({
  data: {
    imageUrl
  },
  onLoad() {},
  continue(){
    my.switchTab({
      url: '/pages/home/goodslist/goodslist', // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
      success: (res) => {
        
      },
    });
  }
});
