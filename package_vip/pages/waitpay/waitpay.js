import{imageUrl}from '../../../pages/common/js/baseUrl'
Page({
  data: {
    imageUrl,


  // 地址
    name:'',

    sex:0,

    phone:'',

    address:'',

    labelList:['学校','家','公司'],

    curLabel:0
  },
  onLoad() {},




// 地址
  changeSex(){
    const {sex} = this.data;

    this.setData({
      sex:sex === 0? 1: 0
    })
  },

changeCur(e){
  let curLabel = e.currentTarget.dataset.cur
  if(curLabel === this.data.curLabel) curLabel = '-1'
  this.setData({curLabel})
},

handelChange(e){
  let {key} = e.currentTarget.dataset;
  let {value} = e.detail;
  this.setData({[key]:value})
}


});
