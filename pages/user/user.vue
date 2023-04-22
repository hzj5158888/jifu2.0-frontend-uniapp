<template>
	<view>		
			<view class="user-header">
				<view  v-if="flag " class="uerpic-container">
						<open-data class="userAvatarUrl" lang="zh_CN" type="userAvatarUrl"></open-data>
						<open-data  lang="zh_CN" type="userNickName"></open-data>
				</view>
				<view  v-else>
					<view class="btn-container padding flex flex-wrap justify-between align-center bg-white">
						<button class="cu-btn bg-blue text-white login-btn" open-type="getUserInfo"  @getuserinfo="bindGetUserInfo">登录授权</button>
					</view>
				</view>
			</view>
			
					
			<view class="cu-list menu" :class="[menuBorder?'sm-border':'',menuCard?'card-menu margin-top':'']">
				<view class="cu-item" @click="goUrl('../user/myReport')">
					<view class="content" >
						<text class="cuIcon-list text-blue"></text>
						<text class="text-grey">我的报障</text>
					</view>
				</view>
				<view class="cu-item" @click="goUrl('../user/feedBack')">
					<view class="content">
						<text class="cuIcon-edit text-blue"></text>
						<text class="text-grey">反馈建议</text>
					</view>
				</view>
				<view class="cu-item">
					<button class="cu-btn content" open-type="contact">
						<text class="cuIcon-friend text-blue"></text>
						<text class="text-grey">关于我们</text>
					</button>
				</view>			
				<view class="cu-item" @click="goUrl('../employee/index')">				
					<view class="content">
						<text class="cuIcon-group text-blue"></text>
						<text class="text-grey">职员入口</text>
					</view>						
				</view>
				<view class="cu-item" @click="logOut()">
					<view class="content">
						<text class="cuIcon-exit text-blue"></text>
						<text class="text-grey">退出账号</text>
					</view>						
				</view>
				<view class="text-center text-gray version">
					<text>version 2.0</text>
				</view>
			</view>
		</view>
	</view>

</template>

<script>

const utils = require('../../utils/util.js')	
const api = require('../../config/api.js')	
const app = getApp();
	export default {

		data() {
			return {
				flag:false,
				menuCard:true,
				code:''
			};
		},
		onLoad() {
			if(wx.getStorageSync("access_token")!==""){
				app.globalData.isLogin = true;
				app.globalData.member_id = wx.getStorageSync("member_id");
				app.globalData.user_id = wx.getStorageSync("user_id");
				this.flag = true;
			}
			
			
		},
		onReady(){
			
		},
		onShow() {
			
			this.flag = app.globalData.isLogin;
			//调用微信登录
			let that = this;
			utils.wxLogin().then(res=>{
				if (res.code) {
				  that.code = res.code
				}
			})
		},
		methods: {
			logOut:function(){
				this.flag = app.globalData.isLogin = false;
				wx.setStorageSync("access_token","");
				let that = this;
				utils.wxLogin().then(res=>{
					if (res.code) {
					  that.code = res.code
					}
				})
			},
			goUrl:function(url){
				let is_member = wx.getStorageSync("is_member");
				let user_id = app.globalData.user_id
				if(user_id == null || user_id === ''){
					utils.showErrorToast("请先登录")
					return;
				}
				
				if(is_member != 1 && url === '../employee/index'){
					utils.showErrorToast("没有相关权限")
					return;
				}
				
				
					wx.navigateTo({
					url: url
					})
				
				
			},
			bindGetUserInfo: function(e) {
				
				let that = this;
				if (e.detail.userInfo) {
				  utils.request(api.loginWx, {
					code: that.code,
					userInfo: e.detail.rawData
				  }, 'POST', 'application/json').then(res => {
					if (res.code == 200) {
					  //存储用户信息
					  wx.setStorageSync('user_id', res.data.user_id);
					  wx.setStorageSync('access_token', res.data.access_token);
					  wx.setStorageSync('refresh_token', res.data.refresh_token);
					  wx.setStorageSync('is_member', res.data.is_member);
					  wx.setStorageSync("member_id",res.data.member_id);
					  app.globalData.user_id = res.data.user_id;
					  app.globalData.isLogin = true;
					  app.globalData.member_id = res.data.member_id;
					  this.flag = true;
					  }
				  });
				}else{
					utils.showErrorToast("取消了授权")
				}
			}
		},

	}
</script>

<style>
	page 
	{
		height: 100%;
		background-color: #f7f7f7;
	}

	
	.user-header{
		height: 200rpx;
		background-color: white;
	}
	
	.userAvatarUrl{
	  display: block;
	  margin-right: 30rpx;
	  width: 120rpx;
	  height: 120rpx;
	  border-radius: 50%;
	  border: 5rpx solid #fff;
	  overflow: hidden;
	}
	
	.uerpic-container{
		position: relative;
		top: 50%;
		left: 30rpx;
		transform: translateY(-50%);
		display: flex;
		line-height: 125rpx;
	}
	.login-btn{
		margin:0 auto;
		margin-top: 60rpx;
	}
	.version{
	  position:fixed;
	  bottom:20rpx;
	  display:flex;
	  width:100%;
	  justify-content:center;
	}
</style>
