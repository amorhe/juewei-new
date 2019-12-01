Page({
  data: {
    src: ''
  },
  onLoad(options) {
    if (options && options.url && options.url!=''){
      this.setData({
        src: decodeURIComponent(options.url)
      })
    }
  },
});
