<template>
	<view class="">
		<view class="cu-bar bg-white solid-bottom ">
			<view class="action">
				<text class="cuIcon-titles text-blue "></text> 累计已接任务:{{total}}次
			</view>
		</view>
		
		<view v-if="reportlist.length >0">
			<view class="cu-card article  no-card margin-top" v-for="(item, index) in reportlist" :key="index">
				<view class="cu-item shadow" @tap="goUrl" :data-id ="item.id">		
					<view class="title">
						<view class="text-cut">
							<view :class="[item.type==1 ? 'bg-yellow': 'bg-red' ]" class="cu-tag  light ">{{item.type==1 ? "学生报障":"教师报障"}}</view>							
							<view class='cu-tag xl' >{{reportStatus[item.status]}}</view>	
							{{item.description}}
						</view>						
					</view>
					<view class="content">
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
				<view class="content-alert text-center">你还没有任务，快去和小伙伴们做任务吧</view>		
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
				member_id:'',
				reportlist:[],
				reportStatus:{},
				page_num :0,
				page_size:7,
				total_page:"",
				total:""
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
			getMytask:function(e){
				let that = this;
				utils.request(api.member + this.member_id+"/reports"
				,{page_size:this.page_size ,page_num : ++this.page_num },
				"GET","application/json").then(res=>{
					if(res.code == 200){	
						that.reportlist = that.reportlist.concat(res.data.list)  ;
						that.total_page = res.data.total_page;
						that.total = res.data.total;
					}
				})
			}
		},
		onLoad(){
			this.member_id = app.globalData.member_id;
			this.reportStatus = app.globalData.MemreportShowStatus;
		},
		onShow(){
			this.getMytask();
		},
		onReachBottom() {
			if(this.page_num<this.total_page)
			{	
				this.getMytask();
			}
			else{
				utils.showErrorToast("到底啦！")
			}
		},
		onPullDownRefresh() {
			this.getMytask();
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
