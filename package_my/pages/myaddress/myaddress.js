import {imageUrl} from '../../../pages/common/js/baseUrl'

Page({
  data: {
    imageUrl,
  },
  onLoad() {},

  toUrl(e){
    var url = e.currentTarget.dataset.url
    my.navigateTo({
      url:url
    });
  },
  addressFn(){
     my.chooseLocation({
      success:(res)=>{
        console.log(res)
      }
    });
  },
});
