import { imageUrl } from '../../../../pages/common/js/baseUrl'
import { log } from '../../../../pages/common/js/li-ajax'
Page({
  data: {
    imageUrl,

    writeAddress:false,


    // 地址
    name: '',

    sex: 0,

    phone: '',

    address: '',

    labelList: ['学校', '家', '公司'],

    curLabel: 0,

    selectAddress: false,
    
  },
  async onLoad() {
  },

  stop(e) {
    e.cancelBubble = true
    log(e)
  },


});
