<template>
	<view class="container padding">
		<textarea  @input="bindInput" placeholder="请填写备注" maxlength="300"></textarea>
		<button class="bg-blue margin-top" @tap="submitNote">提交</button>
	</view>
</template>

<script>
	const utils = require("../../utils/util.js")
	const api = require("../../config/api.js")
	const app = getApp();
	export default {
		data() {
			return {
				note:"",
				member_id :"",
				reportId: ""
			}
		},
		methods: {
			bindInput:function(e){
				this.note = e.detail.value
			},
			/**
			 * 修改备注
			 */
			submitNote:function(){
				if(this.note.length!=0){
					utils.request(api.member+this.reportId+"/note",
					{note:this.note ,operator:this.member_id},
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
					utils.showErrorToast("备注不能为空")
				}
				
			},
		},
		onLoad(options){
			this.reportId = options.reportId
			this.member_id = app.globalData.member_id;
		}
	}
</script>

<style>
textarea{
	width: 100%;
	height: 700rpx;
	border: #000000 1px solid;
}

</style>
