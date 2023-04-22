<template>
	<view class="container" :style="{ overflow: overflow }">
		<!--报障详情start-->
		<view class="cu-bar bg-white solid-bottom ">
			<view class="action">
				<text class="cuIcon-titles text-blue "></text>
				报障详情
			</view>
		</view>
		<view class="padding bg-white solid-bottom justify-between flex">
			<view class="status-tag">
				<view :class="[reportDetail.type == 1 ? 'bg-yellow' : 'bg-red']" class="cu-tag  light xl">{{ reportDetail.type == 1 ? '学生报障' : '教师报障' }}</view>
				<view class="cu-tag xl">{{ reportStatus[reportDetail.status].value }}</view>
			</view>

			<view class="text-grey">{{ reportDetail.campus_info.campus_name }}</view>
		</view>

		<view class="pic-container cu-card article no-card">
			<view class="cu-item shadow">
				<view class="cu-bar bg-white solid-bottom ">
					<view class="action"><text class="cuIcon-titles text-blue "></text>问题描述</view>
				</view>
				<view class="content margin-top">
					<image v-bind:src="item.img_url" mode="aspectFill" v-for="(item, index) in reportDetail.picture_list" @tap="ViewImage" :data-url="item.img_url"></image>
				</view>
				<view class="content margin-top">{{ reportDetail.description }}</view>
			</view>
		</view>

		<view class="cu-list menu" :class="[menuBorder ? 'sm-border' : '', menuCard ? 'card-menu margin-top' : '']">
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
			<view class="cu-item" @click="copyPhone" :data-phone="reportDetail.phone">
				<view class="content">
					<text class="text-grey info">手机号</text>
					{{ reportDetail.phone }}
				</view>
				<view class="action">
					<button class="cu-btn bg-blue shadow">复制</button>
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
		<!--报障详情end-->
		<!--工作团队start-->
		<view v-if="reportDetail.status != 0">
			<view class="cu-bar bg-white solid-bottom ">
				<view class="action">
					<text class="cuIcon-titles text-blue "></text>
					工作团队
				</view>
			</view>
			<scroll-view scroll-x="800rpx">
			<view class="padding add-member justify-around flex">
					<!--任务未完结状态才可以添加成员，最多只能4个-->
					<view v-if="reportDetail.status < 3">
						<view class="cu-avatar lg round " @click="addMember" data-target="RadioModal">
							<text class="cuIcon-add" ></text>
						</view>
					</view>
					<!--头像-->
					<view class="avatar-container text-center margin-left" v-for="(member,index) in reportDetail.report_group_members" :key="index">
						<view class="cu-avatar lg round " :style="'background-image: url('+ member.avter_url +');'">
						</view>
						<view class="name">{{member.name}}</view>		
					</view>
					
				
								
			</view>
			</scroll-view>
		</view>
		<!--工作团队end-->
		<!--评分展示start-->
		<view v-if="reportDetail.status >= 3">
			<view class="cu-bar bg-white solid-bottom ">
				<view class="action">
					<text class="cuIcon-titles text-blue "></text>
					服务评价
				</view>
			</view>
			<view class="padding-sm solid-bottom">
				<view class="padding flex rate-container text-center" v-if="reportDetail.evaluate>-1">
					<text
						class="xxl  cuIcon-favorfill margin-left padding"
						:class="reportDetail.evaluate - 1 >= index ? 'text-yellow' : 'text-gray'"
						v-for="(item, index) in 5"
					></text>
				</view>
				<view class="padding flex rate-container text-center" v-else> 
					用户还未进行服务评价
				</view>
			</view>
		</view>
		
		<!--评分展示end-->
		<!--操作记录start-->
		<view class="cu-bar bg-white">
			<view class="action">
				<text class="cuIcon-titles text-blue"></text>
				操作记录
			</view>
		</view>

		<view class="cu-timeline">
			<view class="cu-item" v-for="(item, index) in report_record_logs" :key="index">
				<view class="content">
					<view class="cu-capsule radius">
						{{ item.operator.dept }}{{ item.operator.position }}{{ item.operator.name }}
						<text class="text-blue"></text>
					</view>
					<view>{{ item.content }}</view>
					{{ item.time | formatDate }}
				</view>
			</view>
			<view></view>
		</view>

		<!--领取任务的操作-->
		<view class="edit " v-if="reportDetail.status == 0">
			<view class="flex flex-direction padding btn-container">
				<button class="cu-btn round lg padding bg-blue" @tap="getTask">领取任务</button>
				<button class="cu-btn round lg padding margin-top bg-blue" @tap="changeNote">添加备注</button>
			</view>
		</view>
		<!--任务进行中的操作-->
		<view class="edit " v-else-if="reportDetail.status < 3">
			<view class="flex flex-direction padding btn-container">
				<button class="cu-btn round lg padding bg-blue" @tap="showModal">修改状态</button>
				<button class="cu-btn round lg padding margin-top bg-blue" @tap="changeNote">添加备注</button>
			</view>
		</view>
		<!--完结状态的操作-->
		<view class="edit " v-else-if="reportDetail.status >= 0">
			<view class="flex flex-direction padding btn-container"><button class="cu-btn round lg padding margin-top bg-blue" @tap="changeNote">修改备注</button></view>
		</view>
		<!--无法处理的操作-->
		<view class="edit " v-if="reportDetail.status == 4">
			<view class="flex flex-direction padding btn-container"><button class="cu-btn round lg padding margin-top bg-blue" @tap="changeReason">修改无法处理原因</button></view>
		</view>

		<!--修改状态modal start-->
		<view class="cu-modal bottom-modal" :class="modalName == 'show' ? 'show' : ''" @tap="hideModal">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-blue" @tap="hideModal">取消</view>
					<view class="action text-green" @tap.stop="confirmChange" v-if="!disabled">确定</view>
					<view class="action text-gray" v-else>确定</view>
				</view>
				<view class="grid col-4 padding-sm">
					<view v-for="(item, index) in reportStatus" class="padding" :key="index">
						<button
							class="cu-btn blue lg block"
							:class="item.checked ? 'bg-blue' : 'line-blue'"
							@tap.stop="changeStatus"
							:data-status="item.code"
							:data-value="item.value"
						>
							{{ item.value }}
						</button>
					</view>
				</view>
			</view>
		</view>
		<!--修改状态modal end-->
		<!--选择工作人员modal start @touchmove.stop.prevent = "doNothing"-->
		<view class="cu-modal" :class="modalName == 'RadioModal' ? 'show' : ''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="" >
				<scroll-view scroll-y="800rpx">
					<view class="cu-form-group " v-for="(item, index) in memberList" :key="index">
						<view class="title">{{ item.name }}</view>
						<button class="cu-btn bg-blue shadow" @click="confirmInvite" :data-id="item.id" v-if="item.checked == false">邀请</button>
						<view v-else>队伍中</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!--选择工作人员modal end-->
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
			reportDetail: '',
			reportId: '',
			reportStatus: '',
			report_record_logs: '',
			modalName: '',
			readyStatus: '', //修改后的报障状态
			memberList: [],
			disabled: false,
			inviteMember: [] ,//邀请成员列表
			starCount: 5,
			starIndex: -1 //星星索引
		};
	},
	methods: {
		//服务评价星星
		hideUnableEditModal: function() {
			this.modalName = '';
		},
		changeReason: function() {
			utils.navigete("../employee/EditReason?reportId=" + this.reportId)
		},
		//领取任务
		getTask: function() {
			//状态变为待处理
			this.readyStatus = 1;
			this.confirmChange();
		},
		changeNote: function() {
			utils.navigete('../employee/changeNote?reportId=' + this.reportId);
		},
		ViewImage: function(e) {
			let arr = [];
			arr.push(e.currentTarget.dataset.url);
			wx.previewImage({
				urls: arr,
				current: e.currentTarget.dataset.url
			});
		},
		copyPhone: function(e) {
			wx.setClipboardData({
				data: e.currentTarget.dataset.phone,
				success(res) {
					wx.getClipboardData();
				}
			});
		},
		getReportDetail: function() {
			let that;
			utils.request(api.report + this.reportId, {}, 'GET', 'application/json').then(res => {
				if (res.code == 200) {
					this.reportDetail = res.data;
					this.report_record_logs = res.data.report_record_logs.reverse();
					this.reportShowStatus = app.globalData.MemreportShowStatus;
					this.reportStatus = this.doReportStatus(app.globalData.MemreportChangeStatus); //成员操作状态里面没有->用户已取消
					this.readyStatus = this.reportDetail.status;
					this.initeMember();
				}
			});
		},
		//添加队员
		addMember: function(e) {
			if (this.memberList.length == 0) {
				this.getEmployeeList();
			}

			this.modalName = 'RadioModal';
		},
		showModal: function() {
			this.modalName = 'show';
			if (this.readyStatus == this.reportDetail.status) {
				this.disabled = true;
			}
		},
		//取消
		hideModal: function(e) {
			this.modalName = null;
			let items = this.reportStatus;
			this.readyStatus = this.reportDetail.status;
			//重置
			for (let i = 0, lenI = items.length; i < lenI; ++i) {
				items[i].checked = false;
			}
			for (let i = 0, lenI = items.length; i < lenI; ++i) {
				if (items[i].code == this.reportDetail.status) {
					items[i].checked = !items[i].checked;
					break;
				}
			}
		},
		//获取全队维修人员名单
		getEmployeeList: function() {
			let campus_id = this.reportDetail.campus_id;
			let that = this;
			utils.request(api.member + campus_id + '/members', {page_size:25}, 'GET', 'application/json').then(res => {
				if (res.code == 200) {
					that.memberList = res.data.list;
					this.initeMember();
				}
			});
		},
		changeStatus: function(e) {
			let code = e.currentTarget.dataset.status;
			this.readyStatus = code;
			let items = this.reportStatus;
			//改变状态如果和现在一样，不给提交。
			if (this.readyStatus != this.reportDetail.status && this.readyStatus > this.reportDetail.status) {
				this.disabled = false;
			} else {
				this.disabled = true;
			}

			for (let i = 0, lenI = items.length; i < lenI; ++i) {
				items[i].checked = false;
			}
			for (let i = 0, lenI = items.length; i < lenI; ++i) {
				if (items[i].code == code) {
					items[i].checked = !items[i].checked;
					break;
				}
			}
		},
		//确认修改状态
		confirmChange: function() {
			var that = this;
			var readyStatus = that.readyStatus;
			wx.showModal({
				title: '提示',
				content: this.readyStatus == 1 ? '确认领取此任务吗' : '你确认要修改状态吗',
				success(res) {
					if (res.confirm) {
						utils
							.request(api.member + that.reportId + '/status', { operator: that.member_id, status: Number(that.readyStatus) }, 'POST', 'application/json')
							.then(res => {
								if (res.code == 200) {
									that.hideModal();
									utils.showSuccessToast(res.msg);
									
									setTimeout(function() {		
										
										if (readyStatus == 4) {
											that.changeReason();										
											return;
										}else{
											that.getReportDetail();
										}
									}, 2500);
								} else {
									utils.showErrorToast(res.msg);
								}
							});
					} else if (res.cancel) {
						that.modalName = '';
						that.hideModal();
					}
				}
			});
		},
		/**
		 * 处理报障状态
		 */
		doReportStatus: function(reportStatus) {
			let items = reportStatus;
			let arr = [];
			for (var i in items) {
				if (i == this.reportDetail.status) {
					arr[i] = { value: items[i], checked: true, code: i };
				} else {
					arr[i] = { value: items[i], checked: false, code: i };
				}
			}
			return arr;
		},

		//初始化成员列表
		initeMember: function() {
			var items = this.memberList,
				values = this.reportDetail.report_group_members;
			//this.inviteMember = [];
			for (var i = 0, lenI = items.length; i < lenI; ++i) {
				items[i].checked = false;

				for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
					if (items[i].name == values[j].name) {
						items[i].checked = true;
						//this.inviteMember.push(Number(items[i].id))
						break;
					}
				}
			}
		},
		//邀请成员
		confirmInvite: function(e) {
			let that = this;
			let id = e.currentTarget.dataset.id;
			let arr = [];
			arr.push(id);
			utils.request(api.member + this.reportId + '/invitation', { operator: this.member_id, new_group_member_ids: arr }, 'POST', 'application/json').then(res => {
				if (res.code == 200) {
					utils.showSuccessToast(res.msg);
					setTimeout(function() {
						that.getReportDetail();
					}, 1500);
				} else {
					utils.showErrorToast(res.msg);
				}
			});
		},
		doNothing: function() {}
	},
	onLoad(options) {
		this.member_id = app.globalData.member_id;
		this.reportId = options.id;
	},
	onShow() {
		this.getReportDetail();
	},
	onPullDownRefresh() {
		this.getReportDetail();
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
