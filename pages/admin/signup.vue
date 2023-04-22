<template>
	<view>
	<form  @submit="formSubmit">
	
        <view class="cu-form-group">
			<view class="title">邀请码：</view>
			<input placeholder=" " name="invite_code"></input>
		</view>
			
			
		<view class="padding flex flex-direction">
			<button form-type="submit" class='cu-btn bg-blue lg'>提交</button>
			<button form-type="reset" class='cu-btn bg-grey lg margin-top'>重置</button>
		</view>

	</form>
	
<canvas canvas-id="attendCanvasId" class="mycanvas" :style="{width:canvasWidth,height:canvasHeight}"></canvas>

	</view>
</template>

<script>
	const utils = require('../../utils/util.js')
	const api = require('../../config/api.js'); 
	const app = getApp();
	export default{
		data(){
				return{
					    id: -1,
						user_id:"",
                        member_id:"",
						canvasWidth:0,
						canvasHeight:0
			}			
		},
		methods:{
			formSubmit: function (e) {
					let data = e.detail.value;
					data.member_id = this.member_id;
				utils.request(  api.admin + 'signup', 
                                data, 
                                'PUT', 
                                'application/json').then(res=>{
					if (res.code == 200){
						// utils.showSuccessToast(res.msg)
                        wx.setStorageSync('is_admin', 1)
						wx.showModal({
							content:"已成为管理员",
							showCancel:false,
							success(res){
								if(res.confirm){
                                    wx.switchTab({
                                        url:"../index/index"
                                    })
								}
							}
							
						})
					}else{
						utils.showErrorToast(res.msg)
					}
				})

					
			},
			onShareAppMessage: function () {
					
			},
					  
		},
		onLoad(){
			let accessToken = wx.getStorageSync("access_token");

			if(app.globalData.isLogin == false || accessToken == ""){
				utils.showErrorToast("尚未登录");
				setTimeout(function(){
					wx.switchTab({
						url:"../user/user"
					})
				},1500)

			}
			this.user_id = wx.getStorageSync("user_id");
			this.member_id = wx.getStorageSync("member_id");
			
		}
		
	}
</script>

<style>
	.container{
	  padding: 2rem;
	  font-size: 1rem;
	  line-height: 2rem;
	}
	
	.input{
	  font-size: 0.7rem;
	  color: black;
	  flex-grow: 3;
	  border: 1px;
	  display: inline-block;
	  border-radius: 0.3rem;
	  box-shadow: 0 0 0.15rem #0080ff;
	  padding: 0.3rem;
	}
	
	.inputbox{
	  width: 700rpx;
	  height: 50rpx;
	  margin-left: 10rpx;
	  margin-right: 10rpx;
	  margin-top: 10rpx;
	}
	
	
	.textarea {
	  width: 700rpx;
	  height: 500rpx;
	  margin-left: 10rpx;
	  margin-right: 10rpx;
	  margin-top: 10rpx;
	}
	
	.submitbtn{
	  width: 650rpx;
	  height: 100rpx;
	  margin: 0 auto;
	  margin-top: 10px;
	  margin-bottom: 10px;
	}
	.mycanvas{
		position:absolute;
		left: -1000px;
		top: 1000px;
	}
</style>
