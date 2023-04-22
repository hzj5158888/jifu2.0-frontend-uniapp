<template>
	<view class="container" :style="{ overflow: overflow }">
        <view class="cu-bar bg-white solid-bottom ">
			<view class="action">
				<text class="cuIcon-titles text-blue "></text>
				每次进入都会刷新邀请码。每位管理员最多只能邀请三名新管理员新加入
			</view>
		</view>
		<!--报障详情start-->

		<view class="cu-list menu" :class="[menuBorder ? 'sm-border' : '', menuCard ? 'card-menu margin-top' : '']">
			<view class="cu-item" @click="copyCode" :data-invite_code="invite_code">
				<view class="content">
					<text class="text-grey info">邀请码</text>
					{{ invite_code }}
				</view>
				<view class="action">
					<button class="cu-btn bg-blue shadow">复制</button>
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
			overflow: 'scroll',
			member_id: '',
			invite_code: '',
		};
	},
	methods: {
		copyCode: function(e) {
			wx.setClipboardData({
				data: e.currentTarget.dataset.invite_code,
				success(res) {
					wx.getClipboardData();
				}
			});
		},
		getInviteCode: function() {
			let that;
			utils.request(api.admin + this.member_id + '/admin_invitecode', 
            {}, 'GET', 'application/json').then(res => {
				if (res.code == 200) {
                    this.invite_code = res.data.invite_code
				} else {
                    utils.showErrorToast(res)
                }
			});
		},
		doNothing: function() {}
	},
	onLoad() {
        if (app.globalData.isLogin == false)
        {
            utils.toLogin()
            return;
        }        
		this.member_id = app.globalData.member_id;
	},
	onShow() {
        if (app.globalData.isLogin == false)
        {
            utils.toLogin()
            return;
        } 
		this.getInviteCode();
	},
	onPullDownRefresh() {
        if (app.globalData.isLogin == false)
        {
            utils.toLogin()
            return;
        } 
        
		this.getInviteCode();
        setTimeout(function () {
			uni.stopPullDownRefresh();
		}, 300);
	}
};
</script>

<style>
page {
	height: 100%;
}
/* .container{
	overflow:scroll
} */
.info {
	display: inline-block;
	width: 150rpx;
}
.edit {
	position: fixed;
	bottom: 0;
	background-color: #ffffff;
	width: 100%;
	height: 300rpx;
}
.cu-timeline {
	margin-bottom: 300rpx;
}
textarea {
	width: 100%;
}
.cu-dialog {
	max-height: 900rpx !important;
	overflow: scroll;
}
.add-member{
	width: 100%;
	overflow-x: scroll;
}

</style>
