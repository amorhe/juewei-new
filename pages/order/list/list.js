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
        list:[]
      },
      {
        key: '门店自提订单',
        value: '',
        page: 1,
        dis_type: 2,
        finish: false,
        timer: -1,
        list:[]
      }
    ],

    dis_type: 1,

    takeOutState: [
      '等待支付',
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
      '等待支付',
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
        timer: -1,
        list:[]
      },
      {
        key: '门店自提订单',
        value: '',
        page: 1,
        dis_type: 2,
        finish: false,
        fun: 'getPickUpList',
        timer: -1,
        list:[]
      }
    ]
  

    // 清空所有计时器
    const { menuList } = this.data
    menuList.forEach(({ timer }) => clearInterval(timer))

    // 拉取最新数据

    this.setData({
      menuList: _menuList,
     
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
    if (menuList[cur].page == 1 && (!menuList[cur].list.length)) {
      await this.getOrderList()
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
    // this.onModalClose()

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
          timer: -1,
          list:[]
        },
        {
          key: '门店自提订单',
          value: '',
          page: 1,
          dis_type: 2,
          finish: false,
          timer: -1,
          list:[]
        }
      ],

      dis_type: 1,
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
      if (menuList[cur].page == 1 && !menuList[cur].length) {
       this.getOrderList()
      }
    })
  },


  /**
   * @function 获取订单列表
   */
  async getOrderList() {

    let { menuList, cur } = this.data

    let { page, dis_type, timer, list } = menuList[cur]
    menuList[cur].page++

    clearInterval(timer)
    let { data, code } = await ajax('/juewei-api/order/list', { page_size: 10, page, dis_type }, 'GET')
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
        for (let i = 0; i < list.length; i++) {
          let { remaining_pay_second, remaining_pay_minute } = list[i]
          if (remaining_pay_second === 0 && remaining_pay_minute === 0) {
            return this.refresh()
          }
        }
        
        this.setData({
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