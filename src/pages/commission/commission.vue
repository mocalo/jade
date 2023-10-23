<script setup lang="ts">
	import { useGuessList } from '@/composables'
	import { useMemberStore } from '@/stores'
	import { ref } from 'vue'
	import type { CommissionResult } from '@/types/commission'
	import { queryMyCommission } from '@/services/commission'
	import { onLoad } from '@dcloudio/uni-app'
	import CommissionList from './commissionList.vue'
	import CommissionLogList from './commissionLogList.vue'
	import ScoreLogList from './scoreLogList.vue'
	// 获取屏幕边界到安全区域距离
	const { safeAreaInsets } = uni.getSystemInfoSync()

	const memberStore = useMemberStore()
	// 获取轮播图数据
	const commissionRes = ref<CommissionResult>()
	const getHomeBannerData = async () => {
		const res = await queryMyCommission()
		commissionRes.value = res.data
	}

	onLoad(async () => {
		await getHomeBannerData()
	})
	const commissionTabs = ref([
		{ payFlag: 1, title: '佣金列表', isRender: false },
		{ payFlag: 2, title: '佣金明细', isRender: false },
		{ payFlag: 3, title: '积分明细', isRender: false },
	])
	const activeIndex = ref(commissionTabs.value.findIndex((v) => v.payFlag === 1))
	const { guessRef, onScrolltolower } = useGuessList()
</script>

<template>
	<scroll-view enable-back-to-top @scrolltolower="onScrolltolower" class="viewport" scroll-y>
		<!-- 我的佣金 -->
		<view class="profile">
			<view class="components">
				<view class="toplist">
					<view class="topitem">
						<view class="topitem_2">
							<text> {{ commissionRes?.money }} </text>
						</view>
						<view class="topitem_1">
							<text> 我的佣金 </text>
						</view>
					</view>
					<view class="topitem">
						<view class="topitem_2">
							<text>{{ commissionRes?.score }} </text>
						</view>
						<view class="topitem_1">
							<text> 我的积分 </text>
						</view>
					</view>
				</view>
				<view class="bottomlist">
					<view class="bottomitem">
						<view class="bottomitem_1">
							<text>{{ commissionRes?.today_money }}</text>
						</view>
						<view class="bottomitem_2">
							<text> 今日佣金 </text>
						</view>
					</view>
					<view class="bottomitem">
						<view class="bottomitem_1">
							<text> {{ commissionRes?.total_money }} </text>
						</view>
						<view class="bottomitem_2">
							<text> 累计佣金 </text>
						</view>
					</view>
					<view class="bottomitem">
						<view class="bottomitem_1">
							<text> {{ commissionRes?.today_score }} </text>
						</view>
						<view class="bottomitem_2">
							<text> 今日积分 </text>
						</view>
					</view>
					<view class="bottomitem">
						<view class="bottomitem_1">
							<text> {{ commissionRes?.total_score }} </text>
						</view>
						<view class="bottomitem_2">
							<text> 累计积分 </text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fenge"></view>
		<!-- <view class="list">
			<navigator url="/pages/commission/commissionList" hover-class="none" class="item arrow">
				佣金列表
			</navigator>
		</view>
		<view class="list">
			<navigator url="/pages/commission/commissionLogList" hover-class="none" class="item arrow">
				佣金明细
			</navigator>
		</view>
		<view class="list">
			<navigator url="/pages/commission/scoreLogList" hover-class="none" class="item arrow">
				积分明细
			</navigator>
		</view> -->
		
		
		<view class="tabs">
			<text :class="activeIndex == index?' active item':'item'" v-for="(item, index) in commissionTabs"
				:key="item.title" @tap="
	  () => {
	    activeIndex = index
	    item.isRender = true
	  }
	">
				{{ item.title }}
			</text>
			<!-- 游标 -->
			<view class="cursor" :style="{ left: (activeIndex * 19)+9 + '%' }"></view>
		</view>
		
		<view class="tips">
			<text>来源/时间</text>
			<text>数量</text>
		</view>
		<!-- 滑动容器 -->
		<!-- <swiper class="swiper" :current="activeIndex" @change="activeIndex = $event.detail.current"> -->
			
			<CommissionList v-if="activeIndex==0"/>
			<CommissionLogList v-if="activeIndex==1"/>
			<ScoreLogList v-if="activeIndex==2"/>
		<!-- </swiper> -->
		<!-- <CommissionList/> -->
	</scroll-view>
