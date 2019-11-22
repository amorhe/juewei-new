/**
 * @Description: 路由跳转
 * @author bev
 * @date 2019/9/4
 * @time 16:56
*/

/**
 * @function 切换 TabBar
 * @description 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
 * @param {String} url
 * @param {Function} success
 * @param {Function} fail
 * @param {Function} complete
 * @return {Function}
 */
export const switchTab = ({
  url,
  success = () => {},
  fail = () => {},
  complete = () => {}
}) => my.switchTab({
  url,
  success,
  fail,
  complete
 });


/**
 * @function 重启路由
 * @description 关闭所有页面，打开到应用内的某个页面
 * @param {String} url
 * @param {Function} success
 * @param {Function} fail
 * @param {Function} complete
 * @return {Function}
 */
export const reLaunch = ({
 url,
 success = () => {},
 fail = () => {},
 complete = () => {}
}) => my.reLaunch({
  url,
  success,
  fail,
  complete
});


/**
 * @function 重定向
 * @description 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabBar 页面
 * @param {String} url
 * @param {Function} success
 * @param {Function} fail
 * @param {Function} complete
 * @return {Function}
 */
export const redirectTo = ({
 url,
 success = () => {},
 fail = () => {},
 complete = () => {}
}) => my.redirectTo({
  url,
  success,
  fail,
  complete
});

/**
 * @function 页面跳转
 * @description 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabBar 页面
 * @param {String} url
 * @param {Object} query
 * @param {Function} success
 * @param {Function} fail
 * @param {Function} complete
 * @param {Object} currentTarget
 * @return {Function}
 */
export const navigateTo = ({
  url,
  query,
  currentTarget,
  success = () => {},
  fail = () => {},
  complete = () => {}
 }) => {
   // 如果在行内调用
   if (currentTarget) {
     url  = url || currentTarget.dataset.url;
     query = query || currentTarget.dataset.query;
   }
  
   // 方法调用
   if (query) {
     console.log(query);
     url = url + '?';
     Object.entries(query).forEach(([key, value]) => {
       url += `${ key }=${ value }&`
     });
     url = url.slice(0, -1);
   }
 
   //判断是h5链接还是内部链接
  if (url.indexOf('https://') < 4 && url.indexOf('https://') >-1) {
     return my.redirectTo({
       url: '/pages/webview/webview?url=' + url
     });
   } else {
     return my.navigateTo({
       url,
       success,
       fail,
       complete,
     })
   }
};
export  const navigateBack = () =>{
  my.navigateBack()
};