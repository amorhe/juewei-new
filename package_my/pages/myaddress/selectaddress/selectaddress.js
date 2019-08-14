import { imageUrl, ak,geotable_id } from '../../../../pages/common/js/baseUrl'
Page({
  data: {
    imageUrl,
    mapiconInfo: '',
    mapInfo: [],
    // latitude:'30.305654',
    // longitude:'120.093352'
    list: [],
  },
  onLoad() {
    this.getLocation()
  },
  getLocation() {
    var that = this
    my.getLocation({
      type: 3,
      success(res) {
        my.hideLoading();
        that.setIcon(res.longitude, res.latitude)
      },
      fail() {
        my.hideLoading();
        my.alert({ title: '定位失败' });
      },
    })
  },
  setIcon(long, lat) {
    var that = this
    my.request({
      url: 'https://api.map.baidu.com/geosearch/v3/nearby?ak=' + ak + '&geotable_id='+ geotable_id +'&location=' + long + ',' + lat + '&radius=2000',
      success: (res) => {
        console.log(res, '门店id')
        var arr = [
          {
            iconPath: imageUrl + 'position.png',
            latitude: lat,
            longitude: long,
            width: 32,
            height: 32
          }
        ]
        res.data.contents.forEach(item => {
          console.log(item)
          var obj = {}
          obj.iconPath = imageUrl + 'position.png'
          obj.latitude = item.location[1]
          obj.longitude = item.location[0]
          obj.width = 20
          obj.height = 20
          arr.push(obj)
        })
        that.setData({
          latitude: lat,
          longitude: long,
          mapInfo: arr
        })
        console.log(that.data.mapInfo, 'arr')
      },
    });
  },
  // tapMap(e) {
  //   console.log(e)
  //   var mapInfo = {
  //     iconPath: imageUrl + 'position.png',
  //     latitude: e.latitude,
  //     longitude: e.longitude,
  //     width: 32,
  //     height: 32
  //   }
  //   this.setData({
  //     latitude: e.latitude,
  //     longitude: e.longitude,
  //     mapInfo: mapInfo,
  //   })
  // }
});
