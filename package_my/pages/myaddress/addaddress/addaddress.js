import { imageUrl,ak } from '../../../../pages/common/js/baseUrl'
import { getRegion } from '../../../../pages/common/js/li-ajax'
import { addressCreate,addressinfo,updateaddress,deleteaddress} from '../../../../pages/common/js/address'
let region=[]
var app = getApp()
Page({
  data: {
    imageUrl,
    modalShow:false, // 弹窗
    // 地址
    name: '',

    sex: 0,

    phone: '',

    address: '',

    labelList: [
      {
        name:'家',
        type:1
      },
      {
        name:'公司',
        type:2
      },
      {
        name:'学校',
        type:3
      }
    ],
    curLabel: 1,

    selectAddress: false,

    addressList: region,
    provinceList: [],
    cityList: [],
    countryList: [],
    defaultAddress: [0, 0, 0],
    shop_id:'',
    addressId:'',
    order:0
  },
  async onLoad(e) {
   if(e.Id){
     this.data.addressId = e.Id
     this.getInfo(e.Id)
   }else{
     this.data.addressId = ''
   }
   if(e.order){
     this.data.order=1
   }
   region =  await getRegion()
    this.getAddressList()
  },
  // 地址详情
    getInfo(id){
      var data = {
        _sid:app.globalData._sid,
        address_id:id
      }
      addressinfo(data).then(res=>{
        console.log(res.data,'地址详情')
        console.log(res.data.user_address_lbs_baidu)
        var lbsArr = res.data.user_address_lbs_baidu.split(',')
        console.log(lbsArr)
        var data = res.data
        this.setData({
          sex:data.user_address_sex,
          name:data.user_address_name, // 收货人姓名
          phone:data.user_address_phone, // 手机号
          map_address:data.user_address_map_addr, // 定位地址
          address:data.user_address_address, // 收货地址
          province:data.province,// 省
          city:data.city, // 市
          district:data.district, // 区
          longitude:lbsArr[0], // 经度
          latitude:lbsArr[1], // 纬度
          shop_id:'', // 门店
          addressdetail:data.user_address_detail_address, // 地址详情
          curLabel:data.tag
        })
      })
    },
  // 选择地址
  chooseLocation(){
    var that = this
    my.chooseLocation({
      success:(res)=>{
        var address = res.name?res.name:res.address
        console.log(res,'地址数据')   
        console.log(this.data.address,'地址数据')
        my.request({
          url: 'https://api.map.baidu.com/geocoder/v2/?ak='+ak+'&location=' + res.latitude + ',' + res.longitude + '&output=json&coordtype=wgs84ll',
          success: (res) => {
            that.setData({
              province:res.data.result.addressComponent.province,
              city:res.data.result.addressComponent.city,
              district:res.data.result.addressComponent.district
            })
          },
        });
        my.request({
          url: 'https://api.map.baidu.com/geosearch/v3/nearby?ak='+ak+'&geotable_id=134917&location=' + res.longitude + ',' + res.latitude + '&radius=2000',
          success: (res) => {
            var arr = []
            res.data.contents.forEach(item=>{
              arr.push(item.shop_id)
            })
            that.data.shop_id = arr.join(',')
          },
        });
        that.setData({
          longitude:res.longitude,
          latitude: res.latitude,
          address:address
        })
      },
      fail(err){
        console.log(err,'错误')
      }
    });
  },
  getAddressList() {
    let [curProvince, curCity, curCountry] = this.data.defaultAddress;
    let provinceList = region.map(({ addrid, name }) => ({ addrid, name }))
    let cityList = region[curProvince].sub
    let countryList = cityList[curCity].sub

    this.setData({
      provinceList,
      cityList,
      countryList
    })
  },

  changeAddress(e) {
    let [curProvince, curCity, curCountry] = this.data.defaultAddress;
    let cur = e.detail.value
    if (cur[0] != curProvince) {
      cur = [cur[0], 0, 0]
    }

    if (cur[1] != curCity) {
      cur = [cur[0], cur[1], 0]
    }

    this.setData({
      defaultAddress: cur,
      address: region[cur[0]].name + ' ' +
       region[cur[0]].sub[cur[1]].name + ' ' +
       ((region[cur[0]].sub[cur[1]].sub[cur[2]] && region[cur[0]].sub[cur[1]].sub[cur[2]].name ) || ' ')
    },
      () => this.getAddressList()
    )
  },

  showSelectAddress() {
    this.setData({ selectAddress: true })
  },

  hideSelectAddress() {
    this.setData({ selectAddress: false })
  },

  // 地址
  changeSex() {
    const { sex } = this.data;
    this.setData({
      sex: sex === 0 ? 1 : 0
    })
  },

  changeCur(e) {
    let curLabel = e.currentTarget.dataset.type 
    this.setData({ curLabel })
  },

  handelChange(e) {
    let { key } = e.currentTarget.dataset;
    let { value } = e.detail;
    this.setData({ [key]: value })
  },
  Addaddress(){
    console.log(this.data.addressId)
    if(this.data.addressId){
      var data = {
        _sid:app.globalData._sid,
        address_id:this.data.addressId,
        sex:this.data.sex,
        name:this.data.name, // 收货人姓名
        phone:this.data.phone, // 手机号
        map_address:this.data.address, // 定位地址
        address:this.data.address, // 收货地址
        province:this.data.province,// 省
        city:this.data.city, // 市
        district:this.data.district, // 区
        longitude:this.data.longitude, // 经度
        latitude:this.data.latitude, // 纬度
        detail_address:this.data.addressdetail, // 地址详情
        check_edit:false,
        tag:this.data.curLabel, // 地址标签
      }
      updateaddress(data).then(res=>{
        if(res.code==0){
          my.navigateBack({
            url:'/package_my/pages/myaddress/myaddress'
          });
        }else{
          my.showToast({
            type:'none',
            content:res.msg,
            duration:1000
          });
        }
      })
    }else{
      var data = {
        _sid:app.globalData._sid,
        sex:this.data.sex,
        name:this.data.name, // 收货人姓名
        phone:this.data.phone, // 手机号
        map_address:this.data.address, // 定位地址
        address:this.data.address, // 收货地址
        province:this.data.province,// 省
        city:this.data.city, // 市
        district:this.data.district, // 区
        longitude:this.data.longitude, // 经度
        latitude:this.data.latitude, // 纬度
        shop_id:this.data.shop_id, // 门店
        detail_address:this.data.addressdetail, // 地址详情
        tag:this.data.curLabel, // 地址标签
      }
      addressCreate(data).then(res=>{
        if(res.code==0){
          if(this.data.order==1){
            my.navigateBack({
              url:'/pages/home/orderform/selectaddress/selectaddress'
            })
          }else{
            my.navigateBack({
              url:'/package_my/pages/myaddress/myaddress'
            });
          }
        }else{
          my.showToast({
            type:'none',
            content:res.msg,
            duration:1000
          });
        }
      })
    }
  },
  // 删除地址
  modalShowFN(){
    this.setData({
      modalShow:true
    })
  },
  modalhideFN(){
    this.setData({
      modalShow:false
    })
  },
  
  rmaddress(){
    var data = {
       _sid:app.globalData._sid,
       address_id:this.data.addressId
    }
    deleteaddress(data).then(res=>{
      if(res.code==0){
        this.setData({
          modalShow:false
        })
        my.navigateBack({
          url:'/package_my/pages/myaddress/myaddress'
        });
      }else{
        my.showToast({
          type:'none',
          content:res.msg,
          duration:1000
        });
      }
    })
  },
});
