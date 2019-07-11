import {ajax} from '../../../pages/common/js/li-ajax'
import {imageUrl2} from '../../../pages/common/js/baseUrl' 

Page({
  data: {
    imageUrl2,
    detail:{
      "id": "355",
		"goods_name": "123",
		"total_num": "1",
		"valid_num": "1",
		"cate_id": "25",
		"intro": "<p>123<\/p>",
		"goods_type": "2",
		"goods_detail_type": "4",
		"gift_id": "473",
		"exchange_type": "1",
		"point": "1",
		"amount": "0",
		"start_time": "2019-06-22 00:00:00",
		"end_time": "2019-07-31 23:59:59",
		"receive_type": "2",
		"get_start_time": "0000-00-00 00:00:00",
		"get_end_time": "0000-00-00 00:00:00",
		"scope_type": "3",
		"company_id": "0",
		"city_id": "1",
		"district_id": "0",
		"express_type": "1",
		"express_fee": "0",
		"exchange_limit_type": "1",
		"exchange_limit_num": "111",
		"exchange_day_num": "0",
		"exchange_intro": "<p>123123<\/p>",
		"sort_no": "12345",
		"status": "2",
		"create_time": "2019-06-22 14:47:58",
		"update_time": "2019-06-22 14:47:58",
		"goods_pic": [{
			"id": "318",
			"goods_pic": "\/static\/check\/image\/goods_point\/oXQW34ZBT6Pcbkx0.jpg"
		}, {
			"id": "454",
			"goods_pic": "\/static\/check\/image\/goods_point\/noTHmy1mTM09NrRh.png"
		}]
    }
  },
 async onLoad(e) {
    const {id} = e
    await this.getDetail(id)
   },

async getDetail(id){
  let res = await ajax('/mini/vip/wap/goods/goods_detail',{id})
  if(res.code === 100){
    this.setData({
      detail:res.data
    })
  }
},

  showConfirm() {
  if(true){
  
   return my.confirm({
      content: '是否兑换“快乐柠檬全场 2 元代金券”将消耗你的18积分',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: result => {
        if(result.confirm&&result.ok){
          my.navigateTo({
           //state 实物邮寄 1，实物门店 2，虚拟商品 3直接跳过到兑换成功页
            url:'./'
          });
        }
      },
    });
  }

     my.confirm({
       content:'你的当前积分不足',
      confirmButtonText: '赚积分',
      cancelButtonText: '取消',
      success: result => {
        console.log(result)
      },
    });
  }
});
