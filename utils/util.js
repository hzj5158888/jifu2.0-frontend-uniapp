var api = require('../config/api.js');
var app = getApp();
function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 刷新token
 */
function refreshToken(accessToken){
	console.log(accessToken)
	// wx.request({
	//     url: url,
	//     data: data,
	//     method: method,
	//     header: {
	//         'Content-Type': header,
	//         'Authorization': 'Bearer '+ accessToken
	//     },
	//     success: function (res) {
	//         wx.hideLoading();
	// 		if(res.data.code == 401){
	// 			 refreshToken(accessToken)
	// 		}
	// 		resolve(res.data);
			 
	//     },
	//     fail: function (err) {
	//         reject(err)
	//     }
	// })
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method, header = "application/x-www-form-urlencoded") {
    wx.showLoading({
        title: '加载中...',
    });
    return new Promise(function (resolve, reject) {
		let accessToken =  wx.getStorageSync('access_token');
        wx.request({
            url: url,
            data: data,
            method: method,
            header: {
                'Content-Type': header,
                'Authorization': 'Bearer '+ accessToken
            },
            success: function (res) {
                wx.hideLoading();
				if(res.data.code == 401){
					 refreshToken(accessToken)
					 wx.showModal({
						 title:res.data.msg,
						 complete() {
							app.globalData.isLogin = false;
							// wx.setStorageSync("access_token","");
						 	wx.switchTab({
								url:"/pages/user/user"
							})
						 }
					 })
				}
				resolve(res.data);
				 
            },
            fail: function (err) {
                reject(err)
            }
        })
    });
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
    return new Promise(function (resolve, reject) {
        wx.checkSession({
            success: function () {
                resolve(true);
            },
            fail: function () {
                reject(false);
            }
        })
    });
}

/**
 * 调用微信登录
 */
function wxLogin() {
    return new Promise(function (resolve, reject) {
        wx.login({
            success: function (res) {
                if (res.code) {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            fail: function (err) {
                reject(err);
            }
        });
    });
}

function redirect(url) {

    //判断页面是否需要登录
    if (false) {
        wx.redirectTo({
            url: '/pages/user/user'
        });
        return false;
    } else {
        wx.redirectTo({
            url: url
        });
    }
}

function navigete(url){
	wx.navigateTo({
		url:url
	})
}

function toLogin(){
	wx.switchTab({
		url:'/pages/user/user'
	})
}


function showErrorToast(msg) {
    wx.showToast({
        title: msg,
		icon: 'none',
		duration:2000
    })
}

function showSuccessToast(msg) {
    wx.showToast({
        title: msg,
		duration:2000
    })
}


module.exports = {
    formatTime,
    request,
    redirect,
    showErrorToast,
    showSuccessToast,
    checkSession,
    wxLogin,
	navigete,
	toLogin,
	refreshToken
}


