<template>
	<view>
<!-- 			   <button open-type="contact" bindcontact="handleContact"  id="contact" >a</button> -->
			  <view class="cu-list grid col-1 ">
			    <view class="cu-item" v-for="item in cuIconList" @click="goUrl(item.url)"  v-key="index">
 					<view :class="'cuIcon-'+(item.icon)+' text-'+(item.color)"  ></view> 
					   <label for="contact" v-if="item.name=='在线咨询'" ><text> {{item.name}}</text></label>
					  <text v-else >{{item.name}}</text>
			    </view>
			  </view>
	</view>
</template>

<script>
	const utils = require('../../utils/util.js');
	export default {
		data() {
			return {
				cuIconList: [ {
				  icon: 'form',
				  color: 'red',
				  name: '招新申请',
				  url:'../report/stu_report'
				},
/* 				{
				  icon: 'service',
				  color: 'orange',
				  badge: 1,
				  name: '在线咨询'
				}, */ 
				{
				  icon: 'repairfill',
				  color: 'yellow',
				  badge: 0,
				  name: '网站开发',
				  url:'../multiunit/develop'
				}],
				modalName: null,
				gridCol: 2,
				gridBorder: false,
				menuBorder: false,
				menuArrow: false,
				menuCard: false,
				skin: false,
				listTouchStart: 0,
				listTouchDirection: null,
			};
		},
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			Gridchange(e) {
				this.gridCol = e.detail.value
			},
			Gridswitch(e) {
				this.gridBorder = e.detail.value
			},
			MenuBorder(e) {
				this.menuBorder = e.detail.value
			},
			MenuArrow(e) {
				this.menuArrow = e.detail.value
			},
			MenuCard(e) {
				this.menuCard = e.detail.value
			},
			SwitchSex(e) {
				this.skin = e.detail.value
			},

			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},

			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},

			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			},			  
			goUrl(url){
			  //console.log(e)
			  wx.showModal({
			  	title:"开发中，敬请期待",
				showCancel:false
			  })
			  // TODO
			  //    wx.navigateTo({
			  //   url: url,
			  // })
			 
			}
		}
	}
</script>

<style>
	.page {
		height: 100Vh;
		width: 100vw;
	}

	.page.show {
		overflow: hidden;
	}

	.switch-sex::after {
		content: "\e716";
	}

	.switch-sex::before {
		content: "\e7a9";
	}

	.switch-music::after {
		content: "\e66a";
	}

	.switch-music::before {
		content: "\e6db";
	}
</style>
