import {imageUrl} from '../../../pages/common/js/baseUrl'
Page({
  data: {
    tabs: [
      {
        title: '优惠券3张'
      },
      {
        title: '兑换码5个'
      },
    ],
    activeTab: 0,  // 初始选中
    imageUrl
  },
  onLoad() {},
  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },
});
