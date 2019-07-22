import {ajax} from './ajax'

const myObject = {
  membercard: '/juewei-api/alimini/getQRcode',    // 二维码
}

export const membercard = (_sid) => ajax(myObject.membercard,{_sid},"GET");