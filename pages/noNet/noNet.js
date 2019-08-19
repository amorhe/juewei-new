import { imageUrl } from '../common/js/baseUrl'
Page({
  data: {
    imageUrl
  },
  onLoad() {

  },
  reloadTap() {
    my.reLaunch({
      url: '/pages/position/position'
    })
  }
});
