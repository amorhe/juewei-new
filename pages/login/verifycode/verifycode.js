import { imageUrl, baseUrl,mySet,myGet } from '../../common/js/baseUrl'
import { sendCode, captcha, loginByPhone } from '../../common/js/login'
let timeCount
var app = getApp()
Page({
  data: {
    imageUrl,
    baseUrl,
    focus: false,
    value: '',
    type: '1',
    phone: '',
    countTime: 60,
    isnew: true,
    img_code: '',
    modalOpened: false,
    getCode: true,
    cursor: 0,
    timestamp: 0,        //当前时间戳
    next:false
  },
  onLoad(e) {
    if(e.next=='true'){
      this.setData({
         next:true
      });
    }else{
      this.setData({
         next:false
      });
    }
    var ali_uid = my.getStorageSync({
      key: 'ali_uid', // 缓存数据的key
    }).data;
    var _sid = my.getStorageSync({ key: '_sid' }).data;
    this.setData({
      phone: e.phone,
      ali_uid: ali_uid,
      _sid: _sid
    })
    this.timeDate();
    this.bindFocus();
  },
  onShow() {
    if (this.data.timestamp != 0) {
      let timestampNew = new Date().getTime();
      let counts = parseInt((timestampNew - this.data.timestamp) / 1000);
 
      if (counts > 0) {
        this.setData({
          countTime: this.data.countTime - counts
        })
      } else {
        this.setData({
          isnew: true,
          countTime: 60,
        })
      }
    }
    this.bindFocus();
  },
  bindFocus() {
    var that = this
    // blur 事件和这个冲突
    //console.log(this.data.focus)
    setTimeout(() => {
      that.onFocus();
    }, 200);
  },
  onFocus() {
    this.setData({
      focus: true,
    });
  },
  onBlur() {
    let that=this;
    this.setData({
      focus: false,
    });
    var data = {
      ali_uid: this.data.ali_uid,
      phone: this.data.phone,
      code: this.data.value
    }
    loginByPhone(data).then(res => {
      if (res.code == 0) {
        // 成功
        app.globalData._sid = res.data._sid
        my.setStorageSync({
          key: '_sid', // 缓存数据的key
          data: res.data._sid, // 要缓存的数据
        });
        my.setStorageSync({
          key: 'user_id', // 缓存数据的key
          data: res.data.user_id, // 要缓存的数据
        });
        my.setStorageSync({
          key: 'phone', // 缓存数据的key
          data: res.data.phone, // 要缓存的数据
        });
        mySet('userInfo',res.data);
       
        //判断是否跳转到orderform页面
        clearInterval(timeCount);
        if(that.data.next==true){
          // 关闭当前跳转到下订单页面
          my.redirectTo({
            url: '/pages/home/orderform/orderform'
          })
        }else{
          //返回上两级
          my.navigateBack({
            delta: 2
          })
        }
        //返回上两级
        // my.navigateBack({
        //   delta: 2
        // })
      } else {
        //失败
        my.removeStorageSync({
          key: 'authCode',
        });
        my.removeStorageSync({
          key: 'ali_uid',
        });
        my.removeStorageSync({
          key: '_sid',
        });
        my.removeStorageSync({
          key: 'user_id',
        });
        my.removeStorageSync({
          key: 'phone',
        });
        my.removeStorageSync({
          key: 'userInfo',
        });
        // 其他
        my.showToast({
          type: 'none',
          duration: 2000,
          content: res.msg
        });
      }
    })
  },
  // 倒计时60
  timeDate(e) {
    var that = this;
    that.setData({
      isnew: true,
    })
    if (e && e.currentTarget.dataset.is == 1) {
      that.getcodeFn()
    }
    var time = that.data.countTime;
    timeCount = setInterval(function() {
      time--
      that.setData({
        countTime: time
      })
      if (time == 0) {
        that.setData({
          isnew: false,
          countTime:60
        })
        clearInterval(timeCount)
      }
    }, 1000)
  },
  inputValue(e) {
    var value = e.detail.value
    var cursor = value.length + 1
    this.setData({
      value: value,
      cursor: cursor
    })
    if (value.length == 4) {
      this.onBlur()
    }
  },
  //页面跳转
  toUrl(e) {
    var url = e.currentTarget.dataset.url
    my.navigateTo({
      url: url
    });
  },
  getcodeImg(e) {
    var img_code = e.detail.value
    this.setData({
      img_code: img_code
    })
  },
  // 获取短信验证码
  async getcodeFn() {
    var that = this
    if (this.data.getCode) {
      var time = my.getStorageSync({
        key: 'time', // 缓存数据的key
      }).data;
      if (time) {
        if (time != new Date().toLocaleDateString()) {
          my.removeStorageSync({
            key: 'time',
          });
          my.removeStorageSync({
            key: 'count',
          });
        }
      }

      var count = my.getStorageSync({
        key: 'count', // 缓存数据的key
      }).data || 0;
      if (count == 0) {
        my.setStorageSync({
          key: 'time', // 缓存数据的key
          data: new Date().toLocaleDateString(), // 要缓存的数据
        });
      }
      if (count >= 5 && !this.data.modalOpened) {
        my.hideLoading();
        this.setData({
          modalOpened: true,
          imgUrl: this.data.baseUrl + '/juewei-api/user/captcha?_sid=' + this.data._sid + '&s=' + (new Date()).getTime()
        })
        return
      }
      var data = {
        _sid: this.data._sid,
        phone: this.data.phone,
        img_code: this.data.img_code
      }
      let code = await sendCode(data)
      if (code.code == 0 && code.msg == 'OK') {
        my.setStorageSync({
          key: 'count', // 缓存数据的key
          data: count - '' + 1, // 要缓存的数据
        });
        this.setData({
          modalOpened: false,
          img_code: ''
        })
        // 成功
      } else {
        that.setData({
          imgUrl: this.data.baseUrl + '/juewei-api/user/captcha?_sid=' + this.data._sid + '&s=' + (new Date()).getTime()
        })
        my.showToast({
          type: 'none',
          duration: 2000,
          content: code.msg
        });
      }
    }
  },
  onHide() {
    let timestamp = new Date().getTime();
    this.setData({
      timestamp,
      countTime: this.data.countTime
    })
    // this.setData({
    //   isnew: false,
    //   countTime: 60,
    // })
    // clearInterval(timeCount)
  },
  onUnload() {
    // 页面被关闭
    this.setData({
      isnew: false,
      countTime: 60,
    })
    clearInterval(timeCount)
  },
});
