import { imageUrl } from '../../../../pages/common/js/baseUrl'
Page({
  data: {
    imageUrl,
    mapiconInfo:'',
    // latitude:'30.305654',
    // longitude:'120.093352'
    list:[],
  },
  onLoad() {
    this.getLocation()
  },
  getLocation(){
    var that =this
    my.getLocation({
      type:3,
      success(res) {
        my.hideLoading();
        console.log(res)
        var mapInfo = {
          iconPath:imageUrl+'position.png',
          latitude:res.latitude,
          longitude:res.longitude,
          width: 32,
          height: 32
        }
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude,
          mapInfo:mapInfo,
          list:res.pois
        })
      },
      fail() {
        my.hideLoading();
        my.alert({ title: '定位失败' });
      },
    })
  },
  tapMap(e){
    console.log(e)
    var mapInfo = {
      iconPath:imageUrl+'position.png',
      latitude:e.latitude,
      longitude:e.longitude,
      width: 32,
      height: 32
    }
    this.setData({
      latitude:e.latitude,
      longitude:e.longitude,
      mapInfo:mapInfo,
    })
    my.chooseLocation({
      success:(res)=>{
        console.log(res)
      }
    });
  }
});
