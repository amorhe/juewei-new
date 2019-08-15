import { imageUrl } from '../common/js/baseUrl'
Page({
  data: {
    imageUrl
  },
  onLoad() { },
  goselecttarget(){
      my.reLaunch({
        url: '/pages/home/selecttarget/selecttarget'
      })
  },
  goreload(){
      my.reLaunch({
          url: '/pages/position/position'
      })
  }
});
