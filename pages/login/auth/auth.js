import { imageUrl, baseUrl,myGet,mySet } from '../../common/js/baseUrl'
import { sendCode, captcha, loginByAliUid, loginByAuth, getuserInfo, decryptPhone } from '../../common/js/login'
import { upformId } from '../../common/js/time'
var app = getApp(); //放在顶部
Page({
  data: {
    imageUrl,
    baseUrl,
    modalOpened: false,
    getCode: false,
    phone: '',
    img_code: '',
    imgUrl: '',
    next:false
  },
  onLoad(option) {
    if(option.next=='true'){
      this.setData({
        next:true
      })
    }else{
      this.setData({
        next:false
      })
    }
  },
  onShow(aa) {
    this.getAliId()
  },
  openModal() {
    this.setData({
      modalOpened: true,
    });
  },
  onModalClick() {
    this.setData({
      modalOpened: false,
    });
  },
  onModalClose() {
    this.setData({
      modalOpened: false,
    });
  },
  inputValue(e) {
    var phone = e.detail.value
    if (phone.length == 11) {
      this.setData({
        phone: phone,
        getCode: true
      })
    } else {
      this.setData({
        phone: phone,
        getCode: false
      })
    }
  },
  getcodeImg(e) {
    var img_code = e.detail.value
    this.setData({
      img_code: img_code
    })
  },
  getImgcodeFn() {
    if (this.data.img_code === '') {
      my.showToast({
        type: 'none',
        duration: 1000,
        content: '图片验证码不可为空'
      });
      return
    }
    this.getcodeFn()
  },
  // 获取短信验证码
  async getcodeFn() {
    var that = this
    if (/^1\d{10}$/.test(this.data.phone)) {
    } else {
      my.showToast({
        type: 'none',
        content: '请输入有效手机号',
        duration: 1000
      });
      return
    }
    my.showLoading({
      content: '发送中...',
    });
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
        my.hideLoading();
        my.showToast({
          type: 'none',
          duration: 2000,
          content: '短信发送成功'
        });
        my.navigateTo({
          url: '/pages/login/verifycode/verifycode?phone=' + data.phone+ (that.data.next==true?'&next=true':'')
        });
      } else {
        that.setData({
          imgUrl: this.data.baseUrl + '/juewei-api/user/captcha?_sid=' + this.data._sid + '&s=' + (new Date()).getTime()
        })
        my.hideLoading();
        my.showToast({
          type: 'none',
          duration: 2000,
          content: code.msg
        });
      }
    }
  },
  newImg() {
    this.setData({
      modalOpened: true,
      imgUrl: this.data.baseUrl + '/juewei-api/user/captcha?_sid=' + this.data._sid + '&s=' + (new Date()).getTime()
    })
  },
  getAliId() {
    var that = this
    let ali_uid = my.getStorageSync({ key: 'ali_uid' }).data;
    var _sid = my.getStorageSync({ key: '_sid' }).data;
    if (ali_uid && _sid) {
      this.setData({
        ali_uid: ali_uid,
        _sid: _sid
      })
    } else {
      my.getAuthCode({
        scopes: ['auth_base'],
        success: (res) => {
          my.setStorageSync({
            key: 'authCode', // 缓存数据的key
            data: res.authCode, // 要缓存的数据
          });
          loginByAliUid(res.authCode).then((data) => {
            if (data.code == 0 && data.data.user_id) {
              my.setStorageSync({
                key: 'ali_uid', // 缓存数据的key
                data: data.data.ali_uid, // 要缓存的数据
              });
              my.setStorageSync({
                key: '_sid', // 缓存数据的key
                data: data.data._sid, // 要缓存的数据
              });
              mySet('userInfo',data.data);
              that.setData({
                ali_uid: data.data.ali_uid,
                _sid: data.data._sid
              })
            } else {
              my.setStorageSync({
                key: 'ali_uid', // 缓存数据的key
                data: data.data.ali_uid, // 要缓存的数据
              });
              my.setStorageSync({
                key: '_sid', // 缓存数据的key
                data: data.data._sid, // 要缓存的数据
              });
              mySet('userInfo',data.data);
              that.setData({
                ali_uid: data.data.ali_uid,
                _sid: data.data._sid
              })
            }
          })
        },
      });
    }
  },
  // 授权获取用户信息
  onGetAuthorize(res) {
    var that = this

    my.getPhoneNumber({
      success: (res) => {
        my.showLoading({
          content: '加载中...',
          delay: 1000,
        });

        let userInfo = JSON.parse(res.response); // 以下方的报文格式解析两层 response
        var data = {
          response: userInfo.response
        }
        decryptPhone(data).then(res => {
          if (res.code == 0) {
            that.loginByAuthFn(that.data.ali_uid, res.data.phone);
          }
        })
      },
      fail() {
        my.alert({ title: '获取用户信息失败' });
      }
    });
  },
  // 授权登录
  loginByAuthFn(ali_uid, phone) {
    loginByAuth(ali_uid, phone, '', '').then((res) => {
      if (res.code == 0) {
        my.setStorageSync({
          key: '_sid', // session_id
          data: res.data._sid,
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
        app.globalData._sid = res.data._sid
        this.getUserInfo(res.data._sid);
      } else {
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
        my.showToast({
          type: 'none',
          content: res.msg,
          duration: 2000
        });
      }

    })
  },
  // 用户信息
  getUserInfo(_sid) {
    let that=this;
    getuserInfo(_sid).then((res) => {
      app.globalData.userInfo = res.data;
      my.hideLoading();
      if(that.data.next==true){
        // 关闭当前跳转到下订单页面
        my.redirectTo({
          url: '/pages/home/orderform/orderform'
        })
      }else{
        my.navigateBack({
          delta: 1
        })
      }
    })
  },
  toUrl(e) {
    var url = e.currentTarget.dataset.url
    my.navigateTo({
      url: url
    });
  },
  onSubmit(e){
    upformId(e.detail.formId);
  }
});
