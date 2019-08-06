import { imageUrl } from '../../../pages/common/js/baseUrl'
import { ajax, log,isloginFn } from '../../../pages/common/js/li-ajax'
Page({
  data: {
    imageUrl,
    userPoint:0,
    list: [],
    toast:false,
    loginOpened: false,
    pagenum:1,
    pagesize:10,

    finish:false
  },
  async onLoad() {
    await this.getDetail(1)
    await this.getUserPoint()
  },

  onHide(){
    this.onModalClose()
    this.hideToast()
  },
  isloginFn,


  async onReachBottom() {
    // 页面被拉到底部
    let { pagenum } = this.data
    ++pagenum
    await this.getDetail(pagenum)
    this.setData({
      pagenum
    })
  },

  /**
   * @function 获取积分详情
   */
  async getDetail(pagenum) {
    let {list,pagesize} = this.data
    let res = await ajax('/mini/point_exchange/point_list', {pagenum,pagesize}, 'GET')
    if (res.code === 100) {
      if(res.data.pagination.lastLage < pagenum){return}
      if(res.data.data.length == 0){return}
      this.setData({
        list: [...list,...res.data.data],
        finish:true
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
    let res = await ajax('/mini/user/user_point',{})
    if(res.CODE === 'A100'){
      this.setData({
        userPoint:res.DATA
      })
    }else{
      this.setData({
        loginOpened:true
      })
    }
  },

  /**
   * @function 关闭modal
   */
  onModalClose() {
    this.setData({
      openPoint: false,
      modalOpened: false,
      loginOpened: false
    })
  },

  /**
   * @function 显示冻结积分
   */
  showToast() {
    this.setData({ toast: true })
  },

  /**
   * @function 隐藏冻结积分
   */
  hideToast() {
    this.setData({ toast: false })
  },
});
