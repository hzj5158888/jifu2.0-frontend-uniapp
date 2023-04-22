<template>
	<view>
		<view class="title">
			<text>{{article.title}}</text>
		</view>
		<view class="author">
			<text>{{article.author}}</text>
		</view>
		<rich-text v-bind:nodes="article.content"></rich-text>
	</view>
</template>

<script>
	const utils = require('../../utils/util.js');
	const api = require('../../config/api.js');
	export default {
		data() {
			return {
				id: 0,
				article: {}
			}
		},
		methods: {
			getArticle() {
				// utils.request(api.article+this.id,
				// 	"GET", 'application/json').then(res => {
				// 	if (res.code == 200) {
				// 		this.article = res.data;
				// 		wx.setNavigationBarTitle({
				// 		  title: this.article.title
				// 		});
				// 	}
				// });
			},
		},
		onLoad(option) {
			this.id = option.id;
			this.getArticle();
		}
	}
</script>

<style>
.title {
	font-size: 2em;
	font-weight: bold;
	text-align: center;
}
.author {
	font-size: 0.8em;
	color: #0080FF;
	text-align: center;
}
</style>
