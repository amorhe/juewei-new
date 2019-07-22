import {membercard} from '../../../pages/common/js/my'
import {baseUrl} from '../../../pages/common/js/baseUrl'
Page({
  data: {
    imgSrc:''
  },
  onLoad() {
    this.getQRcode();
  },
  getQRcode(){
    const _sid = my.getStorageSync({key: '_sid'}).data;
    this.setData({
      imgSrc:baseUrl + '/juewei-api/alimini/getQRcode?_sid=' + _sid
    })
  }
});
