import {membercard} from '../../../pages/common/js/my'
Page({
  data: {},
  onLoad() {
    this.getQRcode();
  },
  getQRcode(){
    const _sid = my.getStorageSync({key: '_sid'}).data;
    membercard(_sid).then((res) => {
      console.log(res)
    })
  }
});
