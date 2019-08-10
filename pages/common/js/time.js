// 比较两个日期时间相差多少天
export const datedifference = (sDate1, sDate2) => {      
  var dateSpan,
      tempDate,
      iDays;
  sDate1 = Date.parse(sDate1);
  sDate2 = Date.parse(sDate2);
  dateSpan = sDate2 - sDate1;
  dateSpan = Math.abs(dateSpan);
  iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
  return iDays
};

// 判断门店是否营业
export const cur_dateTime = (start,end) => {
  var timestamp=new Date().getTime();
  var mytime = new Date().toLocaleDateString();
  var time1 = new Date(`${mytime} ${start}`).getTime();
  var time2 = new Date(`${mytime} ${end}`).getTime();
  // console.log(timestamp,mytime,time1,time2)
  if(time2 - timestamp < 1000 * 3600) {
    return  3    // 不足一小时
  }else if( time2 - timestamp > 1000 * 3600 && timestamp < time2 && timestamp > time1) {
    return 1   // 营业中
  }else{
    return 2    // 未营业
  }
}

// 比较两个数字大小,大到小
export const compare = (property) => {
    return (a,b) => {
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
    }
}
// 小到大
export const sortNum = (property) =>{
  return (a,b) => {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}
// export const filterShop = (a,b) => {
//   var value1 = a.goods_num,
//       value2 = b.goods_num;
//   if(value1 <= value2){
//       return a.distance - b.distance;
//   }
//   return value2 - value1;
// } 
// 时间戳转时间
export const formatTime = (number,format) => {  
  
  var formateArr  = ['Y','M','D','h','m','s'];  
  var returnArr   = [];  
  
  var date = new Date(number * 1000);  
  returnArr.push(date.getFullYear());  
  returnArr.push(formatNumber(date.getMonth() + 1));  
  returnArr.push(formatNumber(date.getDate()));  
  
  returnArr.push(formatNumber(date.getHours()));  
  returnArr.push(formatNumber(date.getMinutes()));  
  returnArr.push(formatNumber(date.getSeconds()));  
  
  for (var i in returnArr)  
  {  
    format = format.replace(formateArr[i], returnArr[i]);  
  }  
  return format;  
} 
//数据转化  
 const formatNumber = (n) => {  
  n = n.toString()  
  return n[1] ? n : '0' + n  
} 