<script setup lang="ts">
import { queryEarningsLog, queryMyEarnings } from '@/services/earnings'
import { getCouponByTypeAPI } from '@/services/coupon'
import type { EarningsLogItem, EarningsResult } from '@/types/earnings'
import type { PageParams } from '@/types/global'
import { ref } from 'vue'

import { timechange } from '@/utils/timechange'
import { onLoad } from '@dcloudio/uni-app'
// 请求参数
const queryParams: Required<PageParams> = {
  page: 1,
  pageSize: 20,
}

const earningsResult = ref<EarningsResult>()
//获取收益数据
const getEarningsData = async () => {
  const res = await queryMyEarnings()
  earningsResult.value = res.data
}

// 猜你喜欢的列表
const guessList = ref<EarningsLogItem[]>([])
// 已结束标记
const finish = ref(false)
// 获取猜你喜欢数据
const getHomeGoodsGuessLikeData = async () => {
  // 退出分页判断
  if (finish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }
  const res = await queryEarningsLog(queryParams)
  // guessList.value = res.result.items
  // 数组追加
  guessList.value.push(...res.data.items)
  // 分页条件
  if (queryParams.page < res.data.page) {
    // 页码累加
    queryParams.page++
  } else {
    finish.value = true
  }
}
// 重置数据
const resetData = () => {
  queryParams.page = 1
  guessList.value = []
  finish.value = false
}
// 组件挂载完毕
onLoad(async () => {
  await getEarningsData()
  await getHomeGoodsGuessLikeData()
})
// 暴露方法
defineExpose({
  resetData,
  getMore: getHomeGoodsGuessLikeData,
})
</script>

<template>
	
	<view class="profile">
		<view class="components">
			<view class="toplist">
				<view class="topitem">
					<view class="topitem_2">
						<text> {{ earningsResult?.income }} </text>
					</view>
					<view class="topitem_1">
						<text> 累计收益 </text>
					</view>
				</view>
				<view class="topitem">
					<view class="topitem_2">
						<text>{{ earningsResult?.order_count }} </text>
					</view>
					<view class="topitem_1">
						<text> 订单总数 </text>
					</view>
				</view>
			</view>
		</view>
	</view>
	
  
  
  <view class="tips">
  	<text>来源/时间</text>
  	<text>数量</text>
  </view>
  <!-- 猜你喜欢 -->
  
  <view class="guess">
  	<navigator class="guess-item" v-for="item in guessList" :key="item.id">
  		<view class="image">
  
  			<view class="image1">
  				<view class="text1"> 平台交易 </view>
  				<view class="text2">
  					<view class="text3">
  						{{ timechange(item.create_time) }}
  					</view>
  					<view class="text4"> <text class="price"></text>收益{{ item.income }} </view>
  				</view>
  			</view>
  		</view>
  	</navigator>
  </view>
  
  <view class="loading-text">
    {{ finish ? '没有更多数据~' : '正在加载...' }}
  </view>
</template>

<style lang="scss">
	page {
		background-color: #f3f3f3;
	}
:host {
  display: block;
}
.fenge {
  display: flex;
  justify-content: center;
  line-height: 1;
  padding: 36rpx 0 40rpx;
  font-size: 32rpx;
  .text {
    font-size: 28rpx;
    color: #799372;
    padding: 20rpx 0 0;
  }
}
.profile {
		margin: 20rpx 30rpx;
		border-radius: 20rpx;
		position: relative;
		align-items: center;
		height: 200rpx;
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
						margin-top: 10rpx;
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
	
	/* 猜你喜欢 */
	.guess {
		//display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 20rpx;
		margin: 0 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
		.guess-item {
			width: 100%;
			padding: 5rpx 0rpx 5rpx;
			border-radius: 10rpx;
			overflow: hidden;
			border-bottom: 1px solid #ddd;
		}
	
		.image {
			//background-image: url(@/static/images/commission.png);
			background-size: cover;
			display: flex;
			justify-content: space-between;
			padding: 20rpx;
	
	
			.image1 {
				width: 100%;
				height: 100%;
	
				.text1 {
					width: 100%;
					text-align: left;
					font-size: 28rpx;
					color: #333;
					margin-bottom: 20rpx;
					position: relative;
					left: -10rpx;
				}
	
				.text2 {
					width: 100%;
					text-align: left;
					font-size: 20rpx;
					color: #777;
					display: flex;
					justify-content: space-between;
				}
			}
		}
	}
	
	.tips {
		font-size: 24rpx;
		color: #777;
		display: flex;
		margin: 30rpx 70rpx 20rpx;
		justify-content: space-between;
	}
// 加载提示文字
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>
