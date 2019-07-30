import { imageUrl, imageUrl2 } from '../../common/js/baseUrl'
import { ajax, getSid, log } from '../../common/js/li-ajax'

Page({
  data: {
    imageUrl,
    imageUrl2,

    toast: false,

    _sid: '',

    menuTop: 0,
    menuFixed: false,

    shop_id: 181,
    district_id: 110105,
    cate_id: 25,
    page_num: 1,
    page_size: 100,
    company_id: 1,
    city_id: 110100,
    release_channel: 1,

    cur: 0,

    userPoint: '',

    bannerList: [],

    positionList: [],


    list: [],

    goodsList:[],



  },
  async onShow() {
    this.getBanner()
    this.getPositionList()
    this.getUserPoint()

    let _sid = await getSid()

    this.setData({
      _sid
    })

    await this.getCategory()
    await this.getGoodsList()
    // this.initClientRect()


  },

  /**
   * @function 修改分类
   */
  listChange(event) {
    const { list } = this.data;
    const { cur } = event.currentTarget.dataset;
    this.setData({ cur, cate_id: list[cur].id }, () => this.getGoodsList())
  },

  /**
   * @function 获取分类
   */
  async getCategory() {
    const { cur } = this.data;
    let res = await ajax('/mini/vip/wap/category/category', { type: 1 })
    if (res.code === 100) {
      this.setData({ list: res.data, cate_id: res.data[cur].id })
    }
  },

  /**
   * @function 获取轮播
   */
  async getBanner() {
    const { city_id, district_id, release_channel } = this.data;
    const bannerListOption = { city_id, district_id, release_channel }
    let res = await ajax('/mini/vip/wap/banner/banner_list', bannerListOption)
    if (res.code === 100) {
      this.setData({ bannerList: res.data })
    }
  },

  /**
   * @function 获取商品列表
   */
  async getGoodsList() {
    let {
      shop_id,
      district_id,
      city_id,
      cate_id,
      page_num,
      page_size,
    } = this.data;


    let goodslistOption = {
      shop_id,
      district_id,
      city_id,
      cate_id,
      page_num,
      page_size
    }
    let res = await ajax('/mini/vip/wap/goods/goods_list', goodslistOption)
    if (res.code === 100) {
      this.setData({
        goodsList: res.data.data
      })
    }
  },

  /**
   * @function 获取位置列表
   */
  async getPositionList() {
    let { city_id, district_id, company_id, release_channel } = this.data;
    let positionListOption = { city_id, district_id, company_id, release_channel }
    let res = await ajax('/mini/vip/wap/show_position/list', positionListOption)
    if (res.code === 100) {
      this.setData({
        positionList: res.data
      })
    }
  },

  /**
   * @function 获取用户积分
   */
  async getUserPoint() {
    let { _sid } = this.data;
    let res = await ajax('/mini/user/user_point', { _sid })
    if (res.CODE === 'A100') {
      this.setData({
        userPoint: res.DATA
      })
    }
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

  /**
   * @function 跳转详情页面
   */
  toDetail(e) {
    const { id } = e.currentTarget.dataset
    my.navigateTo({
      url: '../../../package_vip/pages/detail/detail?id=' + id
    });
  },

  /**
   * @function 跳转兑换列表页面
   */
  toExchangeList() {
    my.navigateTo({
      url: '../../../package_vip/pages/exchangelist/exchangelist'
    });
  },


  // initClientRect() {
  //    my
  //    .createSelectorQuery()
  //     .select('#affix')
  //     .boundingClientRect()
  //     .exec(res=> {
  //       log(res)
  //       this.setData({
  //         menuTop: res[0].top
  //       })
  //     })
  //   },
  // onPageScroll: function(scroll) {
  //   if (this.data.menuFixed === (scroll.scrollTop > this.data.menuTop)) return;
  //   this.setData({
  //     menuFixed: (scroll.scrollTop > this.data.menuTop)
  //   })
  // }

  isloginFn() {

    my.navigateTo({
      url: '/pages/login/auth/auth'
    });

  },

});
