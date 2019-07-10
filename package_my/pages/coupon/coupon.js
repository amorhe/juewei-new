import {imageUrl} from '../../../pages/common/js/baseUrl'
Page({
  data: {
    tabs: [
      {
        title: '优惠券3张'
      },
      {
        title: '兑换码10个'
      },
    ],
    activeTab: 0,
    imageUrl
  },
  onLoad() {},
  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },
});
