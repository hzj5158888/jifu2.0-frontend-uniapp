<template>
	<view class="body">
		<view v-if="articles.length > 0">
			<view class="cu-card case" v-for="(item,index) in articles" >
				<view class="cu-item shadow" @click="openArticle(item.id)">
					<view class="image" v-if="item.cover">
						<image v-bind:src="item.cover" mode="widthFix"></image>
					</view>
					<view class="cu-list">
						<view class="cu-item">
							<view class="content flex-sub">
								<view class="text-grey">{{item.title}}</view>
								<view class="text-gray text-sm flex justify-between">
									{{item.description}}
								</view>
							</view>
						</view>
					</view>
				</view>
		</view>
		</view>
		<view v-else>
			<view class="img-container text-center text-gray">
				<image src="../../static/images/noform.png" class="noImg"></image>
				<view >暂无文章</view>
			</view>	
		</view>
	</view>
</template>

<script>
	const utils = require('../../utils/util.js');
	const api = require('../../config/api.js');
	export default {
		data() {
			return {
				articles: [],
				currentOffset: 1,
				total:0
			};
		},
		onReachBottom() {
			this.loadMore();
		},
		methods: {
			IsCard(e) {
				this.isCard = e.detail.value
			},
			getArticles(offset = 1) {
				utils.request(api.article, {
					page_num: offset
				}, "GET", 'application/json').then(res => {
					if (res.code == 200) {
						this.articles.push(...res.data.list);
					}
				});
			},
			loadMore() {
				this.getArticles(this.currentOffset);
				this.currentOffset += 1;
			},
			openArticle(id) {
				uni.navigateTo({
				    url: 'web?id='+id
				});
			}
		},
		onLoad(options) {
			this.getArticles();
		}
	};
</script>

<style>

	.shadow {
		box-shadow: 0px 2px 5px 1px #ddd;
	}
	.flex-sub {
		padding: 0.35em;
	}
	.img-container{
		width: 100%;
		display:inline-block;                    //flex布局
		justify-content: center;         //水平轴线居中
	}
</style>
