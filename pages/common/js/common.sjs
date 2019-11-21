const getImgUrl =  function (url) {
	return url.indexOf('imgcdnjwd.juewei.com') > -1 ? url : 'http://imgcdnjwd.juewei.com' + url;
}
export default {
	getImgUrl
};