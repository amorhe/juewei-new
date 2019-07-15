import {ajax} from './ajax'
const loginPage = {
  auth: '/juewei-api/alimini/loginByAuth',  //授权登录
  loginByAliUid: '/juewei-api/alimini/loginByAliUid',  //用户自动登录
}
export const loginByAliUid = ({auth_code}) => ajax(loginPage.loginByAliUid,{auth_code});