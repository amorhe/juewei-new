import { imageUrl } from '../../../pages/common/js/baseUrl'
import { ajax, log } from '../../../pages/common/js/li-ajax'
Page({
  data: {
    imageUrl,
    userPoint:0,
    list: []
  },
  async onLoad() {
    await this.getDetail()
    await this.getUserPoint()
  },

  /**
   * @function 获取积分详情
   */
  async getDetail() {
    let res = await ajax('/mini/point_exchange/point_list', {}, 'GET')
    if (res.code === 100) {
      this.setData({
        list: res.data.data
      })
    }
  },
  toUrl(e) {
    var url = e.currentTarget.dataset.url
    my.navigateTo({
      url: url
    });
  },

  async getUserPoint(){
    let {_sid} = this.data;
    let res = await ajax('/mini/user/user_point',{_sid})
    if(res.CODE === 'A100'){
      this.setData({
        userPoint:res.DATA
      })
    }
  },
});
