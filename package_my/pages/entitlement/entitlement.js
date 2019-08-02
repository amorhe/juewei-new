import {imageUrl} from '../../../pages/common/js/baseUrl'
Page({
  data: {
    imageUrl,
    list:[
      {
        icon:`${imageUrl}exchange.png`,
        title:'迎新礼包',
        info:'VIP迎新礼包，价值100元优惠券',
      },
      {
        icon:`${imageUrl}my_quity_02.png`,
        title:'积分礼',
        info:'积分可在VIP专享兑换专属礼品',
      },
      {
        icon:`${imageUrl}my_quity_04.png`,
        title:'VIP特惠日',
        info:'VIP特惠日，双倍积分、积分兑券、摇奖、商品特价等丰富的会 员活动',
      }
    ]
  },
  onLoad() {},
});
