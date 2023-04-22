<template>
	<view>
	<form  @submit="formSubmit">
	
	
		<view class="cu-form-group">
			<view class="title">学生姓名：</view>
			<input placeholder="请输入真实姓名" name="real_name"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">班级：</view>
			<input placeholder="请输入班级" name="class_name"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">联系电话：</view>
			<input placeholder=" " name="phone" type="number"></input>
		</view>
        <view class="cu-form-group">
			<view class="title">部门名称：</view>
			<input placeholder="如：技术部" name="dept_name"></input>
		</view>
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
                        campus_id:"",
						canvasWidth:0,
						canvasHeight:0
			}			
		},
		methods:{
			formSubmit: function (e) {
                   var dpet_list = new Array("技术部", "网络部", "策划部")
                
				   var that = this;
                   var user_id = this.user_id
				   var name = e.detail.value.real_name;
				   var class_name = e.detail.value.class_name;
				   var phone = e.detail.value.phone;
                   var dept_name = e.detail.value.dept_name;
				      
                
				   if (name.length < 1) {
				     wx.showToast({
				       title: '姓名不能为空',
				       icon: 'none',
				       duration: 2000
				     })
				     return;
				   }
				   if (class_name.length < 3) {
				     wx.showToast({
				       title: '请输入符合规范的班级',
				       icon: 'none',
				       duration: 2000
				     })
				     return;
				   }
				   if (phone.length != 11) {
				     wx.showToast({
				       title: '请输入符合规范的11位手机号',
				       icon: 'none',
				       duration: 2000
				     })
				     return;
				   }
                   if (dpet_list.indexOf(dept_name) == -1) {
                    wx.showToast({
                        title: '请输入正确的部门名',
                        icon: 'none',
                        duration: 2000
                    })
                    return;
                   }

					let data = e.detail.value;
					data.campus_id = this.campus_id;
                    console.log(data.campus_id)
				utils.request(  api.member + this.user_id + '/signup', 
                                data, 
                                "PUT", 
                                'application/json').then(res=>{
					if (res.code == 200){
						// utils.showSuccessToast(res.msg)
                        wx.setStorageSync("is_member", 1)
                        wx.setStorageSync("member_status", res.data.member_status)
                        wx.setStorageSync("member_id", res.data.member_id)
                        app.globalData.member_id = res.data.member_id;
						wx.showModal({
							content:res.data.member_status === 0 ? '等待审核' : '审核成功',
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
			this.campus_id = wx.getStorageSync("campus_id");
			console.log(wx.getStorageSync("campus_id"))
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
