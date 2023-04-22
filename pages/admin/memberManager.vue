<template>
	<view class="">
		<view class="cu-bar bg-white solid-bottom ">
			<view class="action">
				<text class="cuIcon-titles text-blue "></text> 职员列表
			</view>
		</view>
		
		<view v-if="memberlist.length>0">
			<view class="cu-card article  no-card margin-top" v-for="(item, index) in memberlist" :key="index">
				<view class="cu-item shadow" @tap="goUrl" :data-id ="item.id">		
					<view class="title">
						<view class="text-cut">		
							<view :class="[item.status==1 ? 'bg-green': 'bg-red' ]" class="cu-tag  light ">{{item.status==1 ? "已审核":"未审核"}}</view>
							 {{' ' + item.class_name + ' ' + item.name}}	
						</view>
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
import { unionTypeAnnotation } from '@babel/types';

	const utils = require('../../utils/util.js')
	const api = require('../../config/api.js')
	const app = getApp()
	export default {
		data() {
			return {
				memberlist:'',
				admin_memberid: ''
			};
		},
		methods: {
			goUrl:function(e){
				let id = e.currentTarget.dataset.id
				utils.navigete('memberDetail?id='+id)
			},
			getMembers:function(){
				utils.request(api.admin + this.admin_memberid + '/member/info/get',
                {status:0},"GET").then(res=>{
					if(res.code == 200){
						this.memberlist = res.data.list
					}
				})
			}
		},
		onLoad(){
            if (app.globalData.isLogin == false)
            {
                utils.toLogin()
                return;
            } 
			this.admin_memberid = wx.getStorageSync('member_id')
            this.getMembers();
		},
		onShow(options){
            if (app.globalData.isLogin == false)
            {
                utils.toLogin()
                return;
            }
            if (typeof options == 'undefined' || options.refresh != 1)
                return;
            
			this.getMembers();
		},
		onPullDownRefresh() {
            if (app.globalData.isLogin == false)
            {
                utils.toLogin()
                return;
            } 
			this.getMembers();
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
