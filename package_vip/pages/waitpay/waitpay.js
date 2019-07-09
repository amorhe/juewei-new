import{imageUrl}from '../../../pages/common/js/baseUrl'
Page({
  data: {
    imageUrl,

    sex:0
  },
  onLoad() {},

  changeSex(){
    const {sex} = this.data;

    this.setData({
      sex:sex === 0? 1: 0
    })
  }
});
