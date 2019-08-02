import {membercard} from '../../../pages/common/js/my'
import {baseUrl,imageUrl} from '../../../pages/common/js/baseUrl'
Page({
  data: {
    imgSrc:'',
    imageUrl
  },
  onLoad() {
    this.getQRcode();
  },
  getQRcode(){
    const _sid = my.getStorageSync({key: '_sid'}).data;
    this.setData({
      imgSrc:baseUrl + '/juewei-api/alimini/getQRcode?_sid=' + _sid
    })
  },
  goPay(){
    my.ap.navigateToAlipayPage({
      appCode:'payCode',
      success:(res) => {
          // my.alert(JSON.stringify(res));
      },
      fail:(res) => {
          // my.alert(JSON.stringify(res));        
      }
    })
  }
});
