<template>
	<view>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index == TabCur ? 'text-blue cur' : ''" v-for="(item, index) in title" :key="index" @tap="tabSelect" :data-id="index">
					{{ title[index] }}
				</view>
			</view>
		</scroll-view>

		<view v-for="(item, titleIndex) in title" :key="titleIndex">
			<view v-if="titleIndex==status+1">
				<!--长度不为0-->
				<view v-if="reportlist.length > 0">
					<view class="cu-card article  no-card margin-top solid-bottom" v-for="(item, index) in reportlist" :key="index">
						<view class="cu-item shadow" @tap="goUrl" :data-id ="item.id">		
							<view class="title">
								<view class="text-cut">
									<view class="cu-tag bg-blue light  ">{{item.type==1 ? "学生报障":"教师报障"}}</view>
									{{item.description}}	
								</view>
							</view>
							<view class="content">
								<image v-bind:src="imgItem" mode="aspectFill" v-for=" (imgItem,index) in item.picture_list" @click.stop="ViewImage" :data-url="imgItem" 
								:key="index"></image>
							</view>
							<view class="content margin-top flex justify-between">
								<view class="text-gray text-df">{{item.gmt_create | formatDate}}</view>
								<view class="text-gray text-df"  >查看详情></view>
							</view>
						</view>
					</view>
				</view>
				<!--长度为0-->
				<view class="img-container text-center text-gray" v-else >
					<image src="../../static/images/noform.png" class="noImg"></image>
					<view v-if="status>-1">暂无{{title[TabCur]}}的报障</view>
					<view v-else>暂无报障</view>	
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
			TabCur: 0,
			scrollLeft: 0,
			title: ['全部', '待确认', '已接收', '已处理', '已完成', '无法处理', '已撤销'],
			user_id: '',
			reportlist: [],
			status: -1,
			page_num :0,
			page_size:7,
			total_page:""
		};
	},
	methods: {
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
			this.status = this.TabCur - 1;		
			this.page_num = 0;
			this.reportlist = []
			this.getMyReport();
		},
		getMyReport() {
			let that = this;
			if (this.status == -1) {
				utils.request(api.report + this.user_id + '/infos',{ page_size:this.page_size ,page_num : ++this.page_num }).then(res => {
					if(res.code == 200){
						that.reportlist = that.reportlist.concat(res.data.list);
						this.total_page = res.data.total_page
					}
					
				});
			} else {
				utils.request(api.report + this.user_id + '/infos', 
				{ status: this.status, page_size:this.page_size ,page_num : ++this.page_num }).then(res => {
					if(res.code == 200)
					{
						that.reportlist = that.reportlist.concat(res.data.list);
						this.total_page = res.data.total_page
					}
					
				});
			}
		},
		goUrl(e) {
			let id = e.currentTarget.dataset.id;
			utils.navigete('myReportDetail?id=' + id);
		},
		onReachBottom() {
			if(this.page_num<this.total_page)
			{	
				this.getMyReport();
			}
			else{
				utils.showErrorToast("到底啦！")
			}
		},
	},
	onLoad() {
		this.user_id = app.globalData.user_id;
		if (this.user_id == null || this.user_id == '') {
			wx.showModal({
				content: '尚未登录',
				confirmText: '去登录',
				showCancel: true,
				success(res) {
					utils.toLogin();
				}
			});
		}
	},
	onShow() {
		if (this.user_id != null || this.user_id != '') {
			this.getMyReport();
		}
	}
};
</script>

<style>
page {
	height: 100%;
	background-color: #f7f7f7;
}
.nav {
	height: 100%;
}
.img-container{
	width: 100%;
	display:inline-block;                    //flex布局
	justify-content: center;         //水平轴线居中
}
.noImg{
	margin:0 auto;
}

</style>
