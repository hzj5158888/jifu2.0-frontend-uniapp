<template>
	<view class="container">
		<view class="cu-bar bg-white solid-bottom ">
			<view class="action">
				<text class="cuIcon-titles text-blue "></text>
				报障详情
			</view>
		</view>

		<view class="padding bg-white solid-bottom justify-between flex">
			<view class="cu-tag xl">{{ reportStatus[reportDetail.status] }}</view>
			<view class="text-grey">{{ reportDetail.campus_info.campus_name }}</view>
		</view>

		<view class="pic-container cu-card article no-card">
			<view class="cu-item shadow">
				<view class="cu-bar bg-white solid-bottom ">
					<view class="action"><text class="cuIcon-titles text-blue "></text>问题描述</view>
				</view>
				<view class="content  margin-top">
					<image v-bind:src="item.img_url" mode="aspectFill" v-for="(item, index) in reportDetail.picture_list" @tap="ViewImage" :data-url="item.img_url"></image>
				</view>
				
				<view class="content  margin-top">{{ reportDetail.description }}</view>
			</view>
		</view>

		<view class="cu-list menu">
			<view class="cu-item">
				<view class="content">
					<text class="text-grey info">姓名</text>
					{{ reportDetail.name }}
				</view>
			</view>
			<view class="cu-item" v-if="reportDetail.type == 1">
				<view class="content">
					<text class="text-grey info">学号</text>
					{{ reportDetail.student_num }}
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-grey info">手机号</text>
					{{ reportDetail.phone }}
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-grey info">具体地址</text>
					{{ reportDetail.address }}
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-grey info">提交时间</text>
					{{ reportDetail.gmt_create | formatDate }}
				</view>
			</view>
			<view class="cu-item" v-if="reportDetail.unable_reason">
				<view class="content">
					<text class="text-grey info">无法处理原因</text>
					{{ reportDetail.unable_reason }}
				</view>
			</view>
		</view>
		<!--工作团队start-->
		<view v-if="reportDetail.status != 0 || reportDetail.status != 5">
			<view class="cu-bar bg-white solid-bottom ">
				<view class="action">
					<text class="cuIcon-titles text-blue "></text>
					工作团队
				</view>
			</view>
			<view class="padding add-member justify-around flex">		
				<view class="avatar-container text-center" v-for="(member,index) in reportDetail.report_group_members" :key="index">
					<view class="cu-avatar lg round " :style="'background-image: url('+ member.avter_url +');'">
					</view>
					<view class="name">{{member.name}}</view>		
				</view>	
			</view>
		</view>
		<!--工作团队end-->
		<!--评分展示start-->
		<view v-if="reportDetail.evaluate > -1">
			<view class="cu-bar bg-white solid-bottom ">
				<view class="action">
					<text class="cuIcon-titles text-blue "></text>
					服务评价
				</view>
			</view>
			<view class="padding-sm">
				<view class="padding flex rate-container text-center">
					<text
						class="xxl  cuIcon-favorfill margin-left padding"
						:class="reportDetail.evaluate - 1 >= index ? 'text-yellow' : 'text-gray'"
						v-for="(item, index) in 5"
					></text>
				</view>
			</view>
		</view>

		<!--评分展示end-->

		<view class="edit margin-top" v-if="reportDetail.status == 0 || reportDetail.status == 1">
			<view class="flex flex-direction padding btn-container"><button class="cu-btn round lg padding bg-blue" @tap="cancelReport">撤销保障</button></view>
		</view>
		<view class="edit margin-top" v-if="reportDetail.status == 3 && reportDetail.evaluate == -1">
			<view class="flex flex-direction padding btn-container"><button class="cu-btn round lg padding bg-blue" @tap="showModal">服务评价</button></view>
		</view>

		<view class="cu-modal bottom-modal" :class="modalName == 'show' ? 'show' : ''" @tap.stop="hideModal">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-blue" @tap="hideModal">取消</view>
					<view class="action text-green" @tap="confirmSubmit" v-if="!disabled">确定</view>
					<view class="action text-gray" v-else>确定</view>
				</view>
				<view class="padding-sm">
					给个五星好评吧
					<view class="padding flex rate-container" :key="index">
						<text
							class="xxl  cuIcon-favorfill margin-left padding"
							:class="starIndex >= index ? 'text-yellow' : 'text-gray'"
							v-for="(item, index) in starCount"
							@click.stop="chooseStart"
							:data-index="index"
						></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const utils = require('../../utils/util.js');
const api = require('../../config/api.js');
const app = getApp();
export default {
	data() {
		return {
			user_id: '',
			reportDetail: '',
			reportId: '',
			id: '',
			reportStatus: '',
			modalName: '',
			starCount: 5,
			starIndex: -1 //星星索引
		};
	},
	methods: {
		//提交评价
		confirmSubmit: function() {
			let that = this;
			utils
				.request(
					api.report + this.reportId + '/evaluation',
					{
						grade: this.starIndex + 1,
						user_id: this.user_id
					},
					'PUT',
					'application/json'
				)
				.then(res => {
					if (res.code == 200) {
						utils.showSuccessToast(res.msg);
						setTimeout(function() {
							that.getReportDetail();
						}, 2000);
					} else {
						utils.showErrorToast(res.msg);
					}
				});
		},
		chooseStart: function(e) {
			let index = e.currentTarget.dataset.index;
			this.starIndex = index;
		},
		hideModal: function() {
			this.modalName = '';
			this.starIndex = -1;
		},
		showModal: function() {
			this.modalName = 'show';
		},
		ViewImage: function(e) {
			let arr = [];
			arr.push(e.currentTarget.dataset.url);
			wx.previewImage({
				urls: arr,
				current: e.currentTarget.dataset.url
			});
		},
		getReportDetail: function() {
			let that = this;
			utils.request(api.report + this.reportId, {}, 'GET', 'application/json').then(res => {
				if (res.code == 200) {
					this.reportDetail = res.data;
				}
			});
		},
		cancelReport: function() {
			let that = this;
			wx.showModal({
				title: '确认要取消报障吗',
				success(res) {
					if (res.confirm) {
						utils.request(api.report + that.reportDetail.id + '/cancel', { user_id: that.user_id }, 'PUT', 'application/json').then(res => {
							if (res.code == 200) {
								utils.showSuccessToast(res.msg);
								setTimeout(function() {
									wx.navigateBack();
								}, 2000);
							} else {
								utils.showErrorToast(res.msg);
							}
						});
					}
				}
			});
		}
	},
	onLoad(options) {
		this.user_id = app.globalData.user_id;
		this.reportId = options.id;
		this.reportStatus = app.globalData.reportStatus;
		this.getReportDetail();
	}
};
</script>

<style>
page {
	height: 100%;
}
.container {
	overflow: scroll;
	padding-bottom: 100rpx;
}
.info {
	display: inline-block;
	width: 150rpx;
}
.edit {
	background-color: #ffffff;
	width: 100%;
	height: 100rpx;
}
.rate-container {
	margin: 0 auto;
}
</style>
