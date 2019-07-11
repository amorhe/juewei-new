import { imageUrl, imageUrl2 } from '../../common/js/baseUrl'
import { ajax } from '../../common/js/li-ajax'

const log = console.log


Page({
  data: {
    imageUrl,
    imageUrl2,

    toast: false,

    menuTop: 0,
    menuFixed: false,

    bannerList: [
      {
        "pic_src": "/static/check/image/goods_point/pjq1JNVftcaXFkCf.jpg",
        "sort_no": "1",
        "link_url": "#"
      }
    ],

    bannerListOption: {
      company_id: 1,
      city_id: 110100,
      district_id: 110105,
      release_channel: 2
    },

    positionList:[
        {
            "id": "1",
            "pic_src": [
                "/static/check/image/goods_point/pi3mYEDeB4IlO73l.jpg"
            ],
            "link_url": [
                "111"
            ],
            "sort_no": "1",
            "type": "1"
        }
    ],

    list: [{
      "id": "24",
      "cate_name": "vip二期优化",
      "sort_no": "2"
    }, {
      "id": "25",
      "cate_name": "绝味专享",
      "sort_no": "2"
    }],



    goodslistOption: {
      shop_id: 181,
      district_id: 110105,
      city_id: 0,
      cate_id: 25,
      page_num: 1,
      page_size: 100,
    },

    cur: 0,

    goodsList:
      [
        {
          "id": "355",
          "goods_name": "123",
          "total_num": "1",
          "valid_num": "1",
          "cate_id": "25",
          "goods_type": "2",
          "goods_detail_type": "4",
          "exchange_type": "1",
          "amount": "0",
          "point": "1",
          "start_time": "2019-06-22 00:00:00",
          "end_time": "2019-07-31 23:59:59",
          "company_id": "0",
          "city_id": "1",
          "district_id": "0",
          "goods_pic": "\/static\/check\/image\/goods_point\/oXQW34ZBT6Pcbkx0.jpg",
          "exchange_day_vaild_num": 1
        }
      ],



  },
  onLoad() {
    this.getBanner()
    this.getCategory()
    this.getGoodsList()
    // this.initClientRect()

    my.setNavigationBar({
      title: 'VIP专享',
      backgroundColor: '#FB5332',
      success() {

      },
      fail() {

      },
    });
  },

  listChange(event) {
    let { goodslistOption, list } = this.data;
    const { cur } = event.currentTarget.dataset;
    goodslistOption = { ...goodslistOption, cate_id: list[cur].id }
    this.setData({ cur, goodslistOption },() => this.getGoodsList())
  },

  async getCategory() {
    let res = await ajax('/mini/vip/wap/category/category', { type: 1 })
    if (res.code === 100) {
      this.setData({ list: res.data })
    }
  },

  async getBanner() {
    const { bannerListOption } = this.data;
    let res = await ajax('/mini/vip/wap/banner/banner_list', bannerListOption)
    if (res.code === 100) {
      this.setData({ bannerList: res.data })
    }
  },

  async getGoodsList() {
    const { goodslistOption } = this.data
    let res = await ajax('/mini/vip/wap/goods/goods_list', goodslistOption)
    if (res.code === 100) {
      this.setData({
        goodsList: res.data.data
      })
    }
  },


  showToast() {
    this.setData({ toast: true })
  },

  hideToast() {
    this.setData({ toast: false })
  },

  toDetail() {
    my.navigateTo({
      url: '../../../package_vip/pages/detail/detail'
    });
  },

  toExchangeList() {
    my.navigateTo({
      url: '../../../package_vip/pages/exchangelist/exchangelist'
    });
  }


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

});
