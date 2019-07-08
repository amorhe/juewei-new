function success(){
require('../../../package_vip/pages/detail/detail');
require('../../../package_vip/pages/exchangelist/exchangelist');
require('../../../package_vip/pages/exchangelist/exchangedetail/exchangedetail');
require('../../../package_vip/pages/pointlist/pointlist');
require('../../../package_vip/pages/pointlist/rules/rules');
require('../../../package_vip/pages/waitpay/waitpay');
require('../../../package_vip/pages/finish/finish');
}
self.bootstrapSubPackage('package_vip', {success});