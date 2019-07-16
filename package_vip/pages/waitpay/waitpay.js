import { imageUrl } from '../../../pages/common/js/baseUrl'
import { log } from '../../../pages/common/js/li-ajax'
Page({
  data: {
    imageUrl,

    // 地址
    name: '',

    sex: 0,

    phone: '',

    address: '',

    selectAddress: false,
    
  },
  async onLoad(id) {
  },

  stop(e) {
    e.cancelBubble = true
    log(e)
  },


});
