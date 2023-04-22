<template>
	<view>
		<view class="head text-white text-xl">
			<view class="info_container padding-top">
				<view class="userInfo ">欢迎你, {{memberInfo.dept}}{{memberInfo.position}} {{memberInfo.name}}</view>
				<view class="userInfo  margin-top"> {{memberInfo.campus}}</view>		
				<view class="userInfo margin-top ">效绩值:{{memberInfo.merits}}</view>
				<view class="userInfo status text-green margin-top" v-if="memberInfo.is_tenure == true">●任职期间</view>
				<view class="userInfo status text-gray margin-top" v-else>●非任职期间</view>
			</view>
		</view>
		<view class="cu-list menu card-menu sm-border margin-top" >
			<view class="cu-item" @click="goUrl('../employee/getTask')">
				<view class="content" >
					<text class="cuIcon-list text-blue"></text>
					<text class="text-grey">领取任务</text>
				</view>
			</view>
			<view class="cu-item" @click="goUrl('../employee/myTask')">
				<view class="content">
					<text class="cuIcon-edit text-blue"></text>
					<text class="text-grey">已接任务</text>
				</view>
			</view>		
			<view class="cu-item" @click="goUrl('../employee/myMerits')">				
				<view class="content">
					<text class="cuIcon-edit text-blue"></text>
					<text class="text-grey">效绩记录</text>
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
				member_id :'',
				memberInfo: '',
			};
		},
		methods: {
			goUrl:function(url){
				
					if(this.memberInfo.is_tenure === false){
						if(url=="../employee/getTask"){
							utils.showErrorToast("非任职人员无相关权限")
							return;
						}else{
							utils.navigete(url)
							return;
						}
					}else{
						utils.navigete(url)
					}
							
			},
			getMemberInfo:function(){
				utils.request(api.member+ this.member_id +'/info',{},"GET").then(res=>{
					if(res){
						this.memberInfo = res;
						app.globalData.member_campusId = res.campus == '大学城校区'? 1:2;
					}
				})
			}
		},
		onLoad(){
			this.member_id = wx.getStorageSync("member_id");
			this.getMemberInfo();
		}
	}
</script>

<style>
	page
	{
		height: 100%;
		background-color: #f7f7f7;
	}
	.head{
		height: 400rpx;
		width: 100%;
		background-color: #0080FF;
 		border-bottom-left-radius: 10px ;
		border-bottom-right-radius: 10px ;
	}

	.userInfo{
		margin-left: 5%;
	}
</style>
