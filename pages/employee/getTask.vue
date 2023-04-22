<template>
	<view class="">
		<view class="cu-bar bg-white solid-bottom ">
			<view class="action">
				<text class="cuIcon-titles text-blue "></text> 可接的任务
			</view>
		</view>
		
		<view v-if="reportlist.length>0">
			<view class="cu-card article  no-card margin-top" v-for="(item, index) in reportlist" :key="index">
				<view class="cu-item shadow" @tap="goUrl" :data-id ="item.id">		
					<view class="title">
						<view class="text-cut">		
							<view :class="[item.type==1 ? 'bg-yellow': 'bg-red' ]" class="cu-tag  light ">{{item.type==1 ? "学生报障":"教师报障"}}</view>
							{{item.description}}	
						</view>
					</view>
					<view class="content" >
						<image v-bind:src="imgItem" mode="aspectFill" v-for=" (imgItem,index) in item.picture_list " 
						@click.stop="ViewImage" :data-url="imgItem" :key = "index"></image>
					</view>
					<view class="content margin-top flex justify-between">
						<view class="text-gray text-df">{{item.gmt_create | formatDate}}</view>
						<view class="text-gray text-df" >查看详情></view>
					</view>
				</view>
			</view>
		</view>
		<view v-else>
			<view class="cu-card">
				<view class="content-alert text-center">∑(っ°Д°;)っ现在啥都没有嗷</view>		
			</view>
		</view>	
	</view>
</template>

<script>
	const utils = require('../../utils/util.js')
	const api = require('../../config/api.js')
	const app = getApp()
	export default {
		data() {
			return {
				reportlist:'',
				campus_id:'',
				member_campusId: ''
			};
		},
		methods: {
			ViewImage: function(e) {
				let arr = [];
				arr.push(e.currentTarget.dataset.url);
				wx.previewImage({
					urls: arr,
					current: e.currentTarget.dataset.url
				});
			},
			goUrl:function(e){
				let id = e.currentTarget.dataset.id
				utils.navigete('reportDetail?id='+id)
			},
			getReports:function(){
				utils.request(api.member+this.member_campusId+'/getreports',{status:0},"GET").then(res=>{
					if(res.code == 200){
						this.reportlist = res.data.list
					}
				})
			}
		},
		onLoad(){
			this.reportStatus = app.globalData.reportStatus;
			this.campus_id = app.globalData.campus_id;
			this.member_campusId =  app.globalData.member_campusId; //职员校区
		},
		onShow(){
			this.getReports();
		},
		onPullDownRefresh() {
			this.getReports();
            setTimeout(function () {
                uni.stopPullDownRefresh();
            }, 300);
		}
	}
</script>

<style>
	page
	{
		height: 100%;
		background-color: #f7f7f7;
	}
	.content-alert{
		width: 80%;	
		margin:  0 auto;
		margin-top: 400rpx;
	}
	
</style>
