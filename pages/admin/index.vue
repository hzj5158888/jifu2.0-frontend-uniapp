<template>
	<view>
		<view class="head text-white text-xl">
			<view class="info_container padding-top">
				<view class="userInfo ">欢迎你, 管理员 {{memberInfo.name}}</view>
				<view class="userInfo status text-green margin-top" v-if="memberInfo.is_tenure == true">●任职期间</view>
				<view class="userInfo status text-gray margin-top" v-else>●非任职期间</view>	
			</view>
		</view>
		<view class="cu-list menu card-menu sm-border margin-top" >
			<view class="cu-item" @click="goUrl('../admin/memberManager')">
				<view class="content" >
					<text class="cuIcon-list text-blue"></text>
					<text class="text-grey">职员管理</text>
				</view>
			</view>
			<view class="cu-item" @click="goUrl('../admin/memberInviteCode')">
				<view class="content">
					<text class="cuIcon-edit text-blue"></text>
					<text class="text-grey">职员邀请码管理</text>
				</view>
			</view>		
			<view class="cu-item" @click="goUrl('../admin/adminInviteCode')">				
				<view class="content">
					<text class="cuIcon-edit text-blue"></text>
					<text class="text-grey">管理员邀请码获取</text>
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
				utils.navigete(url)		
			},
			getMemberInfo:function(){
				utils.request(api.member+ this.member_id +'/info',
                {},"GET").then(res=>{
					if(res){
						this.memberInfo = res;
					}
				})
			}
		},
		onLoad(){
            if (app.globalData.isLogin == false)
            {
                console.log(app.globalData.isLogin)

                utils.toLogin()
                return;
            } 
			this.member_id = wx.getStorageSync("member_id");
			this.getMemberInfo();

		},
        onShow(options) {
            if (app.globalData.isLogin == false)
            {
                utils.toLogin()
                return;
            } 

            if (typeof options == 'undefined' || options.refresh != 1)
                return;
            
            this.getMemberInfo()
	    },
	}
</script>

<style>
	page
	{
		height: 100%;
		background-color: #f7f7f7;
	}
	.head{
		height: 200rpx;
		width: 100%;
		background-color: #0080FF;
 		border-bottom-left-radius: 10px ;
		border-bottom-right-radius: 10px ;
	}

	.userInfo{
		margin-left: 5%;
	}
</style>
