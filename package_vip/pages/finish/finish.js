import{imageUrl} from '../../../pages/common/js/baseUrl'
import{ajax} from '../../../pages/common/js/li-ajax'

Page({
  data: {
    imageUrl
  },
 async onLoad(query) {
   let {id} = query
    await this.getOdrderDetail(id)
  },

  async getOdrderDetail(id){
    let {code,data} = await ajax('/mini/vip/wap/order/order_detail',{id})
  }

});
