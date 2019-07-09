import { imageUrl,imageUrl2 } from '../../common/js/baseUrl'
import { ajax } from '../../common/js/li-ajax'

const log = console.log

Page({
  data: {
    imageUrl,
    imageUrl2,

    list:[
      {title:'餐饮美食'},
      {title:'餐饮美食'},
      {title:'餐饮美食'},
      {title:'餐饮美食'},
      {title:'餐饮美食'},
    ],

    cur:0,

    goodsList:
      [{
			"id": "355",
			"goods_name": "123",
			"total_num": "1",
			"valid_num": "1",
			"cate_id": "25",
			"goods_type": "2",
			"goods_detail_type": "4",
			"exchange_type": "1",
			"amount": "0",
			"point": "1",
			"start_time": "2019-06-22 00:00:00",
			"end_time": "2019-07-31 23:59:59",
			"company_id": "0",
			"city_id": "1",
			"district_id": "0",
			"goods_pic": "\/static\/check\/image\/goods_point\/oXQW34ZBT6Pcbkx0.jpg",
			"exchange_day_vaild_num": 1
		},{
			"id": "355",
			"goods_name": "123",
			"total_num": "1",
			"valid_num": "1",
			"cate_id": "25",
			"goods_type": "2",
			"goods_detail_type": "4",
			"exchange_type": "1",
			"amount": "0",
			"point": "1",
			"start_time": "2019-06-22 00:00:00",
			"end_time": "2019-07-31 23:59:59",
			"company_id": "0",
			"city_id": "1",
			"district_id": "0",
			"goods_pic": "\/static\/check\/image\/goods_point\/oXQW34ZBT6Pcbkx0.jpg",
			"exchange_day_vaild_num": 1
		},{
			"id": "355",
			"goods_name": "123",
			"total_num": "1",
			"valid_num": "1",
			"cate_id": "25",
			"goods_type": "2",
			"goods_detail_type": "4",
			"exchange_type": "1",
			"amount": "0",
			"point": "1",
			"start_time": "2019-06-22 00:00:00",
			"end_time": "2019-07-31 23:59:59",
			"company_id": "0",
			"city_id": "1",
			"district_id": "0",
			"goods_pic": "\/static\/check\/image\/goods_point\/oXQW34ZBT6Pcbkx0.jpg",
			"exchange_day_vaild_num": 1
		}],
    


  },
  onLoad() {
    this.getBanner()
    this.getGoodsList()
  },

  listChange(event){
    const {cur} = event.currentTarget.dataset;
    log(cur)
    this.setData({cur})
  },

  async getBanner() {
    let res = await ajax('/mini/vip/wap/banner/banner_list',{city_id:110100,district_id:1,release_channel:1})
    log(res)
  },

  async getGoodsList(){
    let res = await ajax('/mini/vip/wap/goods/goods_list',{shop:1,cate_id:1,company_id:0,city_id:110101,page_num:1,page_size:100})
  }
});
