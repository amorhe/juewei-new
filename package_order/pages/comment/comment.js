import { imageUrl } from '../../../pages/common/js/baseUrl'
import { ajax, log } from '../../../pages/common/js/li-ajax'

Page({
  data: {
    imageUrl,
    shopStars: [true, true, true, true, false],
    shopTabs: [
      { key: '送餐快' },
      { key: '餐品保存完好' },
      { key: '服务态度好' },
      { key: '准时到达' },
      { key: '送货上门' },
      { key: '穿着专业' },
      { key: '风雨无阻' },
    ],

    currentShopSelect: []
  },
  onLoad() {
  },

  /**
   * @function 修改商店评分
   */
  changeShopStar(e) {
    const { index } = e.currentTarget.dataset
    let { shopStars } = this.data
    shopStars.fill(true, 0, index + 1)
    shopStars.fill(false, index + 1, 4 + 1)
    this.setData({
      shopStars
    })
  },


  /**
   * @function 修改商店标签
   */
  selectShopTag(e) {
    let { currentShopSelect } = this.data;
    const { item } = e.currentTarget.dataset;

    if(currentShopSelect.includes(item)){
       currentShopSelect.splice(currentShopSelect.findIndex(key => key===item),1)
    }else{
     currentShopSelect.push(item)
    }

    

    this.setData({
      currentShopSelect
    })
  }
});
