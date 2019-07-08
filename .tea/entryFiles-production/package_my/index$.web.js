function success(){
require('../../../node_modules/mini-antui/es/list/index');
require('../../../node_modules/mini-antui/es/list/list-item/index');
require('../../../package_my/pages/coupon/coupon');
require('../../../package_my/pages/membercard/membercard');
require('../../../package_my/pages/coupon/exchange/exchange');
require('../../../package_my/pages/coupon/explain/explain');
require('../../../package_my/pages/coupon/changedetails/changedetails');
require('../../../package_my/pages/mycenter/mycenter');
require('../../../package_my/pages/mycenter/bindphone/bindphone');
require('../../../package_my/pages/myaddress/myaddress');
require('../../../package_my/pages/myaddress/addaddress/addaddress');
require('../../../package_my/pages/onlineservice/onlineservice');
require('../../../package_my/pages/nearshop/nearshop');
}
self.bootstrapSubPackage('package_my', {success});