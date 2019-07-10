import {imageUrl} from '../../../pages/common/js/baseUrl'
Page({
  data: {
    imageUrl,
    longitude: 116.30051,
    latitude: 40.0511,
    markersArray:[
      {
        longitude: 116.30051,
        latitude: 40.0511,
        iconPath:`${imageUrl}position_map1.png`,
        width: 32,
        height: 32
      },
      {
        longitude: 116.3005,
        latitude: 40.054,
        iconPath:`${imageUrl}position_map1.png`,
        width: 15,
        height: 15
      }
    ]
  },
  onLoad() {},
});
