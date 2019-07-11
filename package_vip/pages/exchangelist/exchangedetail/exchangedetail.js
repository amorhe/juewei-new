import{imageUrl} from '../../../../pages/common/js/baseUrl'
Page({
  data: {
    imageUrl
  },
  onLoad() {
    my.setNavigationBar({
      title: '兑换记录',
      backgroundColor: '#F5402B',
      success() {
      
      },
      fail() {
       
      },
    });
  },
});
