
const g = typeof global !== 'undefined' ? global : self;
g.appXAppJson = {
  "app": {
    "$homepage": "pages/home/goodslist/goodslist",
    "subPackages": [
      {
        "root": "package_vip",
        "pages": [
          "pages/detail/detail",
          "pages/exchangelist/exchangelist",
          "pages/exchangelist/exchangedetail/exchangedetail",
          "pages/pointlist/pointlist",
          "pages/pointlist/rules/rules",
          "pages/waitpay/waitpay",
          "pages/finish/finish"
        ]
      },
      {
        "root": "package_order",
        "pages": [
          "pages/orderdetail/orderdetail",
          "pages/comment/comment"
        ]
      },
      {
        "root": "package_my",
        "pages": [
          "pages/coupon/coupon",
          "pages/membercard/membercard",
          "pages/coupon/exchange/exchange",
          "pages/coupon/explain/explain",
          "pages/coupon/changedetails/changedetails",
          "pages/mycenter/mycenter",
          "pages/mycenter/bindphone/bindphone",
          "pages/myaddress/myaddress",
          "pages/myaddress/addaddress/addaddress",
          "pages/onlineservice/onlineservice",
          "pages/nearshop/nearshop"
        ]
      }
    ],
    "preloadRule": {
      "pages/vip/index/index": {
        "network": "all",
        "packages": [
          "package_vip"
        ]
      },
      "pages/order/list/list": {
        "network": "all",
        "packages": [
          "package_order"
        ]
      },
      "pages/my/index/index": {
        "network": "all",
        "packages": [
          "package_my"
        ]
      }
    }
  }
};
