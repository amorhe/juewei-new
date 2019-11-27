import { imageUrl } from '../common/js/baseUrl'
Page({
  data: {
    imageUrl,
    redir:''
  },
  onLoad(options) {
    if(options.redir && options.redir!=''){
       this.setData({
         redir:options.redir
       })
    }
  },
  reloadTap() {
    if(this.data.redir!=''){
      my.redirectTo({
        url: '/'+this.data.redir
      })
    }else{
      my.reLaunch({
        url: '/pages/position/position'
      })
    }
    
  }
});
