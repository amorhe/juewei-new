import { imageUrl } from '../../common/js/baseUrl'
import { ajax } from '../../common/js/li-ajax'

const log = console.log

Page({
  data: {
    imageUrl
  },
  onLoad() {
    this.getBanner()
  },

  async getBanner() {
    let res = await ajax('/mini/vip/wap/banner/banner_list')
    log(res)
  }
});
