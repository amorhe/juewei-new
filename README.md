#支付宝小程序开发说明

##后台接口url域名
- 见开发文档


##图片cdn地址链接url域名

####测试环境
```
    小图标cdn路径：     https://test-wap.juewei.com/m/alimim/
    商品图片和json文件：https://imgcdnjwd.juewei.com/
```
####正式环境
```
    小图标cdn路径：      https://wap.juewei.com/m/alimim/
    商品图片和json文件： https://imgcdnjwd.juewei.com/
```

##文件结构说明
```
├─ pages    主包
    ├─ common    公共引用页面（越少越好）
    |     ├─ js      公共js文件夹
    |     └─ style   公共css文件夹
    |          └─  common.acss  公共的css样式
    |
    ├─ component  公共模块
    |     └─ shopcart  购物车模块
    |
    ├─ home   商城文件夹
    |    ├─ goodslist  商城首页列表页(外卖和自提是一个)
    |    ├─ orderfinish 订单完成页(外卖和自提是一个)
    |    ├─ orderform  确认订单(外卖和自提是一个)
    |    ├─ selecttarget 手动选择定位地址
    |    └─ switchshop  切换门店功能
    |
    ├─ login   登录文件夹
    |    ├─ auth 授权登录和手机号填写页，登录首页
    |    ├─ protocol 用户协议，静态页
    |    └─ verifycode 手机号验证码页
    |
    ├─ my     我的文件夹
    |  └─ index  我的首页
    |
    ├─ order    订单文件夹
    |    └─ list 订单列表首页
    |
    ├─ positon   欢迎定位页
    |
    └─ vip   vip文件夹
      └─ index vip专享首页

├─ package_my   我的包
  └─pages
      ├─ coupon 卡券列表页
      |    ├─ changedetails 兑换详情
      |    ├─ exchange 兑换页面
      |    └─ explain  优惠券使用说明
      |
      ├─ membercard 会员卡
      |
      ├─ myaddress 我的收获地址管理
      |     └─ addaddress 新增我的收获地址
      |
      ├─ mycenter  个人中心设置
      |     └─ bindphone 从新绑定手机号页面
      |
      ├─ nearshop 附近门店
      |
      └─ onlineservice 在线客服页

├─ package_order  订单包
    └─ pages
      ├─ comment  用户评价系统（外卖和自提）
      |
      └─ orderdetail  订单详情页（外卖和自提）

├─ package_vip vip专享包
    └─ pages
      ├─ detail  vip详情页
      |
      ├─ exchangelist  兑换产品记录页面
      |    └─ exchangedetail  兑换详情页
      |
      ├─ finish 兑换完成页（成功和失败）
      |
      ├─ pointlist 积分消耗列表
      |     └─ rules  积分规则，静态页
      |
      └─ waitpay 待支付页面
```