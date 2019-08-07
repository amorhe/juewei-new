import {exchangedetail} from '../../../../pages/common/js/home'
import {imageUrl2} from '../../../../pages/common/js/baseUrl'
import {parseData} from '../../../../pages/common/js/li-ajax'
Page({
  data: {
    exchangeObj:{},
    imageUrl2
  },
  onLoad(e) {
    const {id} = e
    const _sid = my.getStorageSync({key: '_sid'}).data;
    this.getDetail(_sid,'178784',id,'jwd03190326x545060');
  },
  getDetail(_sid,gift_code_id,gift_id,order_id){
    exchangedetail(_sid,gift_code_id,gift_id,order_id).then(async (res) => {
      if(res.CODE == 'a100') {
        res.DATA.gift_desciption = await parseData(res.DATA.gift_desciption);
        res.DATA.gift_exchange_process = await parseData(res.DATA.gift_exchange_process)
        this.setData({
          exchangeObj:res.DATA
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
