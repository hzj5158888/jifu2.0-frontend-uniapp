<template>
	<view>
<!-- 		<view v-for="(item,index) in logList" class="margin-top">
			<view>绩效值：+{{item.score}} 类型：{{item.type}} 经手人:{{item.operator}}</view>
			<view>{{item.create_time | formatDate}}</view>
		</view> -->
		<view v-if="logList.length >0">
			<view class="cu-card article no-card margin-top" v-for="(item, index) in logList" :key="index">
				<view class="cu-item shadow" :data-id ="item.id">
					
					<view class="title">
						<view class='cu-tag xl' >{{item.type}}</view>		
						<view class='cu-tag xl' >{{item.operator}}</view>							
						<view class="text-cut text-red">
								绩效值：+{{item.score}} 
						</view>			
					</view>
					<view class="content margin-top flex justify-between">
						<view class="text-gray text-df">{{item.create_time | formatDate}}</view>	
					</view>
					<uni-a
				</view>
			</view>		
		</view>
		<view v-else> 
			<view class="cu-card">
				<view class="content-alert text-center">你还没有任务记录，快去和小伙伴们做任务吧!</view>		
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
				logList :[],
				member_id:"",
				page_num :0,
				page_size:7,
				total_page:""
			}
		},
		methods: {
			/**
			 *获取我的效绩
			 */
			getMyMeritsLogs:function(){
				utils.request(api.member+ this.member_id +'/merits_logs',{page_size:this.page_size ,page_num : ++this.page_num }).then(res=>{
					if(res.code == 200){
						this.logList = this.logList.concat(res.data.list);
						this.total_page = res.data.total_page
					}
				})
			}
		},
		onLoad(){
			this.member_id =app.globalData.member_id;
			this.getMyMeritsLogs();
			
		},
		onPullDownRefresh() {
			this.getMyMeritsLogs();
		},
		onReachBottom() {
			if(this.page_num<this.total_page)
			{	
				this.getMyMeritsLogs();
			}
			else{
				utils.showErrorToast("到底啦！")
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
	.content-alert{
		width: 80%;	
		margin:  0 auto;
		margin-top: 400rpx;
	}
</style>
