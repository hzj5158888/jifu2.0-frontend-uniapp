<template>
	<view class="container padding">
		<form @submit="submitReason">
			<textarea placeholder="填写无法处理的原因" name="unable_reason" :value="unable_reason"></textarea>
			<button class="bg-blue margin-top" form-type="submit">保存</button>
		</form>
	</view>
</template>

<script>
const utils = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();
export default {
	data() {
		return {
			note: '',
			member_id: '',
			reportId: '',
			unable_reason:''
		};
	},
	methods: {
		bindInput: function(e) {
			this.note = e.detail.value;
		},
		/**
		 * 提交无法处理的原因
		 */
		submitReason: function(e) {
			let that = this;
			let formdata = e.detail.value;
			formdata.operator = this.member_id;
			utils.request(api.member + this.reportId + '/unableReason', formdata, 'POST', 'application/json').then(res => {
				if (res.code == 200) {
					utils.showSuccessToast(res.msg);
					setTimeout(function() {
						wx.navigateBack();
					}, 2000);
				} else {
					utils.showErrorToast(res.msg);
				}
			});
		},
		getReportDetail: function() {
			let that;
			utils.request(api.report + this.reportId, {}, 'GET', 'application/json').then(res => {
				if (res.code == 200) {
					this.unable_reason = res.data.unable_reason;
				}
			});
		},
	},
	onLoad(options) {
		this.reportId = options.reportId;
		this.member_id = app.globalData.member_id;
		this.getReportDetail()
	}
};
</script>

<style>
textarea {
	width: 100%;
	height: 700rpx;
	border: #000000 1px solid;
}
</style>
