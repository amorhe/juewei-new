import {imageUrl} from '../../common/js/baseUrl'
Page({
  data: {
    imageUrl
  },
  onLoad() {},
  choosecityTap(){
    my.chooseCity({
      showLocatedCity:true,
      showHotCities:true,
      success: (res) => {
        console.log(res)
      },
    });
  }
});
