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
  if(time2 - timestamp < 1000 * 3600) {
    return  3
  }else if( time2 - timestamp > 1000 * 3600 && timestamp < time2 && timestamp > time1) {
    return 1
  }else{
    return 2
  }
}


export const compare = (property) => {
    return (a,b) => {
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
    }
}