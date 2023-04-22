<template>
	<view class="container">
		<view class="cu-bar bg-white solid-bottom ">
			<view class="action">
				<text class="cuIcon-titles text-blue "></text>
				职员详情
			</view>
		</view>

		<view class="cu-list menu">
			<view class="cu-item">
				<view class="content">
					<text class="text-grey info">姓名</text>
					{{ memberDetail.name }}
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-grey info">校区</text>
					{{ memberDetail.campus }}
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="text-grey info">部门</text>
					{{ memberDetail.dept }}
				</view>
			</view>
            <view class="cu-item">
				<view class="content">
					<text class="text-grey info">职位</text>
					{{ memberDetail.position }}
				</view>
			</view>
            <view class="cu-item">
				<view class="content">
					<text class="text-grey info">绩效</text>
					{{ memberDetail.merits }}
				</view>
			</view>
            <view class="cu-item">
				<view class="content">
					<text class="text-grey info">任期开始</text>
					{{ memberDetail.start_time | formatDate}}
				</view>
			</view>
            <view class="cu-item">
				<view class="content">
					<text class="text-grey info">任期结束</text>
					{{ memberDetail.end_time | formatDate}}
				</view>
			</view>
            <view class="cu-item">
				<view class="content">
					<text class="text-grey info">状态</text>
					{{ memberDetail.status == 1 ? '已审核' : '未审核' }}
				</view>
			</view>
		</view>

		<view class="edit margin-top" v-if="memberDetail.status == 0">
			<view class="flex flex-direction padding btn-container"><button class="cu-btn round lg padding bg-blue" @tap="passMember">通过审核</button></view>
		</view>

        <view class="edit margin-top" v-if="memberDetail.status == 0">
			<view class="flex flex-direction padding btn-container"><button class="cu-btn round lg padding bg-blue" @tap="delMember">驳回申请</button></view>
		</view>

        <view class="edit margin-top" v-if="memberDetail.status == 1 && memberDetail.is_admin == 0">
			<view class="flex flex-direction padding btn-container"><button class="cu-btn round lg padding bg-blue" @tap="delMember">删除成员</button></view>
		</view>

        <view class="edit margin-top" v-if="memberDetail.is_admin == 0">
			<view class="flex flex-direction padding btn-container"><button class="cu-btn round lg padding bg-blue" @tap="modifyInfo">资料修改</button></view>
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
			memberDetail: '',
			member_id: '',
			modalName: '',
		};
	},
	methods: {
        modifyInfo: function() {
            this.memberDetail.member_id = this.member_id
            let memberDetail_pass = encodeURIComponent(JSON.stringify(this.memberDetail))
            utils.navigete('memberDetailModify?memberDetail=' + memberDetail_pass)
        },
		passMember: function(){
            utils.request(api.admin + 'member/info/modify/' + this.member_id, 
            {status : 1}, 'PUT', 'application/json').then(res => {
				if (res.code == 200) {
					this.memberDetail = res.data;
                } else {
                    utils.showErrorToast(res)
                }
			});
        },
        delMember: function(){
            utils.request(api.admin + 'member/del/' + this.member_id, 
            {}, 'PUT', 'application/json').then(res => {
				if (res.code == 200) {
					wx.navigateBack({
                        delta: 1,
                    })
                } else {
                    utils.showErrorToast(res)
                }
			});
        },
		getMembeDetail: function() {
			utils.request(api.admin + 'member/info/get/' + this.member_id, 
            {}, 'GET', 'application/json').then(res => {
				if (res.code == 200) {
					this.memberDetail = res.data;
                } else {
                    utils.showErrorToast(res)
                }
			});
		}
	},
	onLoad(options) {
		this.user_id = app.globalData.user_id;
		this.member_id = options.id;
		this.getMembeDetail();
	},
    onShow(options) {
        if (typeof options == 'undefined' || options.refresh != 1)
            return;
        
        this.getMembeDetail();
        if (this.memberDetail.name == '')
        {
            var pages = getCurrentPages()
            var prevpage = pages[pages.length - 2]

            prevpage.onShow({'refresh': 1});
            wx.navigateBack({
                delta: 1,
            })
        }
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