</template>

<style lang="scss">
	page {
		height: 100%;
		overflow: hidden;
		background-color: #f7f7f8;
	}

	.viewport {
		height: 100%;
		background-repeat: no-repeat;
		//background-image: url(../../static/images/center_bg.png);
		background-size: 100% auto;
	}

	.fenge {
		margin: 40rpx 0rpx 0;
	}

	/* 用户信息 */
	.profile {
		margin: 20rpx 30rpx;
		border-radius: 20rpx;
		position: relative;
		align-items: center;
		height: 400rpx;
		background-color: #fff;
		box-shadow: 0rpx 10rpx 35rpx 10rpx #e6e6e6;

		.components {
			width: 100%;
			height: 100%;

			.toplist {
				width: 100%;
				height: 60%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.topitem {
					width: 50%;
					height: 100%;
					background-color: #fff;
					margin: 20rpx 20rpx 0;

					.topitem_1 {
						width: 100%;
						height: 20%;
						align-items: center;
						font-size: 20rpx;
						color: #999;
						text-align: center;
					}

					.topitem_2 {
						margin-top: 60rpx;
						width: 100%;
						height: 40%;
						display: flex;
						justify-content: center;
						align-items: center;
						text-align: center;
						font-size: 60rpx;
						color: #555;
					}
				}
			}

			.bottomlist {
				width: 100%;
				height: 40%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.bottomitem {
					width: 25%;
					height: 80%;
					background-color: #fff;
					margin: 5rpx 5rpx 0;

					.bottomitem_1 {
						width: 100%;
						height: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
						text-align: center;
						font-size: 36rpx;
						color: #555;
					}

					.bottomitem_2 {
						width: 100%;
						height: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
						text-align: center;
						font-size: 18rpx;
						color: #999;
					}
				}
			}
		}
	}

	/* 列表 */
	.list {
		padding: 0 20rpx;
		background-color: #fff;
		margin: 0rpx 20rpx 0;
		border-radius: 10rpx;

		.item {
			line-height: 90rpx;
			padding-left: 10rpx;
			font-size: 30rpx;
			color: #799372;
			border-top: 1rpx solid #ddd;
			position: relative;
			text-align: left;
			border-radius: 0;
			background-color: #fff;

			&::after {
				width: auto;
				height: auto;
				left: auto;
				border: none;
			}

			&:first-child {
				border: none;
			}

			&::after {
				right: 5rpx;
			}
		}

		.arrow::after {
			content: '\e6c2';
			position: absolute;
			top: 50%;
			color: #ccc;
			font-family: 'erabbit' !important;
			font-size: 32rpx;
			transform: translateY(-50%);
		}
	}

	.fenge {
		margin: 40rpx 0rpx 0;
	}

	.tabs {
		line-height: 60rpx;
		box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
		position: relative;
		z-index: 9;
		padding: 20rpx 20rpx 0rpx 30rpx;

		.active {
			color: #262626 !important;
			font-size: 32rpx!important;
		}

		.item {
			flex: 1;
			text-align: center;
			padding: 20rpx;
			font-size: 26rpx;
			color: #aaa;
			position: relative;
			z-index: 9;
		}

		.cursor {
			position: absolute;
			left: 10%;
			bottom: 8rpx;
			width: 10%;
			height: 15rpx;
			padding: 0 50rpx;
			background-color: #11e0b6;
			/* 过渡效果 */
			transition: all 0.4s;
			z-index: 2;
		}
	}
	.tips {
		font-size: 24rpx;
		color: #777;
		display: flex;
		margin: 30rpx 70rpx 20rpx;
		justify-content: space-between;
	}
	// swiper
	.swiper {
		height: 400rpx;
	}
</style>