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
        timer: -1,
        list: [],
        loading: false
      },
      {
        key: '门店自提订单',
        value: '',
        page: 1,
        dis_type: 2,
        finish: false,
        timer: -1,
        list: [],
        loading: false
      }
    ],

    timers: [-1],

    dis_type: 1,

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
      '待取餐',
      '已取餐',
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
    const { menuList, timers } = this.data

    // 重置数据
    let _menuList = [
      {
        key: '官方外卖订单',
        value: '',
        page: 1,
        dis_type: 1,
        finish: false,
        fun: 'getTakeOutList',
        timer: -1,
        list: [],
        loading: menuList[0].loading
      },
      {
        key: '门店自提订单',
        value: '',
        page: 1,
        dis_type: 2,
        finish: false,
        fun: 'getPickUpList',
        timer: -1,
        list: [],
        loading: menuList[1].loading
      }
    ]


    // 清空所有计时器
    menuList.forEach(({ timer }) => clearInterval(timer))
    timers.forEach(item => clearInterval(item))

    // 拉取最新数据
    setTimeout(() => {
      this.setData({
        menuList: _menuList,
      }, async () => {
        await this.getMore()
        my.stopPullDownRefresh()
      })
    })

  },


  async onShow() {
    const {timers} = this.data;
    log(timers)
    timers.forEach(item=>clearInterval(item))

    // 校验用户是否登录
    await reqUserPoint()
    let _sid = await getSid()
    // this.setData({
    //   loginOpened: !_sid
    // })
    if (!_sid) { return isloginFn() }
    // 校验是否 需要刷新
    if (app.globalData.refresh == true) {
      my.showToast({
        content: '取消成功'
      });
      app.globalData.refresh = false
    }

    return this.refresh();
  },
  onUnload() {
    let { menuList, cur, timers } = this.data
    clearInterval(menuList[cur].timer)
    timers.forEach(item => clearInterval(item))
    menuList[cur].timer = -1
    this.setData({ menuList })
    this.setData = () => { }
  },
  onHide() {
    this.onModalClose()
    let { menuList, cur, timers } = this.data
    clearInterval(menuList[cur].timer)
    timers.forEach(item => clearInterval(item))
    menuList[cur].timer = -1
    this.setData({ menuList })

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
    const { menuList, timers } = this.data
    menuList.forEach(({ timer }) => clearInterval(timer))
    timers.forEach(item => clearInterval(item))
    this.setData({
      loginOpened: true
    })
  },


  /**
   * @function 关闭modal
   */
  onModalClose() {
    // 清空所有计时器
    const { menuList, timers } = this.data
    menuList.forEach(({ timer }) => clearInterval(timer))
    timers.forEach(item => clearInterval(item))
    this.setData({
      loginOpened: false,
      menuList: [
        {
          key: '官方外卖订单',
          value: '',
          page: 1,
          dis_type: 1,
          finish: false,
          timer: -1,
          list: [],
          loading: menuList[0].loading
        },
        {
          key: '门店自提订单',
          value: '',
          page: 1,
          dis_type: 2,
          finish: false,
          timer: -1,
          list: [],
          loading: menuList[1].loading
        }
      ],

      dis_type: 1,
    })
  },



  /**
   * @function 选择菜单
   */

  async changeMenu(e) {
    let { menuList, timers } = this.data
    my.showLoading({
      content: '加载中...',
    });
    // 清空所有计时器
    menuList.forEach(({ timer }) => clearInterval(timer))
    timers.forEach(item => clearInterval(item))
    const { cur } = e.currentTarget.dataset
    if (this.data.cur === cur) { return my.hideLoading() }
    setTimeout(() => {
      this.setData({ cur }, () => {
        setTimeout(() => {
          this.refresh()
        })
      }, 0)
    }, 0)
  },


  /**
   * @function 获取订单列表
   */
  async getOrderList() {

    let { menuList, cur, timers } = this.data
    let { page, dis_type, timer, list, loading } = menuList[cur]
    if (loading) { return }
    menuList[cur].page++
    menuList.forEach(({ timer }) => clearInterval(timer))
    timers.forEach(item => clearInterval(item))
    let { data, code } = await ajax('/juewei-api/order/list', { page_size: 10, page, dis_type }, 'GET')
    my.showLoading({
      content: '加载中...',
    });
    menuList[loading] = true
    this.setData({ loading: true }, () => {
      menuList.forEach(({ timer }) => clearInterval(timer))
      timers.forEach(item => clearInterval(item))
      if (code === 0) {
        list = [...list, ...data]
        timer = setInterval(() => {
          list = list.map(({ remaining_pay_minute, remaining_pay_second, ...item }) => {
            remaining_pay_second--
            if (remaining_pay_second === 0 && remaining_pay_minute === 0) {
              clearInterval(timer)
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
          menuList[cur].list = list
          menuList[loading] = false
          timers.push(timer)
          this.setData({
            menuList,
            timers,
            loading: false
          }, () => my.hideLoading())
        }, 1000)


      } else {
        this.open()
      }
    })

  },

  /**
   * @function 获取更对订单信息
   */

  async getMore() {
    // 页面被拉到底部
    const { menuList, cur } = this.data;
    my.showLoading({ content: '加载中...' });
    setTimeout(async () => {
      await this.getOrderList()
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