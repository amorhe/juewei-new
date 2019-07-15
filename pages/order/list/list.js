Page({
  data: {
    menuList:[
      {key:'官方外卖订单',value:''},
      {key:'门店自提订单',value:''}
    ],

    cur:0
  },

  changeMenu(e){
    const {cur} = e.currentTarget.dataset
    this.setData({cur})
  },

  onLoad() {},
});
