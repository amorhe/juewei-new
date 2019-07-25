import { imageUrl, baseUrl, imageUrl2 } from '../../../pages/common/js/baseUrl'
import { ajax, log } from '../../../pages/common/js/li-ajax'

Page({
  data: {
    imageUrl,
    imageUrl2,
    shopStars: [true, false, false, false, false],

    com: {},

    shopTabs: [
      { key: '送餐快' },
      { key: '餐品保存完好' },
      { key: '服务态度好' },
      { key: '准时到达' },
      { key: '送货上门' },
      { key: '穿着专业' },
      { key: '风雨无阻' },
    ],

    order_on: '',
    dis_tag: '',
    dis_level: '',
    dis_content: '',
    goods_comment: [],
    plate: 1,

    d: {},

    currentShopSelect: []
  },
  async onLoad(e) {
    const { order_no } = e;
    await this.getCommentTag()
    await this.getOrderDetail(order_no)

  },

  /**
   * @function 获取评价数据
   */

  async getCommentTag() {
    let res = await ajax('/juewei-api/comment/CommentTag', {}, 'POST')
    if (res.code === 0) {
      this.setData({
        com: res.data,
        shopTabs: res.data.dis.low
      })
    }
  },

  /**
  * @function 获取订单详情
  */
  async getOrderDetail(order_no) {
    const { com } = this.data;
    let res = await ajax('/juewei-api/order/detail', { order_no })

    let goods_list = res.data.goods_list.map(item => ({
      ...item,
      goods_comment: {
        goods_code: "A1QLT26",
        level: 1,
        goodStar: [true, false, false, false, false],
        tag: "2",
        tags: [],
        _tags: com.goods.low,
        content: "鸭舌很好吃xxx1111",
        img: "",
        pics: []
      },
    }))
    res.data.goods_list = goods_list
    if (res.code === 0) {
      this.setData({ d: res.data })
    }
  },


  /**
   * @function 修改商店评分
   */
  changeShopStar(e) {
    const { index } = e.currentTarget.dataset
    let { shopStars, com } = this.data
    let stars = index + 1
    // 修改星星
    shopStars.fill(true, 0, stars)
    shopStars.fill(false, stars, 5)

    // 修改标签
    let shopTabs
    switch (stars) {
      case 1:
      case 2:
        shopTabs = com.dis.low;
        break;
      case 3:
        shopTabs = com.dis.mid;
        break;
      case 4:
      case 5:
        shopTabs = com.dis.good;
        break
    }

    this.setData({
      shopStars,
      shopTabs,
      currentShopSelect: []
    })
  },

  /**
  * @function 修改菜品评分
  */
  changeGoodsComment(e) {
    let { d, com } = this.data
    let { goods_list } = d
    const { index, i } = e.currentTarget.dataset
    let { goodStar } = goods_list[i].goods_comment
    let stars = index + 1
    /* 修改星星 */
    goodStar.fill(true, 0, stars)
    goodStar.fill(false, stars, 5)

    // 修改标签
    switch (stars) {
      case 1:
      case 2:
        goods_list[i].goods_comment._tags = com.goods.low;
        break;
      case 3:
        goods_list[i].goods_comment._tags = com.goods.mid;
        break;
      case 4:
      case 5:
        goods_list[i].goods_comment._tags = com.goods.good;
        break
    }

    goods_list[i].goods_comment.tags = []

    d.goods_list = goods_list
    this.setData({
      d,
    })
  },



  /**
   * @function 修改商店标签
   */
  selectShopTag(e) {
    let { currentShopSelect } = this.data;
    const { item } = e.currentTarget.dataset;

    if (currentShopSelect.includes(item)) {
      currentShopSelect.splice(currentShopSelect.findIndex(key => key === item), 1)
    } else {
      currentShopSelect.push(item)
    }

    this.setData({
      currentShopSelect
    })
  },


  /**
    * @function 修改商品标签
    */
  selectGoodTag(e) {

    let { d } = this.data
    let { goods_list } = d
    const { item, i } = e.currentTarget.dataset
    let { tags } = goods_list[i].goods_comment


    if (tags.includes(item)) {
      tags.splice(tags.findIndex(key => key === item), 1)
    } else {
      tags.push(item)
    }


    d.goods_list = goods_list
    this.setData({
      d
    })

  },



  /**
   * @function 上传图片
   */
  upLoad(e) {
    const { i } = e.currentTarget.dataset
    my.chooseImage({
      sourceType: ['camera', 'album'],
      count: 1,
      success: (res) => {
        my.uploadFile({
          url: baseUrl + '/juewei-api/comment/UploadCommentImg',

          fileType: 'image',
          fileName: 'imgFile',
          filePath: res.apFilePaths[0],
          dataType: 'json',

          success: (result) => {
            let { d } = this.data
            let { goods_list } = d
            let { pics } = goods_list[i].goods_comment
            log(result.data)
            let p = /\"path\"\:\"(\S*)\"\}\,/
            log(result.data.match(p))
            pics = [...pics, result.data.match(p)[1]]

            log(pics, d)
            d.goods_list[i].goods_comment.pics = pics

            this.setData({
              d
            })
          },
          // fail: (error) => {
          //   log(error)
          //   my.showToast({
          //     content: 'fail',
          //   });
          // }
        });
      },
      fail: (err) => {
        log(err)
        my.showToast({
          content: 'fail',
        });
      }
    })
  }
});
