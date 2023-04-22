<script>
	export default {
		globalData: {  
			isLogin: false,
			//用户显示
			reportStatus:{
				 0:"待确认",
				 1:"待处理",
				 2:"已处理",
				 3:"已完成",
				 4:"无法处理",
				 5:"已撤销",
			},
			//队员显示
			MemreportShowStatus:{
				 0:"待确认",
				 1:"待处理",
				 2:"已处理",
				 3:"已完成",
				 4:"已拒绝",
				 5:"用户已撤销",
			},
			//队员操作
			MemreportChangeStatus:{
				 0:"待确认",
				 1:"待处理",
				 2:"已处理",
				 3:"已完成",
				 4:"已拒绝",
			},
			user_id :"",
			campus_id :1,
			member_id :"",
			member_campusId : ""//职员校区
		},
		onLaunch: function() {
			
		},
		onShow: function() {
		},
		onHide: function() {

		}
	}
</script>

<style lang="scss">
/*每个页面公共css */ 
	@import "./common/css/iconfont.css";
	@import "./common/css/animate.css";
	/* colorui */
	@import "./common/css/main.css";
	@import "./common/css/icon.css";
	@import "./common/css/animation.css";
	// @import "./colorui/icon.css";
	// @import "./colorui/main.css";
	@import '@icon-park/vue-next/styles/index.css';
</style>
