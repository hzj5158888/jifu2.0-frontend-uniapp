<template>
	<view class="content">
		<!--顶部栏开始-->
		<view class="cu-bar justify-right bg-white">
			<view class="action border-title">
				<text class="text-xl text-bold text-blue">{{ area }}校区</text>
				<text class="bg-gradual-blue" style="width:3rem"></text>
			</view>
			<view class="action" @click="changeArea" data-target="RadioModal">
				<text>切换校区</text>
				<text class="cuIcon-triangledownfill"></text>
			</view>
		</view>
		<!--顶部栏结束-->
		<!--轮播图开始-->
		<swiper class="screen-swiper" :class="dotStyle ? 'square-dot' : 'round-dot'" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500">
			<swiper-item v-for="(item, index) in swiperList" :key="index"><image :src="item.url" mode="aspectFill" ></image></swiper-item>
		</swiper>
		<!--轮播图结束-->
		<!-- 选择begin -->
		<view class="section-1">
				<navigator class="item left" open-type="navigate" url="/pages/report/teacherReport" hover-class="none">
					<image src="/static/index/teacher.png" mode="widthFix"></image>
					<view class="wenyue-font">教师报障</view>
					<view class="text-color-assist"></view>
				</navigator>
				<navigator class="item" open-type="navigate" url="/pages/report/studentReport" hover-class="none">
					<image src="/static/index/student.png" mode="widthFix"></image>
					<view class="wenyue-font">学生报障</view>
					<view class="text-color-assist"></view>
				</navigator>
		</view>
		<!-- 选择end -->
		<button open-type="contact" class="contact-btn text-white text-center bg-blue"><text class="cuIcon-service text-white "></text></button>
	</view>
</template>

<script>
const utils = require('../../utils/util.js');
const api = require('../../config/api.js');	
const app = getApp();
export default {
	data() {
		return {
			cardCur: 0,
			swiperList: [],
			dotStyle: false,
			towerStart: 0,
			direction: '',
			areaList: ['大学城', '中山'],
			area: "大学城",
			campus_id:"1"
		};
	},
	onLoad() {
		//this.TowerSwiper('swiperList');
		
		// 初始化towerSwiper 传已有的数组名即可
		
		let campus_id = wx.getStorageSync('campus_id')
		if(campus_id == null || campus_id ==""){
			wx.setStorageSync("campus_id",1);
			campus_id = 1;
			app.globalData.campus_id = 1;
		}
		
		this.campus_id = Number(campus_id);
		this.getCarousels(campus_id);
		if (campus_id == 1) {
			this.area = '大学城';
		} else {
			this.area = '中山';
		}
		this.showMsg(this.area)
	},

	methods: {
		showMsg(area){
			wx.showModal({
				title:"当前选择的是"+area+"校区",
				showCancel:false
			})
		},
		/**
		 * 获取轮播图
		 */
		getCarousels(campus_id) {
			let that = this
			utils.request(api.getCarousels+ campus_id +'/carousels',{},'GET','application/json').then(function(res){
				that.swiperList = res.data;
			})
			
		},
		setModalName(modalName) {
			this.modalName = modalName;
		},
		/**
		 * 切换校区
		 */
		changeArea() {
			let that = this;
			wx.showModal({
				title: '你确定要切换校区吗',
				complete: function(res) {
					if (res.confirm) {
						console.log(that.campus_id)
						if (that.campus_id == 1) {
							that.area = "中山";
							that.campus_id = 2;
							app.globalData.campus_id = 2;
							wx.setStorageSync('campus_id', 2);
							that.getCarousels(2)
							return;
						}
						if (that.campus_id == 2) {
							that.area = "大学城";
							that.campus_id = 1
							app.globalData.campus_id = 1;
							wx.setStorageSync('campus_id', 1);
							that.getCarousels(1)
							return;
						}
					}
				}
			});
		},
		DotStyle(e) {
			this.dotStyle = e.detail.value;
		},
		// cardSwiper
		cardSwiper(e) {
			this.cardCur = e.detail.current;
		},
		// towerSwiper
		// 初始化towerSwiper
		TowerSwiper(name) {
			let list = this[name];
			for (let i = 0; i < list.length; i++) {
				list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2));
				list[i].mLeft = i - parseInt(list.length / 2);
			}
			this.swiperList = list;
		},

		// towerSwiper触摸开始
		TowerStart(e) {
			this.towerStart = e.touches[0].pageX;
		},

		// towerSwiper计算方向
		TowerMove(e) {
			this.direction = e.touches[0].pageX - this.towerStart > 0 ? 'right' : 'left';
		},

		// towerSwiper计算滚动
		TowerEnd(e) {
			let direction = this.direction;
			let list = this.swiperList;
			if (direction == 'right') {
				let mLeft = list[0].mLeft;
				let zIndex = list[0].zIndex;
				for (let i = 1; i < this.swiperList.length; i++) {
					this.swiperList[i - 1].mLeft = this.swiperList[i].mLeft;
					this.swiperList[i - 1].zIndex = this.swiperList[i].zIndex;
				}
				this.swiperList[list.length - 1].mLeft = mLeft;
				this.swiperList[list.length - 1].zIndex = zIndex;
			} else {
				let mLeft = list[list.length - 1].mLeft;
				let zIndex = list[list.length - 1].zIndex;
				for (let i = this.swiperList.length - 1; i > 0; i--) {
					this.swiperList[i].mLeft = this.swiperList[i - 1].mLeft;
					this.swiperList[i].zIndex = this.swiperList[i - 1].zIndex;
				}
				this.swiperList[0].mLeft = mLeft;
				this.swiperList[0].zIndex = zIndex;
			}
			this.direction = '';
			this.swiperList = this.swiperList;
		},
	}
};
</script>

<style>
page 
{
	height: 100%;
	background-color: #f7f7f7;
}
		
	
.tower-swiper .tower-item {
	transform: scale(calc(0.5 + var(--index) / 10));
	margin-left: calc(var(--left) * 100upx - 150upx);
	z-index: var(--index);
}

.container {
	height: 300px;
	width: 80%;
	margin: 0 auto;
	background: white;
	border-radius: 15px;
	margin-top: 25px;
}


.contact-btn {
	position: fixed;
	bottom: 50rpx;
	right: 20px;
	height: 50px;
	width: 50px;
	border-radius: 50%;
}
.contactonline {
	display: block;
	width: 60px;
	position: fixed;
	bottom: 10rpx;
	right: 8px;
	text-align: center;
}

	.content {
		width: 100%;
		position: relative;
	}



	.section-1 {		
		margin: 0 auto;
		position: relative;
		background-color: #ffffff;
		margin-top: 60rpx;
		border-radius:  12rpx;
		padding: 60rpx 0;
		display: flex;
		margin-bottom: 30rpx;
		box-shadow:0 20rpx 20rpx -20rpx rgba($color: #333, $alpha: 0.1);
		width:90%;;

	}
	
	
	.item {
		flex: 1;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		
	}
	
	.left{
		border-right: 1px solid #000000;
	}
	
	.item:nth-child(1):after {
		content: '';
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		width: 2rpx;
		background-color: #fffff;
	} 
	
	image {
		width: 100rpx;
		margin-bottom: 20rpx;
	}
	
	.wenyue-font {
		font-size: 48rpx;
		margin-bottom: 10rpx;
	}	
</style>
