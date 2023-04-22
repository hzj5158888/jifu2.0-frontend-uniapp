<template>
	<view class="container padding">
		<form  bindreset="formReset" @submit="formSubmit">	
			<view class="cu-form-group">
				<view class="title">联系方式：</view>
				<input placeholder="请输入联系方式(选填)" name="contact"></input>
			</view>
			<view class="cu-form-group padding-top">
				<view class="grid col-4 grid-square flex-sub">
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
			<view class="cu-form-group">
				<textarea   placeholder="请填写意见或建议" maxlength="300" name="content"></textarea>
			</view>
		<button class="bg-blue margin-top"  form-type="submit">提交</button>
		</form>
	</view>
</template>

<script>
	const utils = require("../../utils/util.js")
	const api = require("../../config/api.js")
	const app = getApp();
	export default {
		data() {
			return {
				content:"",
				user_id :"",
				reportId: "",
				tempFilePaths: [],
				imgList: [],
				uploadImg:[],
			}
		},
		methods: {
			formSubmit:function(e){
				let content = e.detail.value.content;
				let formData = e.detail.value;
				formData.user_id =this.user_id;
				if(content.length!=0){
					utils.request(api.feedBack,
					formData,
					'POST',
					'application/json').then(res=>{
						if(res.code == 200){
							utils.showSuccessToast(res.msg);
							setTimeout(function(){
								wx.navigateBack();
							},2000)
						}else{
							utils.showErrorToast(res.msg);
						}
					})
				}else{
					utils.showErrorToast("反馈内容不能为空")
				}
				
			},
			// ChooseImage() {
			// 	wx.chooseImage({
			// 	  count: 1, //默认9
			// 	  sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			// 	  sourceType: ['album', 'camera'], //从相册选择
			// 	  success: (res) => {	
			// 	    this.imgList=res.tempFilePaths;
			// 	    this.upload()
			// 	  }
			// 	});		
			// },
			ChooseImage() {
				var that = this;
				wx.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'], //从相册选择
					success: (res) => {		
							that.imgList = this.imgList.concat(res.tempFilePaths)	
							that.upload()												
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
					content: '确定删除这张照片吗？',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
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
					console.log(res)
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
									  
		},
		onLoad(options){
			this.user_id = app.globalData.user_id
		}
	}
</script>

<style>
textarea{
	height: 400rpx!important;
}

</style>
