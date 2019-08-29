import { exchangedetail } from '../../../../pages/common/js/home'
import { imageUrl2 } from '../../../../pages/common/js/baseUrl'
import { parseData, contact } from '../../../../pages/common/js/li-ajax'
Page({
  data: {
    exchangeObj: {},
    imageUrl2,
    source:''
  },
  onLoad(e) {
    const { gift_code_id, gift_id, order_id,source } = e
    const _sid = my.getStorageSync({ key: '_sid' }).data;
    this.getDetail({ _sid, gift_code_id, gift_id, order_id });
    this.setData({
      source
    })
  },
  contact,

  getDetail({ _sid, gift_code_id, gift_id, order_id }) {
    exchangedetail(_sid, gift_code_id, gift_id, order_id).then(async (res) => {
      if (res.CODE == 'A100') {
        res.DATA.gift_application_store = await parseData(res.DATA.gift_application_store);
        res.DATA.gift_desciption = await parseData(res.DATA.gift_desciption);
        res.DATA.gift_exchange_process = await parseData(res.DATA.gift_exchange_process)
        res.DATA.gift_service_telephone = await parseData(res.DATA.gift_service_telephone)

        this.setData({
          exchangeObj: res.DATA
        })
      }
    })
  },
  // 复制
  handleCopy(e) {
    my.setClipboard({
      text: e.currentTarget.dataset.code,
      success() {
        my.showToast({
          type: 'success',
          content: '操作成功'
        });
      }
    });
  },
});
