<template>
	<view>
	<form  @submit="formSubmit">
		<view class="cu-form-group">
			<view class="title">学生姓名：</view>
			<input :value= memberDetail.name name="name"></input>
		</view>
        <view class="cu-form-group">
			<view class="title">校区：</view>
			<input :value= memberDetail.campus name="campus"></input>
		</view>
        <view class="cu-form-group">
			<view class="title">部门：</view>
			<input :value= memberDetail.dept name="dept"></input>
		</view>
        <view class="cu-form-group">
			<view class="title">职位：</view>
			<input :value= memberDetail.position name="position"></input>
		</view>
        <view class="cu-form-group">
			<view class="title">任期结束：</view>
			<input :value= memberDetail.end_time name="end_time"></input>
		</view>
			
		<view class="padding flex flex-direction">
			<button form-type="submit" class='cu-btn bg-blue lg'>提交</button>
			<button form-type="reset" class='cu-btn bg-grey lg margin-top'>重置</button>
		</view>

	</form>
	
<canvas canvas-id="attendCanvasId" class="mycanvas" :style="{width:canvasWidth,height:canvasHeight}"></canvas>

	</view>
</template>

<script>
import { ColorCard } from '@icon-park/vue-next';

	const utils = require('../../utils/util.js')
	const api = require('../../config/api.js'); 
	const app = getApp();
	export default{
		data(){
				return{
					    id: -1,
                        member_id:"",
                        memberDetail:"",
						canvasWidth:0,
						canvasHeight:0
			}			
		},
		methods:{
			formSubmit: function (e) {
                   var dpet_list = new Array("技术部", "网络部", "策划部")
                   var pos_list = new Array("小干", "部长", "队长")
                   var campus_list = new Array("大学城校区", "中山校区", "云浮校区", "测试")
                
                   var campus_name = e.detail.value.campus
                   var position = e.detail.value.position
				   var name = e.detail.value.name
                   var dept_name = e.detail.value.dept
       
				   if (name.length < 1) {
                        wx.showToast({
                        title: '姓名不能为空',
                        icon: 'none',
                        duration: 2000
                        })
                        return;
				   }
                   if (dpet_list.indexOf(dept_name) == -1) {
                        wx.showToast({
                            title: '请输入正确的部门名(如：技术部)',
                            icon: 'none',
                            duration: 2000
                        })
                        return;
                   }
                   if (pos_list.indexOf(position) == -1) {
                        wx.showToast({
                            title: '请输入正确的职位名(小干，部长，队长)',
                            icon: 'none',
                            duration: 2000
                        })
                        return;
                   }
                   if (campus_list.indexOf(campus_name) == -1) {
                        wx.showToast({
                            title: '请输入正确的校区名(如：大学城校区)',
                            icon: 'none',
                            duration: 2000
                        })
                        return;
                   }

					var data = {};
                    var data_size = 0;
                    for (const [key, value] of Object.entries(e.detail.value)) {
                        if (this.memberDetail[key] == value)
                            continue;
                        
                        data_size++;
                        data[key] = value;
                    }

                    if (data_size == 0)
                    {
                        utils.showErrorToast('无修改')
                        return   
                    }

				    utils.request(  api.admin + 'member/info/modify/' + this.member_id, 
                                    data, 
                                    "PUT", 
                                    'application/json').then(res=>{
					if (res.code == 200){
						// utils.showSuccessToast(res.msg)
                        wx.setStorageSync("member_status", res.data.member_status)
						wx.showModal({
							content:'修改成功',
							showCancel:false,
							success(res){
								if(res.confirm)
                                {
                                    var pages = getCurrentPages()
                                    var prevpage = pages[pages.length - 2]

                                    prevpage.onShow({'refresh': 1});
                                    wx.navigateBack({
	                                    delta: 1,
                                    })
								}
							}
							
						})
					}else{
						utils.showErrorToast(res.msg)
					}
				})

					
			},
			onShareAppMessage: function () {
					
			},
					  
		},
		onLoad(options){
            let memberDetail_pass = JSON.parse(decodeURIComponent(options.memberDetail))
			this.memberDetail = memberDetail_pass
            this.member_id = this.memberDetail.member_id
            this.memberDetail.end_time = utils.formatDate(this.memberDetail.end_time)
		}
		
	}
</script>

<style>
	.container{
	  padding: 2rem;
	  font-size: 1rem;
	  line-height: 2rem;
	}
	
	.input{
	  font-size: 0.7rem;
	  color: black;
	  flex-grow: 3;
	  border: 1px;
	  display: inline-block;
	  border-radius: 0.3rem;
	  box-shadow: 0 0 0.15rem #0080ff;
	  padding: 0.3rem;
	}
	
	.inputbox{
	  width: 700rpx;
	  height: 50rpx;
	  margin-left: 10rpx;
	  margin-right: 10rpx;
	  margin-top: 10rpx;
	}
	
	
	.textarea {
	  width: 700rpx;
	  height: 500rpx;
	  margin-left: 10rpx;
	  margin-right: 10rpx;
	  margin-top: 10rpx;
	}
	
	.submitbtn{
	  width: 650rpx;
	  height: 100rpx;
	  margin: 0 auto;
	  margin-top: 10px;
	  margin-bottom: 10px;
	}
	.mycanvas{
		position:absolute;
		left: -1000px;
		top: 1000px;
	}
</style>
