import {ajax} from './ajax';
const loginPage = {
  loginByAuth: '/juewei-api/alimini/loginByAuth',  //授权登录
  loginByAliUid: '/juewei-api/alimini/loginByAliUid',  //用户自动登录
  getuserInfo: '/juewei-api/alimini/getUserInfo',   //获取用户信息
}
export const loginByAliUid = (auth_code,nick_name,head_img,_sid) => ajax(loginPage.loginByAliUid,{auth_code,nick_name,head_img,_sid});

export const getuserInfo = (_sid) => ajax(loginPage.getuserInfo,{_sid});

export const loginByAuth = (_ali_uid,phone,_sid,nick_name,head_img) => ajax(loginPage.loginByAuth,{_ali_uid,phone,_sid,nick_name,head_img});