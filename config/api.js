//生产环境
const API_BASE_URL = 'https://api.gdpujf.com/'; 

//开发环境
//const API_BASE_URL = 'http://127.0.0.1:5000/';
module.exports = {
	//首页相关
	getCarousels : API_BASE_URL + 'campus/', //获取校区轮播图
	
	//报障相关
	uploadFile :API_BASE_URL + 'file/upload', //文件上传
	report : API_BASE_URL +'report/' ,// 报障模板
	
	//文章相关
	article : API_BASE_URL + 'article/',//公众号文章
	
	//用户相关
	getUserInfo : API_BASE_URL + 'auth/info' ,//获取用户信息
	loginWx : API_BASE_URL + 'auth/login/wx/', //登录
	
	//工作人员相关
	member: API_BASE_URL + 'member/' ,
	
	//反馈
	feedBack: API_BASE_URL + 'feedback/' ,
	
}
