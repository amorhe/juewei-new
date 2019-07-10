Page({
  data: {},
  onLoad() { },
  showConfirm() {
  if(false){
  
   return my.confirm({
      content: '是否兑换“快乐柠檬全场 2 元代金券”将消耗你的18积分',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: result => {
        console.log(result)
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
