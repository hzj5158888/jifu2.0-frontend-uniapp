<template>
	<view>
	<form  @submit="formSubmit">
	
	
		<view class="cu-form-group">
			<view class="title">学生姓名：</view>
			<input placeholder="请输入真实姓名" name="name"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">学号：</view>
			<input placeholder="请输入学号" name="student_num" type="number"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">班级：</view>
			<input placeholder="请输入班级" name="class_name"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">联系电话：</view>
			<input placeholder="可以联系到您的号码" name="phone" type="number"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">具体地址：</view>
			<input placeholder="请填写生活区地址xx栋xxx宿舍号" name="address"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">上传图片（可以不上传）</view>
		</view>
		
			
		<view class="cu-bar bg-white margin-top">
			<view class="action">
				图片上传
			</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-1 grid-square flex-sub">
				<view class="bg-img" v-for="(item,i) in imgList" v-key="index" @click="ViewImage" :data-url="imgList[index]">
					<image s v-bind:src="item" mode='aspectFill'></image>
					<view class="cu-tag bg-red" @click.stop="DelImg" :data-index="index">
						<text class="cuIcon-close"></text>
					</view>
				</view>
				<view class="solids" @click="ChooseImage" v-if="imgList.length<1">
					<text class="cuIcon-cameraadd"></text>
				</view>
			</view>
		</view>
		<view class="section">
			<view class="cu-form-group ">
				<view class="title">故障的详细描述：</view>
			</view>
			<view class="cu-form-group">
				<textarea name="description" maxlength="-1"  placeholder="请仔细填写"></textarea>
			</view>
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
					    tempFilePaths: [],
					    imgList: [],
						uploadImg:[],
						user_id:"",
						canvasWidth:0,
						canvasHeight:0
			}			
		},
		methods:{
			formSubmit: function (e) {
				   var that = this;
				   var name = e.detail.value.name;
				   var student_num = e.detail.value.student_num
				   var user_id = this.user_id
				   var class_name = e.detail.value.class_name;
				   var phone = e.detail.value.phone;
				   var address = e.detail.value.address;
				   var description = e.detail.value.description;
				   
				
				   if (name.length < 1) {
				     wx.showToast({
				       title: '姓名不能为空',
				       icon: 'none',
				       duration: 2000
				     })
				     return;
				   }
				   if (student_num.length !== 10) {
				     wx.showToast({
				       title: '请输入符合规范的10位学号',
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
				   if (address.length < 3) {
				     wx.showToast({
				       title: '请输入符合规范的地址',
				       icon: 'none',
				       duration: 2000
				     })
				     return;
				   }
				   if (description.length < 5) {
				     wx.showToast({
				       title: '请输入符合规范的描述并不少于5个字符',
				       icon: 'none',
				       duration: 2000
				     })
				     return;
				   }
					let data = e.detail.value;
					data.campus_id = this.campus_id;
					data.user_id = this.user_id;
					data.type = 1; //学生报障1,教师报障0
					data.pic_list = this.uploadImg
				utils.request(api.report,data,"POST",'application/json').then(res=>{
					if(res.code == 200){
						// utils.showSuccessToast(res.msg)
						wx.showModal({
							content:"提交成功,工作人员会及时联系您",
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
			ChooseImage() {
				var that = this;
				wx.chooseImage({
				  count: 1, //默认9
				  sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				  sourceType: ['album', 'camera'], //从相册选择
				  success: (res) => {
				    that.imgList=res.tempFilePaths;
						that.upload();				    
				  }
				});		
			},
			ViewImage(e) {
			  wx.previewImage({
			    urls: this.imgList,
			    current: e.currentTarget.dataset.url
			  });
			},
			DelImg(e) {
			  wx.showModal({
			    title: '提示',
			    content: '确定要删除这张照片？',
			    cancelText: '取消',
			    confirmText: '删除',
			    success: res => {
			      if (res.confirm) {
			        this.imgList = []
					this.uploadImg = []
			      }
			    }
			  })
			},
			upload () {
			  let that = this;		  
			  wx.uploadFile({
			    url: api.uploadFile,
			    filePath: this.imgList[0],
			    name: 'picture',
			    success: function (res) {				 
				  let resp = JSON.parse(res.data);
			      if (resp.code == 200) {
			        wx.showToast({
			          title: '上传成功',
			          icon: 'none',
			          duration: 2000
			        });
			       	 that.uploadImg.push(resp.data) ;
			      }
			    },
			    fail: function (res) {
			      wx.hideToast();
			      wx.showModal({
			        title: '错误提示',
			        content: '上传图片失败',
			        showCancel: false,
			      })
			    }
			 });
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
