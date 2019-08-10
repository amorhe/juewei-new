import { imageUrl, imageUrl2 } from '../../common/js/baseUrl'
import { ajax, log, contact, isloginFn, guide, getSid } from '../../common/js/li-ajax'
import { reqUserPoint } from '../../common/js/vip'
const app = getApp()
Page({
  data: {
    imageUrl,
    _sid: '',
    loginOpened: false,
    menuList: [
      {
        key: '官方外卖订单',
        value: '',
        page: 1,
        dis_type: 1,
        finish: false,
        fun: 'getTakeOutList',
        timer: -1
      },
      {
        key: '门店自提订单',
        value: '',
        page: 1,
        dis_type: 2,
        finish: false,
        fun: 'getPickUpList',
        timer: -1
      }
    ],

    dis_type: 1,

    takeOutList: [],
    pickUpList: [],

    takeOutState: [
      '待支付',
      '订单已提交',
      '商家已接单',
      '正在配送',
      '已送达',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消'
    ],

    pickUpState: [
      '待支付',
      '订单已提交',
      '商家已接单',
      '等待取餐',
      '订单已完成',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消',
      '订单已取消'
    ],

    cur: 0,

  },

  // 下拉刷新
  async onPullDownRefresh() {
    this.refresh()
  },

  // 刷新
  async refresh() {
    // 重置数据
    let _menuList = [
      {
        key: '官方外卖订单',
        value: '',
        page: 1,
        dis_type: 1,
        finish: false,
        fun: 'getTakeOutList',
        timer: -1
      },
      {
        key: '门店自提订单',
        value: '',
        page: 1,
        dis_type: 2,
        finish: false,
        fun: 'getPickUpList',
        timer: -1
      }
    ]
    let _takeOutList = []
    let _pickUpList = []

    // 清空所有计时器
    const { menuList } = this.data
    menuList.forEach(({ timer }) => clearInterval(timer))

    // 拉取最新数据

    this.setData({
      menuList: _menuList,
      takeOutList: _takeOutList,
      pickUpList: _pickUpList
    }, async () => {
      await this.getMore()

      my.stopPullDownRefresh()
    })

  },


  async onShow() {
    // 校验用户是否登录
    await reqUserPoint()
    let _sid = await getSid()
    this.setData({
      loginOpened: !_sid
    })
    // 校验是否 需要刷新
    if (app.globalData.refresh == true) {
      my.showToast({
        content: '取消成功'
      });
      app.globalData.refresh = false
      return this.refresh();
    }
    let { takeOutList, pickUpList, menuList, cur } = this.data
    if (menuList[cur].page == 1 && (!takeOutList.length || !pickUpList.length)) {
      await this[menuList[cur]['fun']]()
    }
  },
  onUnload() {
    let { menuList, cur } = this.data
    clearInterval(menuList[cur].timer)
    menuList[cur].timer = -1
    this.setData({ menuList })
    this.setData = () => { }
  },
  onHide() {
    this.onModalClose()

    // clearInterval(this.data.time)
    // this.setData({ time: -1 })
  },

  contact,
  isloginFn,
  guide,

  /**
   * @function 打开用户登录弹窗
   */
  open() {
    // 清空所有计时器
    const { menuList } = this.data
    menuList.forEach(({ timer }) => clearInterval(timer))
    this.setData({
      loginOpened: true
    })
  },


  /**
   * @function 关闭modal
   */
  onModalClose() {
    // 清空所有计时器
    const { menuList } = this.data
    menuList.forEach(({ timer }) => clearInterval(timer))
    this.setData({
      loginOpened: false,
      menuList: [
        {
          key: '官方外卖订单',
          value: '',
          page: 1,
          dis_type: 1,
          finish: false,
          fun: 'getTakeOutList',
          timer: -1
        },
        {
          key: '门店自提订单',
          value: '',
          page: 1,
          dis_type: 2,
          finish: false,
          fun: 'getPickUpList',
          timer: -1
        }
      ],

      dis_type: 1,

      takeOutList: [],
      pickUpList: [],
    })
  },



  /**
   * @function 选择菜单
   */

  async changeMenu(e) {
    let { menuList, pickUpList } = this.data
    const { cur } = e.currentTarget.dataset
    if (this.data.cur === cur) { return }
    this.setData({ cur }, () => {
      if (menuList[cur].page == 1 && !pickUpList.length) {
        this[menuList[cur]['fun']]()
      }
    })
  },

  /**
   * @function 获取外卖订单列表
   */
  async getTakeOutList() {

    let { takeOutList, menuList, cur } = this.data

    let { page, dis_type, timer } = menuList[cur]
    menuList[cur].page++
    clearInterval(timer)

    let { data, code } = await ajax('/juewei-api/order/list', { page_size: 10, page, dis_type }, 'GET')
    if (code === 0) {

      takeOutList = [...takeOutList, ...data]

      timer = setInterval(() => {
        takeOutList = takeOutList.map(({ remaining_pay_minute, remaining_pay_second, ...item }) => {
          remaining_pay_second--
          if (remaining_pay_second === 0 && remaining_pay_minute === 0) {
            return clearInterval(time)
          }
          if (remaining_pay_second <= 0) {
            --remaining_pay_minute
            remaining_pay_second = 59
          }
          return {
            remaining_pay_minute,
            remaining_pay_second,
            ...item,
          }
        })
        menuList[cur].finish = true
        menuList[cur].timer = timer

        for (let i = 0; i < takeOutList.length; i++) {
          const { remaining_pay_second, remaining_pay_minute } = takeOutList[i]
          if (remaining_pay_second === 0 && remaining_pay_minute === 0) {
            return this.refresh()
            break;
          }
        }

        this.setData({
          takeOutList,
          menuList
        }, () => my.hideLoading())

      }, 1000)

    } else {
      this.open()
    }
  },



  /**
   * @function 获取自提订单列表
   */
  async getPickUpList() {

    let { pickUpList, menuList, cur } = this.data

    let { page, dis_type, timer } = menuList[cur]
    menuList[cur].page++

    clearInterval(timer)
    let { data, code } = await ajax('/juewei-api/order/list', { page_size: 10, page, dis_type }, 'GET')
    if (code === 0) {
      pickUpList = [...pickUpList, ...data]
      timer = setInterval(() => {
        pickUpList = pickUpList.map(({ remaining_pay_minute, remaining_pay_second, ...item }) => {
          remaining_pay_second--
          if (remaining_pay_second === 0 && remaining_pay_minute === 0) {
            return clearInterval(time)
          }
          if (remaining_pay_second <= 0) {
            --remaining_pay_minute
            remaining_pay_second = 59
          }
          return {
            remaining_pay_minute,
            remaining_pay_second,
            ...item,
          }
        })
        menuList[cur].timer = timer
        menuList[cur].finish = true


        this.setData({
          pickUpList,
          menuList
        }, () => my.hideLoading())
      }, 1000)

    } else {
      this.open()
    }
  },

  /**
   * @function 获取更对订单信息
   */

  async getMore() {
    // 页面被拉到底部
    const { menuList, cur } = this.data;
    my.showLoading({ content: '加载中...' });
    setTimeout(async () => {
      await this[menuList[cur]['fun']]()
    }, 300)
  },

  /**
   * @function 触底
   */

  async onReachBottom() {

    this.getMore()
  },

  /**
   * @function 跳转订单详情页面
   */
  toDetail(e) {
    const { order_no } = e.currentTarget.dataset;
    my.navigateTo({
      url: '/package_order/pages/orderdetail/orderdetail?order_no=' + order_no
    });
  },

  /**
   * @function 去评价页面
   */
  toComment(e) {
    const { order_no } = e.currentTarget.dataset;
    my.navigateTo({
      url: '/package_order/pages/comment/comment?order_no=' + order_no
    });
  },

  /**
   * @function 再来一单
   */

  buyAgain() {
    const { menuList, cur } = this.data;

    app.globalData.type = menuList[cur].dis_type;
    log(app.globalData.type)

    my.switchTab({
      url: '/pages/home/goodslist/goodslist'
    });
  }

});